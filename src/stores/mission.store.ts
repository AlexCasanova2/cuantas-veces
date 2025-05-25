import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../services/supabase';
import type { Mission, CreateMissionDTO } from '../types/mission';

export const useMissionStore = defineStore('mission', () => {
  const missions = ref<Mission[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMissions() {
        try {
    isLoading.value = true;
            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            missions.value = data || [];
        } catch (error) {
            console.error('Error al cargar misiones:', error);
            throw error;
    } finally {
      isLoading.value = false;
    }
  }

    async function createMission(mission: CreateMissionDTO) {
        try {
    isLoading.value = true;
            const { data, error } = await supabase
                .from('missions')
                .insert([mission])
                .select()
                .single();

            if (error) throw error;
            missions.value.unshift(data);
            return data;
        } catch (error) {
            console.error('Error al crear la misión:', error);
            throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateMission(id: number, mission: Partial<Mission>) {
        try {
    isLoading.value = true;
            const { data, error } = await supabase
                .from('missions')
                .update(mission)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            const index = missions.value.findIndex(m => m.id === id);
      if (index !== -1) {
                missions.value[index] = data;
      }
            return data;
        } catch (error) {
            console.error('Error al actualizar la misión:', error);
            throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteMission(id: number) {
        try {
    isLoading.value = true;
            const { error } = await supabase
                .from('missions')
                .update({ state: 'deleted' })
                .eq('id', id);

            if (error) throw error;
            const index = missions.value.findIndex(m => m.id === id);
            if (index !== -1) {
                missions.value[index].state = 'deleted';
            }
        } catch (error) {
            console.error('Error al eliminar la misión:', error);
            throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    missions,
    isLoading,
    error,
    fetchMissions,
    createMission,
    updateMission,
        deleteMission
  };
}); 