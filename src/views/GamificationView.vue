<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gamificación</h1>

    <!-- Debug Panel -->
    <div v-if="isDebugMode" class="mb-6 p-4 bg-gray-100 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Estado del Sistema</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-3 rounded">
          <h3 class="font-medium mb-2">Usuario</h3>
          <p>ID: {{ userStore.user?.id }}</p>
          <p>Nivel: {{ gamificationStore.userLevel?.level }}</p>
          <p>XP: {{ gamificationStore.userLevel?.current_xp }}/{{ gamificationStore.userLevel?.xp_to_next_level }}</p>
        </div>
        <div class="bg-white p-3 rounded">
          <h3 class="font-medium mb-2">Estadísticas</h3>
          <p>Misiones Activas: {{ gamificationStore.activeMissions.length }}</p>
          <p>Logros Desbloqueados: {{ gamificationStore.achievements.length }}</p>
          <p>Tareas Completadas: {{ taskStore.tasks.filter(t => t.progress === 100).length }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Columna izquierda -->
      <div class="space-y-6">
        <UserProfile />
        <UserStats />
      </div>

      <!-- Columna derecha -->
      <div class="space-y-6">
        <ActiveMissions />
        <ActionSimulator />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core';
import { useGamificationStore } from '@/stores/gamification.store';
import { useUserStore } from '@/stores/user.store';
import { useTaskStore } from '@/stores/task.store';
import UserProfile from '@/components/gamification/UserProfile.vue';
import UserStats from '@/components/gamification/UserStats.vue';
import ActiveMissions from '@/components/gamification/ActiveMissions.vue';
import ActionSimulator from '@/components/gamification/ActionSimulator.vue';

const gamificationStore = useGamificationStore();
const userStore = useUserStore();
const taskStore = useTaskStore();
const isDebugMode = ref(true); // Cambiar a false en producción

onMounted(async () => {
  if (userStore.user?.id) {
    try {
      await Promise.all([
        gamificationStore.fetchUserGamificationData(userStore.user.id),
        taskStore.fetchTasks(),
        taskStore.fetchUserTaskProgress(userStore.user.id)
      ]);
      console.log('Datos cargados correctamente:', {
        userLevel: gamificationStore.userLevel,
        achievements: gamificationStore.achievements,
        activeMissions: gamificationStore.activeMissions,
        tasks: taskStore.tasks
      });
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  }
});

defineOptions({
  name: 'GamificationView'
});
</script> 