<template>
  <div class="w-80 bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Contenido superior clickeable -->
    <router-link :to="{ name: 'task-detail', params: { id: task.id } }" class="block p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-1 hover:underline">{{ task.title }}</h3>
    </router-link>

    <!-- Contenido inferior con botón -->
    <div class="px-4 pb-4">
      <!-- Fila: Progreso + Botón -->
      <div class="flex items-center justify-between gap-4">
        <!-- Progreso -->
        <div class="flex-1 w-[60%]">
          <p class="text-sm text-gray-500">Progreso</p>
          <p class="text-base font-medium text-gray-800">{{ task.count }} veces</p>
        </div>

        <!-- Botón -->
        <div class="w-[40%]">
          <button @click="$emit('increment', task)"
            class="w-full bg-lime-400 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-lime-500 transition whitespace-nowrap">
            Añadir +1
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithProgress } from '../types/task';

const props = defineProps<{ task: TaskWithProgress }>();
</script>

<style scoped>
.transform {
  will-change: transform;
}
</style>