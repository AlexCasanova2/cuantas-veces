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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { useTaskStore } from '../stores/task.store';
import type { TaskWithProgress } from '../types/task';

const router = useRouter();
const userStore = useUserStore();
const taskStore = useTaskStore();

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
  return taskStore.tasks.reduce((total: number, task: TaskWithProgress) => {
    return total + (task.completedAchievementIds?.length || 0);
  }, 0);
});

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
</script> 