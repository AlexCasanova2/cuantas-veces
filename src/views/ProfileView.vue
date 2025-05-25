<template>
  <div class="min-h-screen flex flex-col">
    <BaseCard class="max-w-2xl w-full mx-auto mt-0 mb-20 rounded-t-none">
      <!-- Header -->
      <header class="mb-6 px-6 pt-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-dark">Mi Perfil</h1>
            <h2 class="text-3xl font-bold text-dark">{{ userStore.profile?.name }}</h2>
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
      <main class="pb-6 pb-24">
        <!-- Información del perfil -->
        <section class="px-6 mb-8">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center mb-6">
              <div class="relative">
                <div
                  class="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden">
                  <img v-if="userStore.profile?.avatar_url" :src="userStore.profile.avatar_url" alt="Avatar"
                    class="w-full h-full object-cover" />
                  <span v-else class="text-2xl text-white font-semibold">
                    {{ userInitials }}
                  </span>
                </div>
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-bold text-dark">{{ userStore.profile?.name }}</h2>
                <p class="text-gray-600">{{ userStore.user?.email }}</p>
                <p v-if="userStore.profile?.bio" class="text-sm text-gray-500 mt-1">{{ userStore.profile.bio }}</p>
              </div>
            </div>

            <!-- Nivel y XP -->
            <div class="mb-6">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Nivel {{ userLevel?.level || 1 }}</span>
                <span>{{ userLevel?.current_xp || 0 }}/{{ userLevel?.xp_to_next || 100 }} XP</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${gamificationStore.levelProgress}%` }"></div>
              </div>
            </div>

            <!-- Estadísticas -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-primary">{{ totalTasks }}</p>
                <p class="text-sm text-gray-600">Tareas</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-primary">{{ totalAchievements }}</p>
                <p class="text-sm text-gray-600">Logros</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-2xl font-bold text-primary">{{ completedMissions }}</p>
                <p class="text-sm text-gray-600">Misiones</p>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="space-y-3">
              <button @click="showEditModal = true"
                class="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors duration-200">
                Editar Perfil
              </button>
              <button @click="handleLogout"
                class="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </section>

        <!-- Logros -->
        <section class="px-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-dark">Mis Logros</h3>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div v-if="taskStore.tasks.length === 0" class="text-center py-4">
              <p class="text-gray-500">No hay tareas disponibles</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="task in taskStore.tasks" :key="task.id" class="border rounded-lg p-4">
                <h4 class="font-medium text-dark mb-3">{{ task.title }}</h4>

                <div class="space-y-3">
                  <div v-for="achievement in task.achievements" :key="achievement.id"
                    class="flex items-center justify-between p-3 rounded-lg"
                    :class="isAchievementUnlocked(achievement.id) ? 'bg-green-50' : 'bg-gray-50'">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        :class="isAchievementUnlocked(achievement.id) ? 'bg-green-100' : 'bg-gray-200'">
                        <svg v-if="isAchievementUnlocked(achievement.id)" xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
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
                        <p class="font-medium text-dark">{{ achievement.title }}</p>
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
        </section>
      </main>
    </BaseCard>

    <!-- Modal de edición de perfil -->
    <EditProfileModal :is-open="showEditModal" @close="showEditModal = false" @update="userStore.fetchProfile()" />

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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { useTaskStore } from '../stores/task.store';
import { useGamificationStore } from '../stores/gamification.store';
import { useUserMissionStore } from '../stores/userMission.store';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseNavBar from '../components/ui/BaseNavBar.vue';
import EditProfileModal from '../components/profile/EditProfileModal.vue';
import type { TaskWithProgress } from '../types/task';
import type { Achievement } from '../services/gamification.service';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const taskStore = useTaskStore();
const gamificationStore = useGamificationStore();
const userMissionStore = useUserMissionStore();
const showEditModal = ref(false);

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
  return taskStore.tasks.length;
});

const totalAchievements = computed(() => {
  // Sumar el número de logros definidos en cada tarea
  // taskStore.tasks es el array de tareas, cada tarea tiene un array de achievements
  return taskStore.tasks.reduce((total, task) => {
    // Asegurarnos de que task.achievements exista y sea un array antes de sumar su longitud
    return total + (task.achievements && Array.isArray(task.achievements) ? task.achievements.length : 0);
  }, 0);
});

const completedMissions = computed(() => {
  return userMissionStore.userMissions.filter(mission => mission.state === 'completed').length;
});

const userLevel = computed(() => gamificationStore.userLevel);

// Verificar si un logro específico está desbloqueado por el usuario actual
function isAchievementUnlocked(achievementId: number): boolean {
  // userAchievements en el store es un array de Achievement & { unlocked_at: string; }
  // Usamos .some() para verificar si algún logro desbloqueado tiene el achievementId buscado
  return gamificationStore.userAchievements.some(unlockedAchievement => unlockedAchievement.id === achievementId);
}

// Obtener la fecha de desbloqueo de un logro específico para el usuario actual
function getUnlockDate(achievementId: number): string {
  // Buscamos en la lista de logros desbloqueados del usuario
  const unlockedAchievement = gamificationStore.userAchievements.find(unlocked => unlocked.id === achievementId);
  if (!unlockedAchievement?.unlocked_at) return '';
  // Formatear la fecha si se encuentra y tiene unlocked_at
  return new Date(unlockedAchievement.unlocked_at).toLocaleDateString();
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

onMounted(async () => {
  if (userStore.user?.id) {
    try {
      await Promise.all([
        gamificationStore.fetchUserGamificationData(userStore.user.id),
        taskStore.fetchTasks(),
        userMissionStore.fetchUserMissions()
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

<style scoped>
.transform {
  will-change: transform;
}
</style>