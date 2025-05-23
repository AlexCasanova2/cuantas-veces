<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Simular Acciones</h3>
    
    <div class="space-y-4">
      <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
          <p class="text-sm text-gray-600">{{ task.description }}</p>
        </div>
        <button
          @click="registerAction(task.id)"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Registrando...' : 'Registrar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { useGamificationStore } from '@/stores/gamification.store';
import { useUserStore } from '@/stores/user.store';

const gamificationStore = useGamificationStore();
const userStore = useUserStore();

const isLoading = ref(false);

// Tareas de ejemplo para simular
const tasks = [
  {
    id: 1,
    title: 'Leer un libro',
    description: 'Dedicar tiempo a la lectura'
  },
  {
    id: 2,
    title: 'Meditar',
    description: 'Practicar meditación'
  },
  {
    id: 3,
    title: 'Hacer ejercicio',
    description: 'Realizar actividad física'
  }
];

async function registerAction(taskId: number) {
  if (!userStore.user?.id) return;
  
  isLoading.value = true;
  try {
    await gamificationStore.registerAction(userStore.user.id, taskId);
  } catch (error) {
    console.error('Error al registrar acción:', error);
  } finally {
    isLoading.value = false;
  }
}

defineOptions({
  name: 'ActionSimulator'
});
</script> 