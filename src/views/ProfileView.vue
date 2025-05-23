<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-blue-700 text-white p-4">
      <div class="flex items-center">
        <button @click="$router.back()" class="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-xl font-semibold">Mi Perfil</h1>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="p-4">
      <div class="max-w-2xl mx-auto">
        <!-- Información del perfil -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div class="flex items-center mb-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-2xl text-blue-600 font-semibold">
                {{ userInitials }}
              </span>
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-bold text-gray-900">{{ userStore.profile?.name }}</h2>
              <p class="text-gray-600">{{ userStore.user?.email }}</p>
            </div>
          </div>

          <!-- Nivel y XP -->
          <div class="mb-6">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>Nivel {{ userLevel?.level || 1 }}</span>
              <span>{{ userLevel?.current_xp || 0 }}/{{ userLevel?.xp_to_next_level || 100 }} XP</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                :style="{ width: `${levelProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ totalTasks }}</p>
              <p class="text-sm text-gray-600">Tareas Completadas</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ totalAchievements }}</p>
              <p class="text-sm text-gray-600">Logros Desbloqueados</p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-3">
            <button 
              @click="handleEditProfile"
              class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              Editar Perfil
            </button>
            <button 
              @click="handleLogout"
              class="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <!-- Logros -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Mis Logros</h3>
          
          <div v-if="taskStore.tasks.length === 0" class="text-center py-4">
            <p class="text-gray-500">No hay tareas disponibles</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="task in taskStore.tasks" :key="task.id" class="border rounded-lg p-4">
              <h4 class="font-medium text-gray-800 mb-3">{{ task.title }}</h4>
              
              <div class="space-y-3">
                <div v-for="achievement in task.achievements" :key="achievement.id" 
                     class="flex items-center justify-between p-3 rounded-lg"
                     :class="isAchievementUnlocked(achievement.id) ? 'bg-green-50' : 'bg-gray-50'">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                         :class="isAchievementUnlocked(achievement.id) ? 'bg-green-100' : 'bg-gray-200'">
                      <svg v-if="isAchievementUnlocked(achievement.id)" 
                           xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ achievement.title }}</p>
                      <p class="text-sm text-gray-600">Requisito: {{ achievement.requirement }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium" 
                       :class="isAchievementUnlocked(achievement.id) ? 'text-green-600' : 'text-gray-500'">
                      {{ isAchievementUnlocked(achievement.id) ? 'Completado' : 'Pendiente' }}
                    </p>
                    <p v-if="isAchievementUnlocked(achievement.id)" class="text-xs text-gray-500">
                      {{ getUnlockDate(achievement.id) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { useTaskStore } from '../stores/task.store';
import { useGamificationStore } from '../stores/gamification.store';
import type { TaskWithProgress } from '../types/task';
import type { Achievement } from '../services/gamification.service';

const router = useRouter();
const userStore = useUserStore();
const taskStore = useTaskStore();
const gamificationStore = useGamificationStore();

// Computed para las iniciales del usuario
const userInitials = computed(() => {
  const name = userStore.profile?.name || '';
  return name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

// Computed para las estadísticas
const totalTasks = computed(() => {
  return taskStore.tasks.filter((task: TaskWithProgress) => task.progress === 100).length;
});

const totalAchievements = computed(() => {
  return gamificationStore.achievements.length;
});

const userLevel = computed(() => gamificationStore.userLevel);
const levelProgress = computed(() => gamificationStore.levelProgress);

function isAchievementUnlocked(achievementId: number): boolean {
  return gamificationStore.achievements.some((a: Achievement & { unlocked_at: string }) => a.id === achievementId);
}

function getUnlockDate(achievementId: number): string {
  const achievement = gamificationStore.achievements.find((a: Achievement & { unlocked_at: string }) => a.id === achievementId);
  if (!achievement?.unlocked_at) return '';
  return new Date(achievement.unlocked_at).toLocaleDateString();
}

// Manejadores de eventos
async function handleLogout() {
  try {
    await userStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

function handleEditProfile() {
  // TODO: Implementar la edición del perfil
  console.log('Editar perfil');
}

onMounted(async () => {
  if (userStore.user?.id) {
    try {
      await Promise.all([
        gamificationStore.fetchUserGamificationData(userStore.user.id),
        taskStore.fetchTasks()
      ]);
    } catch (error) {
      console.error('Error al cargar los datos del perfil:', error);
    }
  }
});

defineOptions({
  name: 'ProfileView'
});
</script> 