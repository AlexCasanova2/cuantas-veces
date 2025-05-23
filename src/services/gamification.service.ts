import { supabase } from './supabase';

export interface UserLevel {
  user_id: string;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
}

export interface UserStats {
  user_id: string;
  wisdom: number;
  charisma: number;
  resistance: number;
  strength: number;
  creativity: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  requirements: Record<string, number>;
  reward_xp: number;
  reward_stats: Partial<UserStats>;
}

export interface UserMission {
  user_id: string;
  mission_id: number;
  progress: Record<string, number>;
  completed: boolean;
  completed_at: string | null;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  task_id: number;
  requirement: number;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
}

// Obtener nivel y XP del usuario
export async function getUserLevel(userId: string): Promise<UserLevel> {
  const { data, error } = await supabase
    .from('user_levels')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Si no existe el registro, lo creamos
      const { data: newData, error: insertError } = await supabase
        .from('user_levels')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }
    throw error;
  }
  return data;
}

// Obtener stats del usuario
export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Si no existe el registro, lo creamos
      const { data: newData, error: insertError } = await supabase
        .from('user_stats')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }
    throw error;
  }
  return data;
}

// Obtener misiones activas del usuario
export async function getUserMissions(userId: string): Promise<(Mission & { progress: UserMission })[]> {
  const { data, error } = await supabase
    .from('user_missions')
    .select(`
      *,
      missions (*)
    `)
    .eq('user_id', userId)
    .eq('completed', false);

  if (error) throw error;
  return data.map(item => ({
    ...item.missions,
    progress: item
  }));
}

// Obtener logros desbloqueados del usuario
export async function getUserAchievements(userId: string): Promise<(Achievement & { unlocked_at: string })[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data.map(item => ({
    ...item.achievements,
    unlocked_at: item.unlocked_at
  }));
}

// Registrar una acción del usuario
export async function registerUserAction(userId: string, taskId: number): Promise<void> {
  const { error } = await supabase.rpc('register_user_action', {
    p_user_id: userId,
    p_task_id: taskId
  });

  if (error) throw error;
} 