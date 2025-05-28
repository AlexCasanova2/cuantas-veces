<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Misiones Activas</h3>
    
    <div v-if="activeMissions.length === 0" class="text-center py-4">
      <p class="text-gray-500">No tienes misiones activas</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="mission in activeMissions" :key="mission.id" class="border rounded-lg p-4">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-medium text-gray-800">{{ mission.title }}</h4>
          <span class="text-sm text-indigo-600">+{{ mission.reward_xp }} XP</span>
        </div>
        
        <p class="text-sm text-gray-600 mb-3">{{ mission.description }}</p>

        <!-- Requisitos y progreso -->
        <div class="space-y-2">
          <div v-for="(required, task) in mission.requirements" :key="task" class="flex items-center">
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 capitalize">{{ task }}</span>
                <span class="text-gray-600">
                  {{ mission.progress.progress[task] || 0 }}/{{ required }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${((Number(mission.progress.progress[task]) || 0) / Number(required)) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useGamificationStore } from '@/stores/gamification.store';

const gamificationStore = useGamificationStore();
const activeMissions = computed(() => gamificationStore.activeMissions);

defineOptions({
  name: 'ActiveMissions'
});
</script> 