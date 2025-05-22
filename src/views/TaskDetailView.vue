<template>
  <div class="min-h-screen bg-gray-200">
    <!-- Header -->
    <header class="bg-blue-700 text-white p-4">
      <div class="flex items-center">
        <button @click="$router.back()" class="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold">{{ task?.title || 'Tarea' }}</h1>
          <!-- Si tuviéramos fechas asociadas a la tarea, podríamos ponerlas aquí -->
          <!-- <p class="text-sm text-gray-300">Sept 5, 2021 - Sept 10,2021</p> -->
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="p-4">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>
      <div v-else>
        <!-- Sección Team Work Placeholder -->
        <section class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Team Work</h3>
            <div class="flex space-x-3">
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <!-- Más avatares o placeholder -->
            </div>
        </section>

        <!-- Sección Attachment Placeholder -->
        <section class="mb-6">
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-gray-800">Attachment</h3>
                <span class="text-blue-600 text-sm font-semibold">See all</span>
            </div>
            <div class="flex space-x-4 overflow-x-auto">
                <div class="bg-white rounded-lg shadow p-4 flex-shrink-0 w-40">
                    <p class="text-gray-700 text-sm font-semibold truncate">Project Desc...</p>
                    <p class="text-gray-500 text-xs mt-1">12 MB</p>
                </div>
                 <div class="bg-white rounded-lg shadow p-4 flex-shrink-0 w-40">
                    <p class="text-gray-700 text-sm font-semibold truncate">Image Overall</p>
                    <p class="text-gray-500 text-xs mt-1">5 MB</p>
                </div>
                <!-- Más archivos o placeholder -->
            </div>
        </section>

        <!-- Sección Task -->
        <section class="mb-6">
             <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-semibold text-gray-800">Task</h3>
                <span class="text-blue-600 text-sm font-semibold">Edit</span>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
               <div class="flex items-start">
                  <div class="w-6 h-6 border border-gray-400 rounded mr-4 flex-shrink-0"></div>
                   <div class="flex-grow">
                       <h4 class="text-lg font-semibold text-gray-900">{{ task?.title || 'Cargando...' }}</h4>
                       <p class="text-gray-600 text-sm mt-2">{{ task?.description || 'Cargando descripción...' }}</p>
                       <p class="text-sm text-blue-600 mt-2">Progreso: {{ task?.progress || 0 }}%</p>
                       <p class="text-sm text-blue-600">Contador: {{ task?.count || 0 }}</p>
                   </div>
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 ml-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                   </svg>
               </div>
            </div>
        </section>

        <!-- Logros de la tarea -->
        <div v-if="task?.achievements && task.achievements.length > 0" class="bg-white rounded-lg shadow p-4 mb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Logros</h3>
          <ul class="space-y-2">
            <li v-for="achievement in task.achievements" :key="achievement.id" class="text-gray-700">
              • {{ achievement.title }} (Requisito: {{ achievement.requirement }})
              <span v-if="task.completedAchievementIds.includes(achievement.id)" class="text-green-600 ml-2">✓ Completado</span>
              <!-- Aquí podríamos mostrar el estado de cumplimiento por usuario y el timestamp -->
              <!-- Esto requeriría buscar en userAchievements y userTaskProgress -->
            </li>
          </ul>
        </div>

        <!-- Sección de comentarios -->
        <div class="bg-white rounded-lg shadow p-4">
           <h3 class="text-lg font-semibold text-gray-800 mb-2">Comentarios</h3>
           <p class="text-gray-600">Sección de comentarios (WIP)</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/task.store';
import { useUserStore } from '../stores/user.store';
import type { TaskWithProgress } from '../types/task';
import * as taskService from '../services/task.service';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const userStore = useUserStore();

const taskId = computed(() => Number(route.params.id));
const task = ref<TaskWithProgress | undefined>(undefined);
const error = ref<string | null>(null);

async function fetchTaskDetail(id: number) {
  if (!userStore.user) {
    router.push('/');
    return;
  }

  error.value = null;
  try {
    const tasks = await taskService.fetchTasks();
    const foundTask = tasks.find(t => t.id === id);

    if (foundTask) {
      const userProgress = await taskService.fetchUserTaskProgress(userStore.user.id, [id]);
      const userAchievements = await taskService.fetchUserAchievements(userStore.user.id);
      
      const progress = userProgress[0] || { count: 0, progress: 0 };
      const completedAchievementIds = userAchievements
        .filter(ua => foundTask.achievements?.some(ach => ach.id === ua.achievement_id))
        .map(ua => ua.achievement_id);

      task.value = {
        ...foundTask,
        count: progress.count,
        progress: progress.progress,
        completedAchievementIds
      };
    } else {
      error.value = 'Tarea no encontrada';
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido';
  }
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkSession();
  }
  
  if (taskId.value) {
    await fetchTaskDetail(taskId.value);
  }
});

watch(taskId, async (newId: number) => {
  if (newId) {
    await fetchTaskDetail(newId);
  }
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style> 