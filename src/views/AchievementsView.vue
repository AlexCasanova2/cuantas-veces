<template>
  <div class="min-h-screen bg-gray-100">
    <BaseCard>
      <!-- Header -->
      <header class="mb-6 px-6 pt-8">
        <div class="flex justify-between items-center">
          <div class="h-[72px] flex flex-col justify-center">
            <h1 class="text-2xl font-bold text-dark">Mis Logros</h1>
            <div class="h-8"></div>
          </div>
          <!-- Iconos de notificación y perfil -->
          <div class="flex items-center gap-3">
            <button class="bg-white rounded-full p-3 shadow hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="p-4">
        <div class="max-w-2xl mx-auto">
          <!-- Resumen de logros -->
          <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Progreso Total</h2>
              <div class="text-right">
                <p class="text-2xl font-bold text-primary">{{ totalAchievements }}</p>
                <p class="text-sm text-gray-600">Logros Desbloqueados</p>
              </div>
            </div>
          </div>

          <!-- Lista de logros -->
          <div class="space-y-4">
            <div v-for="task in taskStore.tasks" :key="task.id" class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ task.title }}</h3>

              <div class="space-y-3">
                <div v-for="achievement in task.achievements" :key="achievement.id"
                  class="flex items-center justify-between p-3 rounded-lg"
                  :class="task.completedAchievementIds?.includes(achievement.id) ? 'bg-green-50' : 'bg-gray-50'">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                      :class="task.completedAchievementIds?.includes(achievement.id) ? 'bg-green-100' : 'bg-gray-200'">
                      <svg v-if="task.completedAchievementIds?.includes(achievement.id)"
                        xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ achievement.title }}</p>
                      <p class="text-sm text-gray-600">Requisito: {{ achievement.requirement }}</p>
                    </div>
                  </div>

                  <div class="text-right">
                    <p class="text-sm font-medium"
                      :class="task.completedAchievementIds?.includes(achievement.id) ? 'text-green-600' : 'text-gray-500'">
                      {{ task.completedAchievementIds?.includes(achievement.id) ? 'Completado' : 'Pendiente' }}
                    </p>
                    <p v-if="task.completedAchievementIds?.includes(achievement.id)" class="text-xs text-gray-500">
                      {{ getUnlockDate(achievement.id) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Barra de navegación inferior -->
      <BaseNavBar>
        <button class="flex flex-col items-center"
          :class="{ 'text-primary': route.name === 'home', 'text-grayText': route.name !== 'home' }"
          @click="router.push('/home')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs mt-1">Inicio</span>
        </button>
        <button class="flex flex-col items-center"
          :class="{ 'text-primary': route.name === 'tasks', 'text-grayText': route.name !== 'tasks' }"
          @click="router.push('/tasks')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text-xs mt-1">Tareas</span>
        </button>
        <button class="flex flex-col items-center"
          :class="{ 'text-primary': route.name === 'achievements', 'text-grayText': route.name !== 'achievements' }"
          @click="router.push('/achievements')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs mt-1">Trofeos</span>
        </button>
        <button class="flex flex-col items-center"
          :class="{ 'text-primary': route.name === 'profile', 'text-grayText': route.name !== 'profile' }"
          @click="router.push('/profile')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-xs mt-1">Perfil</span>
        </button>
      </BaseNavBar>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';
import { useTaskStore } from '../stores/task.store';
import { useGamificationStore } from '../stores/gamification.store';
import { useUserStore } from '../stores/user.store';
import type { TaskWithProgress } from '../types/task';
import type { Achievement } from '../services/gamification.service';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseNavBar from '../components/ui/BaseNavBar.vue';

const router = useRouter();
const route = useRoute();
const taskStore = useTaskStore();
const gamificationStore = useGamificationStore();
const userStore = useUserStore();

// Computed para el total de logros desbloqueados
const totalAchievements = computed(() => {
  return taskStore.tasks.reduce((total: number, task: TaskWithProgress) => {
    return total + (task.completedAchievementIds?.length || 0);
  }, 0);
});

function getUnlockDate(achievementId: number): string {
  const achievement = gamificationStore.achievements.find((a: Achievement & { unlocked_at: string }) => a.id === achievementId);
  if (!achievement?.unlocked_at) return '';
  return new Date(achievement.unlocked_at).toLocaleDateString();
}

onMounted(async () => {
  if (userStore.user?.id) {
    try {
      await Promise.all([
        gamificationStore.fetchUserGamificationData(userStore.user.id),
        taskStore.fetchTasks()
      ]);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }
});

defineOptions({
  name: 'AchievementsView'
});
</script>