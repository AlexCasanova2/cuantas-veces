<template>
  <div 
    class="bg-white rounded-xl p-4 shadow-lg min-w-[250px] max-w-[270px] flex flex-col justify-between cursor-pointer" 
    @click="$emit('navigate-to-detail', task.id)"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-4 truncate">{{ task.title }}</h3>
    <div class="flex-1 flex flex-col justify-end">
      <!-- Eliminamos la barra de progreso y la lista de logros de la tarjeta del carrusel -->

      <button 
        @click.stop="$emit('increment', task)" 
        class="w-full py-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
      >
        +1
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithProgress } from '../types/task';

const props = defineProps<{ task: TaskWithProgress }>();

// Eliminamos el computed progressPercent y la función isAchievementCompleted

// Emitir evento para navegar al detalle
// El click principal en el div ya emite el evento navigate-to-detail
</script>

<style scoped>
.transform {
  will-change: transform;
}
</style> 