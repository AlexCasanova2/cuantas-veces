import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserLevel, UserStats, Mission, Achievement } from '../services/gamification.service';
import * as gamificationService from '../services/gamification.service';

export const useGamificationStore = defineStore('gamification', () => {
  const userLevel = ref<UserLevel | null>(null);
  const userStats = ref<UserStats | null>(null);
  const activeMissions = ref<(Mission & { progress: any })[]>([]);
  const achievements = ref<(Achievement & { unlocked_at: string })[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const levelProgress = computed(() => {
    if (!userLevel.value) return 0;
    return (userLevel.value.current_xp / userLevel.value.xp_to_next_level) * 100;
  });

  const totalStats = computed(() => {
    if (!userStats.value) return 0;
    return Object.values(userStats.value).reduce((sum, stat) => sum + stat, 0);
  });

  // Actions
  async function fetchUserGamificationData(userId: string) {
    isLoading.value = true;
    error.value = null;
    try {
      const [level, stats, missions, userAchievements] = await Promise.all([
        gamificationService.getUserLevel(userId),
        gamificationService.getUserStats(userId),
        gamificationService.getUserMissions(userId),
        gamificationService.getUserAchievements(userId)
      ]);

      userLevel.value = level;
      userStats.value = stats;
      activeMissions.value = missions;
      achievements.value = userAchievements;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar datos de gamificación';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function registerAction(userId: string, taskId: number) {
    isLoading.value = true;
    error.value = null;
    try {
      await gamificationService.registerUserAction(userId, taskId);
      // Recargar datos después de registrar la acción
      await fetchUserGamificationData(userId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al registrar acción';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    userLevel,
    userStats,
    activeMissions,
    achievements,
    isLoading,
    error,
    levelProgress,
    totalStats,
    fetchUserGamificationData,
    registerAction
  };
}); 