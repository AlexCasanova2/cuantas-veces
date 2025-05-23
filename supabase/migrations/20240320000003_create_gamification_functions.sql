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
begin
  -- Obtener información de la tarea
  select * into v_task
  from tasks
  where id = p_task_id and user_id = p_user_id;

  if not found then
    raise exception 'Tarea no encontrada o no pertenece al usuario';
  end if;

  -- Incrementar el contador de la tarea
  update tasks
  set count = count + 1,
      progress = least(100, (count + 1) * 100 / greatest(1, requirement))
  where id = p_task_id
  returning * into v_task;

  -- Verificar logros
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
    if v_task.count >= v_achievement.requirement then
      -- Añadir logro al usuario
      insert into user_achievements (user_id, achievement_id, unlocked_at)
      values (p_user_id, v_achievement.id, now());

      -- Añadir XP por desbloquear logro
      update user_levels
      set current_xp = current_xp + 50 -- 50 XP por logro
      where user_id = p_user_id
      returning current_xp, level, xp_to_next_level into v_new_xp, v_new_level, v_xp_for_next_level;

      -- Registrar en xp_log
      insert into xp_log (user_id, task_id, xp_earned, source)
      values (p_user_id, p_task_id, 50, 'achievement_unlocked');

      -- Verificar si se ha subido de nivel
      if v_new_xp >= v_xp_for_next_level then
        -- Calcular nuevo nivel y XP necesaria para el siguiente
        v_new_level := v_new_level + 1;
        v_xp_for_next_level := v_xp_for_next_level * 1.5; -- Aumentar XP necesaria en un 50%

        -- Actualizar nivel y XP necesaria
        update user_levels
        set level = v_new_level,
            xp_to_next_level = v_xp_for_next_level
        where user_id = p_user_id;
      end if;
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