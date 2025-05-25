import { supabase } from './supabase';
import type { UserMission } from './userMission.service';

export interface UserLevel {
  user_id: string;
  level: number;
  current_xp: number;
  xp_to_next: number;
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
  state: 'draft' | 'published' | 'deleted';
  requirements?: {
    type: string;
    tasks: Array<{
      taskId: string;
      achievementId: string;
    }>;
  };
  reward_xp: number;
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
        .insert([{ user_id: userId, level: 1, current_xp: 0, xp_to_next: 100 }])
        .select()
        .single();

      if (insertError) throw insertError;
      return newData;
    }
    console.error('Error fetching user level:', error);
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
      id,
      user_id,
      mission_id,
      state,
      progress,
      accepted_at,
      completed_at,
      missions (
        id,
        title,
        description,
        requirement,
        xp_reward
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;

  // Mapear los datos para que coincidan con la interfaz, siendo explícitos
  return data.map((item: any) => { // Usar any temporalmente para el item crudo
    const missionData = item.missions; // Acceder directamente a missions
    
    // Asegurarse de que missionData no es null
    if (!missionData) {
      console.warn(`Misión relacionada no encontrada para user_mission con id ${item.id}`);
      return null; // Omitir items sin datos de misión
    }

    // Mapear campos singulares de la BD a propiedades plurales en la interfaz Mission
    const missionWithCorrectedNames: Mission = {
        id: missionData.id,
        title: missionData.title,
        description: missionData.description,
        state: item.state as Mission['state'],
        requirements: missionData.requirement, // requirement (BD) -> requirements (Interfaz)
        reward_xp: missionData.xp_reward, // xp_reward (BD) -> reward_xp (Interfaz)
    };

    // Construir el objeto UserMission para la propiedad progress
    const userMissionProgress: UserMission = { // Mantenemos el tipo declarado aquí
      id: item.id, // Propiedad de user_missions
      user_id: item.user_id, // Propiedad de user_missions
      mission_id: item.mission_id,
      state: item.state as UserMission['state'], // Propiedad de user_missions con casteo de tipo
      progress: item.progress || {}, // Propiedad de user_missions
      accepted_at: item.accepted_at, // Propiedad de user_missions
      completed_at: item.completed_at, // Propiedad de user_missions
      completed: item.state === 'completed', // Derivar de la propiedad state de user_missions
      mission: missionWithCorrectedNames // Incluir la data de la misión relacionada
    } as UserMission; // Añadir casteo directo aquí

    // Combinar los datos de la misión y el progreso del usuario en el tipo final
    const finalItem: Mission & { progress: UserMission } = {
        ...missionWithCorrectedNames,
        progress: userMissionProgress
    };

    return finalItem;

  }).filter((item): item is Mission & { progress: UserMission } => item !== null); // Filtrar nulos y tipar
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
export async function registerUserAction(userId: string, taskId: number): Promise<any> {
  const { data, error } = await supabase.rpc('register_user_action', {
    p_user_id: userId,
    p_task_id: taskId
  });

  if (error) throw error;
  return data;
}

// Obtener el progreso de una tarea específica
export async function getUserTaskProgress(userId: string, taskId: number) {
  const { data, error } = await supabase
    .from('user_task_progress')
    .select(`
      *,
      completed_achievements:user_achievements(achievement_id)
    `)
    .eq('user_id', userId)
    .eq('task_id', taskId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return {
    ...data,
    completedAchievementIds: data.completed_achievements?.map((ca: any) => ca.achievement_id) || []
  };
}

export async function getUserGamificationData(userId: string) {
    const [stats, missions, userAchievements, userLevel] = await Promise.all([
        getUserStats(userId),
        getUserMissions(userId),
        getUserAchievements(userId),
        getUserLevel(userId)
    ]);

    return {
        stats,
        missions,
        userAchievements,
        userLevel
    };
}

// Verificar si una misión está completa basada en logros
async function checkMissionCompletionByAchievements(userId: string, missionId: number): Promise<boolean> {
  try {
    const { data: mission, error: missionError } = await supabase
      .from('missions')
      .select('achievement_requirements')
      .eq('id', missionId)
      .single();

    if (missionError) throw missionError;
    if (!mission?.achievement_requirements) return false;

    // Verificar cada requisito de logro
    for (const req of mission.achievement_requirements) {
      const { data: achievement, error: achievementError } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', req.achievementId)
        .single();

      if (achievementError || !achievement) return false;
    }

    return true;
  } catch (error) {
    console.error('Error al verificar completitud de misión por logros:', error);
    throw error;
  }
}

// Actualizar el estado de una misión
export async function updateMissionState(userId: string, missionId: number) {
  try {
    // Verificar si la misión está completa por logros
    const isCompleteByAchievements = await checkMissionCompletionByAchievements(userId, missionId);

    if (isCompleteByAchievements) {
      const { error } = await supabase
        .from('user_missions')
        .update({
          state: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('mission_id', missionId);

      if (error) throw error;

      // Obtener la misión para añadir XP
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('xp_reward')
        .eq('id', missionId)
        .single();

      if (missionError) throw missionError;

      // Añadir XP por completar misión
      // await addXP(userId, mission.xp_reward, 'mission_completed');
    }
  } catch (error) {
    console.error('Error al actualizar estado de misión:', error);
    throw error;
  }
} 