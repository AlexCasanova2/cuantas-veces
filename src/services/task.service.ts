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

  if (error) throw error;
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
  // Primero creamos la tarea sin los logros
  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description,
      category_id: task.category_id
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
        requirement: achievement.requirement
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
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
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
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: task.title,
      description: task.description,
      category_id: task.category_id
    })
    .eq('id', id)
    .select(`
      *,
      achievements (*),
      categories!inner (id, name, color)
    `)
    .single();

  if (error) {
    console.error('Error al actualizar la tarea:', error);
    throw error;
  }
  return data as Task;
}

export async function addAchievementsToTask(taskId: number, achievements: { title: string; description: string; requirement: number }[]) {
  try {
    const achievementsToInsert = achievements.map(achievement => ({
      task_id: taskId,
      title: achievement.title,
      description: achievement.description,
      requirement: achievement.requirement
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