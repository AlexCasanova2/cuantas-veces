<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
    
    <div class="space-y-4">
      <div v-for="(value, stat) in stats" :key="stat" class="flex items-center">
        <div class="w-32">
          <span class="text-sm font-medium text-gray-600 capitalize">{{ stat }}</span>
        </div>
        <div class="flex-1">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${(value / 100) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="w-12 text-right">
          <span class="text-sm font-medium text-gray-600">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-gray-600">Total</span>
        <span class="text-lg font-semibold text-indigo-600">{{ totalStats }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useGamificationStore } from '@/stores/gamification.store';

const gamificationStore = useGamificationStore();

const stats = computed(() => {
  if (!gamificationStore.userStats) return {};
  const { user_id, ...stats } = gamificationStore.userStats;
  return stats;
});

const totalStats = computed(() => gamificationStore.totalStats);

defineOptions({
  name: 'UserStats'
});
</script> 