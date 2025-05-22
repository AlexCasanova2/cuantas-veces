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
        <h1 class="text-xl font-semibold">Mis Logros</h1>
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
              <p class="text-2xl font-bold text-blue-600">{{ totalAchievements }}</p>
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
                     :class="task.completedAchievementIds?.includes(achievement.id) ? 'text-green-600' : 'text-gray-500'">
                    {{ task.completedAchievementIds?.includes(achievement.id) ? 'Completado' : 'Pendiente' }}
                  </p>
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
import { computed } from '@vue/runtime-core';
import { useTaskStore } from '../stores/task.store';
import type { TaskWithProgress } from '../types/task';

const taskStore = useTaskStore();

// Computed para el total de logros desbloqueados
const totalAchievements = computed(() => {
  return taskStore.tasks.reduce((total: number, task: TaskWithProgress) => {
    return total + (task.completedAchievementIds?.length || 0);
  }, 0);
});
</script> 