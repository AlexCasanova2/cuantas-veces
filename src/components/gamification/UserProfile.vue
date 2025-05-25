<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
        <span class="text-2xl font-bold text-indigo-600">{{ userLevel?.level || 1 }}</span>
      </div>
      <div class="flex-1">
        <h2 class="text-xl font-semibold text-gray-800">{{ profile?.name }}</h2>
        <p class="text-sm text-gray-600">Nivel {{ userLevel?.level || 1 }}</p>
      </div>
    </div>

    <!-- Barra de progreso de nivel -->
    <div class="mt-4">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>{{ userLevel?.current_xp || 0 }} XP</span>
        <span>{{ userLevel?.xp_to_next || 100 }} XP</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${levelProgress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import { useGamificationStore } from '@/stores/gamification.store';
import { useUserStore } from '@/stores/user.store';

const gamificationStore = useGamificationStore();
const userStore = useUserStore();

const userLevel = computed(() => gamificationStore.userLevel);
const profile = computed(() => userStore.profile);
const levelProgress = computed(() => gamificationStore.levelProgress);

defineOptions({
  name: 'UserProfile'
});
</script>