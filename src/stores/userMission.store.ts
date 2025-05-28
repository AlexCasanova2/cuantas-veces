import { defineStore } from 'pinia';
import { ref, computed } from '@vue/runtime-core';
import type { UserMission } from '../services/userMission.service';
import * as userMissionService from '../services/userMission.service';
import { useUserStore } from './user.store'; // Necesitamos el userStore para obtener el userId
import type { Mission } from '../types/mission';

export interface UserMissionState {
  state: 'available' | 'accepted' | 'completed';
  completed_at: string | null;
  accepted_at: string | null;
  progress: any; // Ajustar el tipo si se define más adelante
}

export const useUserMissionStore = defineStore('userMission', () => {
  const userMissions = ref<UserMission[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const userStore = useUserStore();

  // Misiones disponibles (las que no están en userMissions o están marcadas como disponibles explícitamente si implementamos esa lógica)
  // Por ahora, simplemente filtramos las que no están en la lista del usuario.
  const availableMissions = computed(() => {
     const missionStore = useMissionStore(); // Importar aquí para evitar dependencia circular si se usan juntos
     return missionStore.missions.filter((mission: Mission) =>
        !userMissions.value.some(userMission => userMission.mission_id === mission.id)
     );
  });

   // Misiones del usuario (aceptadas, completadas, etc.)
  const currentUserMissions = computed(() => userMissions.value);

  // Obtener el estado de una misión específica para el usuario actual
  function getUserMissionState(missionId: number): UserMission | undefined {
      return userMissions.value.find(um => um.mission_id === missionId);
  }

  async function fetchUserMissions() {
    isLoading.value = true;
    error.value = null;
    const userId = userStore.user?.id;
    if (!userId) {
      error.value = 'Usuario no autenticado';
      isLoading.value = false;
      return;
    }
    try {
      userMissions.value = await userMissionService.fetchUserMissions(userId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar misiones del usuario';
      console.error('Error fetching user missions:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function acceptMission(missionId: number) {
     isLoading.value = true; // O manejar loading por misión si es necesario
     error.value = null;
     const userId = userStore.user?.id;
      if (!userId) {
        error.value = 'Usuario no autenticado';
        isLoading.value = false;
        throw new Error('Usuario no autenticado');
      }
    try {
      const newUserMission = await userMissionService.acceptMission(userId, missionId);
      userMissions.value.push(newUserMission); // Añadir la misión aceptada al estado local
      // Aquí podríamos necesitar actualizar el estado de la misión en el missionStore si lo usamos para filtrar disponibles
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al aceptar misión';
      console.error('Error accepting mission:', e);
      throw e;
    } finally {
       isLoading.value = false;
    }
  }

  async function updateMissionState(missionId: number, state: 'available' | 'accepted' | 'completed', progress: Record<string, any> = {}) {
    isLoading.value = true;
    error.value = null;
    const userId = userStore.user?.id;
    if (!userId) {
      error.value = 'Usuario no autenticado';
      isLoading.value = false;
      throw new Error('Usuario no autenticado');
    }
    try {
      const updatedMission = await userMissionService.updateUserMission(userId, missionId, state, progress);
      const index = userMissions.value.findIndex(um => um.mission_id === missionId);
      if (index !== -1) {
        userMissions.value[index] = updatedMission;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al actualizar estado de la misión';
      console.error('Error updating mission state:', e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Método para actualizaciones en tiempo real
  function updateUserMission(mission: UserMission) {
    const index = userMissions.value.findIndex(m => m.id === mission.id);
    if (index !== -1) {
      userMissions.value[index] = mission;
    } else {
      userMissions.value.push(mission);
    }
  }

  // Podemos añadir acciones para actualizar progreso o completar misiones más adelante
  // async function updateMissionProgress(...) { ... }
  // async function completeUserMission(...) { ... }

  return {
    userMissions,
    availableMissions,
    currentUserMissions,
    isLoading,
    error,
    fetchUserMissions,
    acceptMission,
    getUserMissionState,
    updateMissionState,
    updateUserMission
  };
});

// Importar useMissionStore aquí para evitar dependencia circular
import { useMissionStore } from './mission.store'; 