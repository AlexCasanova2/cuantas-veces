-- Primero eliminamos la función existente si existe
drop function if exists public.register_user_action(uuid, bigint);

-- Función para registrar una acción del usuario y actualizar XP y logros
create or replace function public.register_user_action(
  p_user_id uuid,
  p_task_id bigint
) returns void as $$
declare
  v_task record;
  v_achievement record;
  v_new_xp integer;
  v_new_level integer;
  v_xp_for_next_level integer;
  v_mission record;
  v_progress record;
begin
  -- Registrar la acción en user_actions
  insert into user_actions (user_id, task_id, action_type, increment_value)
  values (p_user_id, p_task_id, 'increment', 1);

  -- Obtener información de la tarea
  select * into v_task
  from tasks
  where id = p_task_id;

  if not found then
    raise exception 'Tarea no encontrada';
  end if;

  -- Obtener o crear progreso del usuario
  select * into v_progress
  from user_task_progress
  where user_id = p_user_id and task_id = p_task_id;

  if not found then
    insert into user_task_progress (user_id, task_id, count, progress)
    values (p_user_id, p_task_id, 1, 0)
    returning * into v_progress;
  else
    update user_task_progress
    set count = count + 1,
        progress = least(100, (count + 1) * 100 / greatest(1, v_task.requirement))
    where user_id = p_user_id and task_id = p_task_id
    returning * into v_progress;
  end if;

  -- Verificar logros pendientes para esta tarea
  for v_achievement in (
    select a.*
    from achievements a
    where a.task_id = p_task_id
    and not exists (
      select 1
      from user_achievements ua
      where ua.user_id = p_user_id
      and ua.achievement_id = a.id
    )
  ) loop
    -- Verificar si se cumple el requisito del logro
    if v_progress.count >= v_achievement.requirement then
      -- Añadir logro al usuario
      insert into user_achievements (user_id, achievement_id, achieved_at)
      values (p_user_id, v_achievement.id, now());

      -- Añadir XP por desbloquear logro
      update user_levels
      set current_xp = current_xp + coalesce(v_achievement.xp_reward, 50) -- XP por defecto 50 si no está definida
      where user_id = p_user_id
      returning current_xp, level, xp_to_next_level into v_new_xp, v_new_level, v_xp_for_next_level;

      -- Registrar en xp_log
      insert into xp_log (user_id, task_id, xp_earned, source)
      values (p_user_id, p_task_id, coalesce(v_achievement.xp_reward, 50), 'achievement_unlocked');

      -- Verificar si se ha subido de nivel
      if v_new_xp >= v_xp_for_next_level then
        -- Calcular nuevo nivel y XP necesaria para el siguiente
        v_new_level := v_new_level + 1;
        v_xp_for_next_level := v_xp_for_next_level * 1.5; -- Aumentar XP necesaria en un 50%

        -- Actualizar nivel, XP actual y XP necesaria
        update user_levels
        set level = v_new_level,
            current_xp = v_new_xp - v_xp_for_next_level, -- Resetear XP actual restando la XP necesaria
            xp_to_next_level = v_xp_for_next_level
        where user_id = p_user_id;
      end if;

      -- Verificar misiones que requieren este logro
      for v_mission in (
        select m.*
        from missions m
        join user_missions um on um.mission_id = m.id
        where um.user_id = p_user_id
        and um.state = 'in_progress'
        and m.achievement_requirements @> jsonb_build_array(
          jsonb_build_object(
            'taskId', p_task_id,
            'achievementId', v_achievement.id
          )
        )
      ) loop
        -- Verificar si la misión está completa
        if (
          select count(*) = (
            select jsonb_array_length(m.achievement_requirements)
            from missions m
            where m.id = v_mission.id
          )
          from user_achievements ua
          where ua.user_id = p_user_id
          and ua.achievement_id in (
            select jsonb_array_elements(m.achievement_requirements)->>'achievementId'::text
            from missions m
            where m.id = v_mission.id
          )
        ) then
          -- Completar la misión
          update user_missions
          set state = 'completed',
              completed_at = now()
          where user_id = p_user_id
          and mission_id = v_mission.id;

          -- Añadir XP por completar misión
          update user_levels
          set current_xp = current_xp + v_mission.xp_reward
          where user_id = p_user_id;

          -- Registrar en xp_log
          insert into xp_log (user_id, task_id, xp_earned, source)
          values (p_user_id, p_task_id, v_mission.xp_reward, 'mission_completed');
        end if;
      end loop;
    end if;
  end loop;
end;
$$ language plpgsql security definer;

-- Función para actualizar la XP de logros existentes
create or replace function public.update_existing_achievements_xp()
returns void as $$
declare
  v_user record;
  v_achievement_count integer;
begin
  -- Para cada usuario
  for v_user in select id from auth.users loop
    -- Contar logros desbloqueados
    select count(*) into v_achievement_count
    from user_achievements
    where user_id = v_user.id;

    -- Actualizar XP (50 XP por logro)
    update user_levels
    set current_xp = v_achievement_count * 50
    where user_id = v_user.id;

    -- Registrar en xp_log para cada logro existente
    insert into xp_log (user_id, xp_earned, source)
    select v_user.id, 50, 'achievement_sync'
    from user_achievements ua
    where ua.user_id = v_user.id
    and not exists (
      select 1 from xp_log xl
      where xl.user_id = v_user.id
      and xl.source = 'achievement_sync'
      and xl.created_at > now() - interval '1 minute'
    );
  end loop;
end;
$$ language plpgsql security definer;

-- Ejecutar la actualización de XP para logros existentes
select public.update_existing_achievements_xp(); 