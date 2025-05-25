<template>
  <div class="min-h-screen flex flex-col">
    <BaseCard class="max-w-2xl w-full mx-auto mt-0 mb-20 rounded-t-none">
      <!-- Header -->
      <header class="mb-6 px-6 pt-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-dark">Hola de nuevo,</h1>
            <h2 class="text-3xl font-bold text-dark">{{ userName }}</h2>
          </div>
          <!-- Iconos de notificación y perfil -->
          <div class="flex items-center gap-3">
            <button class="bg-white rounded-full p-3 shadow hover:scale-105 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button @click="router.push('/profile')" class="relative">
              <div
                class="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden shadow hover:scale-105 transition">
                <img v-if="userStore.profile?.avatar_url" :src="userStore.profile.avatar_url" alt="Avatar"
                  class="w-full h-full object-cover" />
                <span v-else class="text-xl text-white font-semibold">
                  {{ userInitials }}
                </span>
              </div>
            </button>
          </div>
        </div>
        <!-- Barra de búsqueda -->
        <div class="mt-6">
          <BaseSearchBar :model-value="search" @update:model-value="search = $event" placeholder="Buscar" />
        </div>
      </header>


      <!-- Contenido principal -->
      <main class="pb-6 pb-24">

        <!-- Tu espacio de trabajo -->
        <section class="mb-8 px-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-dark">¿Algo que añadir?</h3>
            <BaseButton color="accent" class="text-sm">Ver todo</BaseButton>
          </div>
          <div class="overflow-x-auto -mx-6 px-6">
            <div class="flex space-x-6 pb-4 flex-nowrap">
              <TaskCardCarrusel v-for="task in randomTasksList" :key="task.id" :task="task" @increment="handleIncrement"
                @navigate-to-detail="navigateToTaskDetail" class="flex-shrink-0" />
            </div>
          </div>
        </section>


        <!-- Misiones -->
        <!-- Sección de Misiones -->
        <section class="mb-8 px-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-dark">Misiones</h3>
            <!-- Puedes añadir un botón para ver todas las misiones si tienes una vista dedicada -->
          </div>
          <div class="space-y-4">
            <MissionCard v-for="mission in availableMissions" :key="mission.id" :mission="mission"
              :userMissionState="userMissionStore.getUserMissionState(mission.id)"
              @accept-mission="handleAcceptMission" />
            <p v-if="!availableMissions.length && !missionStore.isLoading && !userMissionStore.isLoading">No hay
              misiones disponibles.</p>
            <p v-if="missionStore.isLoading || userMissionStore.isLoading">Cargando misiones...</p>
          </div>
        </section>
        <!-- Tareas personales -->
        <section class="px-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-dark">Tareas personales</h3>
            <router-link to="/tasks">
              <BaseButton color="primary" class="text-sm">Ver todas</BaseButton>
            </router-link>
          </div>
          <div class="space-y-4">
            <TaskListItem v-for="task in personalTasks" :key="task.id" :task="task" @increment="handleIncrement"
              @navigate-to-detail="navigateToTaskDetail" />
          </div>
        </section>
      </main>
    </BaseCard>
    <!-- Barra de navegación inferior -->
    <BaseNavBar>
      <button class="flex flex-col items-center"
        :class="{ 'text-primary': route.name === 'home', 'text-grayText': route.name !== 'home' }"
        @click="router.push('/home')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-xs mt-1">Inicio</span>
      </button>
      <button class="flex flex-col items-center"
        :class="{ 'text-primary': route.name === 'tasks', 'text-grayText': route.name !== 'tasks' }"
        @click="router.push('/tasks')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text-xs mt-1">Tareas</span>
      </button>
      <button class="flex flex-col items-center"
        :class="{ 'text-primary': route.name === 'achievements', 'text-grayText': route.name !== 'achievements' }"
        @click="router.push('/achievements')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs mt-1">Trofeos</span>
      </button>
      <button class="flex flex-col items-center"
        :class="{ 'text-primary': route.name === 'profile', 'text-grayText': route.name !== 'profile' }"
        @click="router.push('/profile')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-xs mt-1">Perfil</span>
      </button>
    </BaseNavBar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { useTaskStore } from '../stores/task.store';
import { useCategoryStore } from '../stores/category.store';
import { useMissionStore } from '../stores/mission.store';
import { useAuthStore } from '../stores/auth.store';
import { useUserMissionStore } from '../stores/userMission.store';
import TaskCardCarrusel from '../components/TaskCardCarrusel.vue';
import TaskListItem from '../components/TaskListItem.vue';
import BaseCard from '../components/ui/BaseCard.vue';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseSearchBar from '../components/ui/BaseSearchBar.vue';
import BaseNavBar from '../components/ui/BaseNavBar.vue';
import MissionCard from '../components/MissionCard.vue';
import type { Task, TaskWithProgress, Category } from '../types/task';
import type { Mission } from '../types/mission';

const userStore = useUserStore();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();
const missionStore = useMissionStore();
const authStore = useAuthStore();
const userMissionStore = useUserMissionStore();
const router = useRouter();
const route = useRoute();

const userName = computed<string>(() => userStore.profile?.name || 'Usuario');
const tasksList = computed(() => taskStore.tasks);
const search = ref('');

function getRandomTasks(tasks: TaskWithProgress[], n: number) {
  const publishedTasks = tasks.filter(task => task.state === 'published');
  const shuffled = publishedTasks.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const randomTasksList = computed(() => getRandomTasks(taskStore.tasks, 5));

// Computed para obtener las últimas 3 tareas personales
const personalTasks = computed(() => {
  const personalCategory = categoryStore.categories.find(cat => cat.name.toLowerCase() === 'personal');
  if (!personalCategory) return [];

  return taskStore.tasks
    .filter((task: TaskWithProgress) => task.category_id === personalCategory?.id)
    .slice(0, 3);
});

// Computed para obtener solo las misiones no completadas y publicadas
const availableMissions = computed(() => {
  return missionStore.missions.filter((mission: Mission) => {
    const userMission = userMissionStore.getUserMissionState(mission.id);
    return mission.state === 'published' && (!userMission || userMission.state !== 'completed');
  });
});

async function handleIncrement(task: TaskWithProgress) {
  await taskStore.updateTaskCount({ task_id: task.id, count: task.count + 1 });
}

async function navigateToTaskDetail(taskId: number) {
  try {
    await router.push({ name: 'task-detail', params: { id: taskId } });
  } catch (error) {
    console.error('Error navigating to task detail:', error);
  }
}

onMounted(async () => {
  await authStore.checkUser();
  await taskStore.fetchTasks();
  await categoryStore.fetchCategories();
  await missionStore.fetchMissions();
  await userMissionStore.fetchUserMissions();
});

// Manejar la aceptación de una misión
async function handleAcceptMission(missionId: number) {
  try {
    await userMissionStore.acceptMission(missionId);
    // La lista de misiones del usuario se actualizará reactivamente a través del store
    console.log('Misión aceptada:', missionId);
  } catch (error) {
    console.error('Error al aceptar misión:', error);
    // Mostrar un mensaje de error al usuario si es necesario
  }
}

// Computed para las iniciales del usuario
const userInitials = computed(() => {
  const name = userStore.profile?.name || '';
  return name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

defineExpose({
  userName,
  randomTasksList,
  tasksList
});
</script>

<style scoped>
.transform {
  will-change: transform;
}
</style>
