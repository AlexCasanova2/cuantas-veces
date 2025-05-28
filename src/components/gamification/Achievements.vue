<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Logros</h3>
    
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
                {{ getUnlockedDate(achievement.id) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useTaskStore } from '@/stores/task.store';
import { useGamificationStore } from '@/stores/gamification.store';
import type { Achievement } from '@/services/gamification.service';

const taskStore = useTaskStore();
const gamificationStore = useGamificationStore();

const isAchievementUnlocked = (achievementId: number) => {
    return gamificationStore.userAchievements.some((a: Achievement & { unlocked_at: string }) => a.id === achievementId);
};

const getUnlockedDate = (achievementId: number) => {
    const achievement = gamificationStore.userAchievements.find((a: Achievement & { unlocked_at: string }) => a.id === achievementId);
    return achievement?.unlocked_at;
};

defineOptions({
  name: 'Achievements'
});
</script> 