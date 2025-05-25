import { supabase } from './supabase';
import type { Task, CreateTaskDTO, UpdateUserTaskProgressDTO, Achievement, Category, UserTaskProgress, UserAchievement } from '../types/task';

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      achievements (*),
      categories!inner (id, name, color)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }

  // Verificar que los logros se están obteniendo correctamente
  data.forEach(task => {
    if (!task.achievements) {
      console.warn(`Tarea ${task.id} no tiene logros asociados`);
    } else {
      console.log(`Tarea ${task.id} tiene ${task.achievements.length} logros:`, task.achievements);
    }
  });

  return data as Task[];
}

export async function fetchUserTaskProgress(user_id: string, task_ids: number[]): Promise<UserTaskProgress[]> {
  const { data, error } = await supabase
    .from('user_task_progress')
    .select('*')
    .eq('user_id', user_id)
    .in('task_id', task_ids);

  if (error) throw error;
  return data as UserTaskProgress[];
}

export async function fetchUserAchievements(user_id: string): Promise<UserAchievement[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw error;
  return data as UserAchievement[];
}

export async function createTask(task: CreateTaskDTO): Promise<Task> {
  // Primero obtenemos el nombre de la categoría
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', task.category_id)
    .single();

  if (categoryError) {
    console.error('Error al obtener la categoría:', categoryError);
    throw categoryError;
  }

  // Creamos la tarea con ambas columnas de categoría
  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description,
      category_id: task.category_id,
      category: category.name, // Añadimos el nombre de la categoría
      state: task.state
    }])
    .select()
    .single();

  if (taskError) {
    console.error('Error al crear la tarea:', taskError);
    throw taskError;
  }

  // Si hay logros, los creamos en una transacción separada
  if (task.achievements && task.achievements.length > 0) {
    try {
      const achievements = task.achievements.map(achievement => ({
        task_id: newTask.id,
        title: achievement.title,
        description: achievement.description,
        requirement: achievement.requirement,
        xp_reward: achievement.xp_reward
      }));

      const { error: achievementsError } = await supabase
        .from('achievements')
        .insert(achievements);

      if (achievementsError) {
        console.error('Error al crear los logros:', achievementsError);
        // Si falla la creación de logros, eliminamos la tarea
        await supabase
          .from('tasks')
          .delete()
          .eq('id', newTask.id);
        throw achievementsError;
      }
    } catch (error) {
      console.error('Error en la transacción de logros:', error);
      // Si hay cualquier error, eliminamos la tarea
      await supabase
        .from('tasks')
        .delete()
        .eq('id', newTask.id);
      throw error;
    }
  }

  // Obtenemos la tarea completa con sus logros
  const { data: completeTask, error: fetchError } = await supabase
    .from('tasks')
    .select(`
      *,
      achievements (*),
      categories!inner (id, name, color)
    `)
    .eq('id', newTask.id)
    .single();

  if (fetchError) {
    console.error('Error al obtener la tarea completa:', fetchError);
    throw fetchError;
  }

  return completeTask as Task;
}

export async function addUserAchievement(user_id: string, achievement_id: number): Promise<UserAchievement> {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert([{
        user_id: user_id,
        achievement_id: achievement_id,
        achieved_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.warn(`Logro ${achievement_id} ya conseguido por el usuario ${user_id}.`);
        const { data: existing, error: fetchExistingError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user_id)
          .eq('achievement_id', achievement_id)
          .single();
          if (fetchExistingError) console.error('Error fetching existing user achievement:', fetchExistingError);
          return existing as UserAchievement;
      } else {
        console.error('Error al añadir logro de usuario:', error);
        throw error;
      }
    }

    return data as UserAchievement;
}

export async function updateUserTaskProgress({ task_id, count }: UpdateUserTaskProgressDTO, user_id: string): Promise<UserTaskProgress> {
  const { data: existingProgress, error: fetchError } = await supabase
    .from('user_task_progress')
    .select('progress')
    .eq('user_id', user_id)
    .eq('task_id', task_id)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
     console.error('Error fetching existing progress for update:', fetchError);
     throw fetchError;
  }

  const currentProgressValue = existingProgress?.progress || 0;

  // Llamar a la función register_user_task_action
  const { error: actionError } = await supabase
    .rpc('register_user_task_action', {
      p_user_id: user_id,
      p_task_id: task_id
    });

  if (actionError) {
    console.error('Error al registrar la acción del usuario:', actionError);
    throw actionError;
  }

  const { data: progress, error: progressError } = await supabase
    .from('user_task_progress')
    .upsert({
      user_id: user_id,
      task_id: task_id,
      count: count,
      progress: currentProgressValue,
    }, { onConflict: 'user_id, task_id' })
    .select()
    .single();

  if (progressError) {
    console.error('Error al actualizar el progreso del usuario:', progressError);
    throw progressError;
  }

  return progress as UserTaskProgress;
}

export async function deleteTask(id: number) {
  try {
    console.log('Iniciando eliminación de tarea:', id);

    // 1. Verificar registros en user_actions
    const { data: userActions, error: userActionsError } = await supabase
      .from('user_actions')
      .select('*')
      .eq('task_id', id);

    if (userActionsError) {
      console.error('Error al verificar acciones de usuario:', userActionsError);
      throw userActionsError;
    }

    console.log('Acciones de usuario encontradas:', userActions);

    // 2. Primero obtenemos los IDs de los logros asociados a la tarea
    const { data: achievements, error: fetchError } = await supabase
      .from('achievements')
      .select('id')
      .eq('task_id', id);

    if (fetchError) {
      console.error('Error al obtener logros:', fetchError);
      throw fetchError;
    }

    console.log('Logros encontrados:', achievements);
    const achievementIds = achievements?.map(a => a.id) || [];

    // 3. Eliminamos los logros de usuario asociados
    if (achievementIds.length > 0) {
      console.log('Eliminando logros de usuario para IDs:', achievementIds);
      const { data: deletedUserAchievements, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .delete()
        .in('achievement_id', achievementIds)
        .select();

      if (userAchievementsError) {
        console.error('Error al eliminar logros de usuario:', userAchievementsError);
        throw userAchievementsError;
      }
      console.log('Logros de usuario eliminados:', deletedUserAchievements);
    }

    // 4. Eliminamos el progreso de los usuarios para esta tarea
    console.log('Eliminando progreso de usuarios para tarea:', id);
    const { data: deletedProgress, error: progressError } = await supabase
      .from('user_task_progress')
      .delete()
      .eq('task_id', id)
      .select();

    if (progressError) {
      console.error('Error al eliminar progreso:', progressError);
      throw progressError;
    }
    console.log('Progreso eliminado:', deletedProgress);

    // 5. Eliminamos las acciones de usuario asociadas a la tarea usando SQL directo
    if (userActions && userActions.length > 0) {
      console.log('Eliminando acciones de usuario para tarea:', id);
      const { error: actionsError } = await supabase.rpc('delete_user_actions_by_task', {
        p_task_id: id
      });

      if (actionsError) {
        console.error('Error al eliminar acciones de usuario:', actionsError);
        throw actionsError;
      }
      console.log('Acciones de usuario eliminadas');
    }

    // 6. Eliminamos los logros de la tarea
    if (achievementIds.length > 0) {
      console.log('Eliminando logros de la tarea:', id);
      const { data: deletedAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .delete()
        .eq('task_id', id)
        .select();

      if (achievementsError) {
        console.error('Error al eliminar logros:', achievementsError);
        throw achievementsError;
      }
      console.log('Logros eliminados:', deletedAchievements);
    }

    // 7. Finalmente eliminamos la tarea
    console.log('Eliminando tarea:', id);
    const { data: deletedTask, error: taskError } = await supabase
    .from('tasks')
    .delete()
      .eq('id', id)
      .select();

    if (taskError) {
      console.error('Error al eliminar tarea:', taskError);
      throw taskError;
    }

    // Verificar que la tarea realmente se eliminó
    const { data: verifyTask, error: verifyError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (verifyError) {
      console.error('Error al verificar la eliminación:', verifyError);
      throw verifyError;
    }

    if (!verifyTask) {
      console.log('Tarea eliminada correctamente');
    } else {
      console.error('La tarea sigue existiendo después de intentar eliminarla');
      throw new Error('La tarea no se eliminó correctamente');
    }

    return deletedTask;
  } catch (error) {
    console.error('Error al eliminar la tarea y sus registros relacionados:', error);
    throw error;
  }
}

export async function getTasksByCategory(categoryId: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      achievements (*),
      categories!inner (id, name, color)
    `)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Task[];
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  try {
    console.log('>>> [updateTask] Iniciando actualización de tarea:', { id, task });

    // Primero verificamos que la tarea existe
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingTask) {
      console.error('>>> [updateTask] Error al verificar la tarea:', checkError);
      throw new Error('La tarea no existe');
    }

    console.log('>>> [updateTask] Tarea encontrada:', existingTask);

    // Actualizamos la tarea
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        category_id: task.category_id,
        state: task.state
      })
      .eq('id', id);

    if (updateError) {
      console.error('>>> [updateTask] Error al actualizar la tarea:', updateError);
      throw updateError;
    }

    console.log('>>> [updateTask] Tarea actualizada correctamente');

    // Si hay logros, los actualizamos
    if (task.achievements && task.achievements.length > 0) {
      console.log('>>> [updateTask] Procesando logros:', task.achievements);

      // Primero obtenemos los logros existentes
      const { data: existingAchievements, error: fetchError } = await supabase
        .from('achievements')
        .select('*')
        .eq('task_id', id);

      if (fetchError) {
        console.error('>>> [updateTask] Error al obtener logros existentes:', fetchError);
        throw fetchError;
      }

      console.log('>>> [updateTask] Logros existentes:', existingAchievements);

      // Actualizamos o creamos los logros
      for (const achievement of task.achievements) {
        console.log('>>> [updateTask] Procesando logro:', achievement);
        const existingAchievement = existingAchievements?.find(a => a.title === achievement.title);
        
        if (existingAchievement) {
          console.log('>>> [updateTask] Actualizando logro existente:', existingAchievement);
          // Actualizamos el logro existente
          const { error: updateError } = await supabase
            .from('achievements')
            .update({
              title: achievement.title,
              description: achievement.description || '',
              requirement: achievement.requirement,
              xp_reward: achievement.xp_reward
            })
            .eq('id', existingAchievement.id);

          if (updateError) {
            console.error('>>> [updateTask] Error al actualizar logro:', updateError);
            throw updateError;
          }
          console.log('>>> [updateTask] Logro actualizado correctamente');
        } else {
          console.log('>>> [updateTask] Creando nuevo logro');
          // Creamos un nuevo logro
          const { error: insertError } = await supabase
            .from('achievements')
            .insert({
              task_id: id,
              title: achievement.title,
              description: achievement.description || '',
              requirement: achievement.requirement,
              xp_reward: achievement.xp_reward || 50
            });

          if (insertError) {
            console.error('>>> [updateTask] Error al crear nuevo logro:', insertError);
            throw insertError;
          }
          console.log('>>> [updateTask] Nuevo logro creado correctamente');
        }
      }

      // Eliminamos los logros que ya no existen
      const currentAchievementTitles = task.achievements.map(a => a.title);
      const achievementsToDelete = existingAchievements?.filter(a => !currentAchievementTitles.includes(a.title)) || [];

      console.log('>>> [updateTask] Logros a eliminar:', achievementsToDelete);

      for (const achievement of achievementsToDelete) {
        const { error: deleteError } = await supabase
          .from('achievements')
          .delete()
          .eq('id', achievement.id);

        if (deleteError) {
          console.error('>>> [updateTask] Error al eliminar logro:', deleteError);
          throw deleteError;
        }
        console.log('>>> [updateTask] Logro eliminado correctamente:', achievement.id);
      }
    }

    // Obtenemos la tarea actualizada con sus relaciones
    console.log('>>> [updateTask] Obteniendo tarea actualizada con relaciones');
    const { data: updatedTask, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        achievements (*),
        categories (
          id,
          name,
          color
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('>>> [updateTask] Error al obtener la tarea actualizada:', fetchError);
      throw fetchError;
    }

    console.log('>>> [updateTask] Tarea actualizada final:', updatedTask);
    return updatedTask as Task;
  } catch (error) {
    console.error('>>> [updateTask] Error en updateTask:', error);
    throw error;
  }
}

export async function addAchievementsToTask(taskId: number, achievements: { title: string; description: string; requirement: number; xp_reward?: number }[]) {
  try {
    const achievementsToInsert = achievements.map(achievement => ({
      task_id: taskId,
      title: achievement.title,
      description: achievement.description,
      requirement: achievement.requirement,
      xp_reward: achievement.xp_reward || 50 // Valor por defecto de 50 XP
    }));

    const { data, error } = await supabase
      .from('achievements')
      .insert(achievementsToInsert)
      .select();

    if (error) {
      console.error('Error al añadir logros:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en addAchievementsToTask:', error);
    throw error;
  }
} 