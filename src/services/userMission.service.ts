import { supabase } from './supabase';
import type { Mission } from './gamification.service';

export interface UserMission {
  id?: number;
  user_id: string;
  mission_id: number;
  state: 'available' | 'accepted' | 'completed';
  progress: Record<string, any>; // Flexible para diferentes tipos de progreso
  accepted_at: string | null;
  completed_at: string | null;
  mission?: Mission; // Opcional: para incluir los datos de la misión al hacer fetch
  completed: boolean;
}

export async function fetchUserMissions(userId: string): Promise<UserMission[]> {
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
  // Conversión más explícita para satisfacer al linter
  return data as unknown as UserMission[];
}

export async function acceptMission(userId: string, missionId: number): Promise<UserMission> {
  const { data, error } = await supabase
    .from('user_missions')
    .insert([
      {
        user_id: userId,
        mission_id: missionId,
        state: 'accepted' // Insertamos directamente como 'accepted'
      }
    ])
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
    .single();

  if (error) throw error;
  // Conversión más explícita para satisfacer al linter
  return data as unknown as UserMission; // Corregido a UserMission (singular)
}

export async function updateUserMission(userId: string, missionId: number, state: 'available' | 'accepted' | 'completed', progress: Record<string, any> = {}) {
  const { data, error } = await supabase
    .from('user_missions')
    .update({
      state,
      progress,
      completed_at: state === 'completed' ? new Date().toISOString() : null
    })
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Podemos añadir funciones para actualizar el progreso o marcar como completada más adelante
// export async function updateMissionProgress(...): Promise<UserMission> { ... }
// export async function completeUserMission(...): Promise<UserMission> { ... }
 