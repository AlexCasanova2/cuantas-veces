import { supabase } from './supabase';
import type { Mission, CreateMissionDTO } from '../types/mission';

class MissionService {
  async getMissions(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getMission(id: number): Promise<Mission> {
  const { data, error } = await supabase
    .from('missions')
      .select('*')
      .eq('id', id)
      .single();

  if (error) throw error;
    return data;
}

  async createMission(mission: CreateMissionDTO): Promise<Mission> {
  const { data, error } = await supabase
    .from('missions')
      .insert(mission)
      .select()
    .single();

  if (error) throw error;
    return data;
}

  async updateMission(id: number, mission: Partial<Mission>): Promise<Mission> {
  const { data, error } = await supabase
    .from('missions')
      .update(mission)
    .eq('id', id)
      .select()
    .single();

  if (error) throw error;
    return data;
}

  async deleteMission(id: number): Promise<void> {
  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 
}

export const missionService = new MissionService(); 