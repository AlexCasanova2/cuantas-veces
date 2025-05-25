import { defineStore } from 'pinia';
import { ref, computed } from '@vue/runtime-core';
import type { UserLevel, UserStats, Mission, Achievement, UserAchievement as UserAchievementServiceType } from '../services/gamification.service';
import * as gamificationService from '../services/gamification.service';
import { useUserMissionStore } from './userMission.store';
import type { UserMission } from '../services/userMission.service';

export interface UserAchievement { // Mantener esta interfaz si se usa en otras partes
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
}

// Definir un tipo local para los logros del usuario como se reciben del servicio
interface UserAchievementFromService extends Achievement { // Extiende Achievement
    unlocked_at: string;
}

export const useGamificationStore = defineStore('gamification', () => {
  const userLevel = ref<UserLevel | null>(null);
  const userStats = ref<UserStats | null>(null);
  const activeMissions = ref<(Mission & { progress: UserMission })[]>([]);
  const userAchievements = ref<(Achievement & { unlocked_at: string; })[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const userLevelVersion = ref(0);

  const userMissionStore = useUserMissionStore();

  // Computed properties
  const levelProgress = computed(() => {
    const userLevelValue = userLevel.value;

    if (!userLevelValue) return 0;

    // Depender explícitamente de las propiedades para asegurar reactividad
    const currentXp = userLevelValue.current_xp;
    const xpToNext = userLevelValue.xp_to_next; // Usar xp_to_next según la BD y frontend

    if (xpToNext === undefined || xpToNext === 0) return 0;

    const progress = (currentXp / xpToNext) * 100;
    console.log('levelProgress calculation (revisited):', currentXp, '/', xpToNext, '=', progress);
    return progress;
  });

  const totalStats = computed(() => {
    if (!userStats.value) return 0;
    return Object.values(userStats.value).reduce((sum, stat) => Number(sum) + Number(stat), 0);
  });

  // Actions
  async function fetchUserGamificationData(userId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      // Obtener todos los datos de gamificación
      const gamificationData = await gamificationService.getUserGamificationData(userId);

      // Asignar los datos obtenidos a las referencias reactivas del store
      userStats.value = gamificationData.stats;
      activeMissions.value = gamificationData.missions;
      userAchievements.value = gamificationData.userAchievements;
      userLevel.value = gamificationData.userLevel;

      userLevelVersion.value++;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar datos de gamificación';
      console.error('>>> [GamificationStore] Error en fetchUserGamificationData:', e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function registerAction(userId: string, taskId: number) {
    isLoading.value = true;
    error.value = null;
    try {
      // Capturar la respuesta de la llamada RPC
      const result = await gamificationService.registerUserAction(userId, taskId);
      console.log('>>> [GamificationStore] Respuesta de register_user_action RPC:', result);

      // Actualizar el estado del store con los nuevos datos de gamificación
      // Esto incluirá el nivel y la XP actualizada que vienen en la respuesta RPC
      // y recargará otros datos como misiones y logros del usuario.
      await fetchUserGamificationData(userId);

      // Opcional: Podrías querer actualizar userLevel directamente si confías plenamente en la respuesta RPC
      if (result && result.new_user_level !== undefined && result.new_user_xp !== undefined) {
        if (userLevel.value) {
          userLevel.value.level = result.new_user_level;
          userLevel.value.current_xp = result.new_user_xp;
          userLevel.value.xp_to_next = result.xp_to_next_level; // Usar el nombre de campo del JSON
          console.log('>>> [GamificationStore] User level updated directly. New XP:', userLevel.value.current_xp);
        } else {
          // Si userLevel es null, forzamos un refetch completo para inicializarlo
          await fetchUserGamificationData(userId);
        }
      }

    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al registrar acción';
      console.error('>>> [GamificationStore] Error en registerAction:', e);
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Método para actualizaciones en tiempo real
  // Comentado temporalmente para resolver errores de linter no relacionados con el problema principal de XP
  /*
  function updateAchievement(achievement: Achievement) {
    const index = userAchievements.value.findIndex(a => a.id === achievement.id);
    if (index !== -1) {
      userAchievements.value[index] = achievement;
    } else {
      userAchievements.value.push(achievement);
    }
  }
  */

  return {
    userLevel,
    userStats,
    activeMissions,
    userAchievements,
    isLoading,
    error,
    levelProgress,
    totalStats,
    fetchUserGamificationData,
    registerAction,
    userLevelVersion,
    // updateAchievement
  };
}); 