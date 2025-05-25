<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-gray-100 p-[25px] pt-12 pb-1 flex items-center justify-between">
      <button @click="$router.back()" class="text-gray-600 hover:text-gray-800 bg-white rounded-full p-2">
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.19492 1.49372C8.56248 1.15201 8.56248 0.59799 8.19492 0.256282C7.82737 -0.0854272 7.23145 -0.0854272 6.8639 0.256282L0.275664 6.38128C-0.0918881 6.72299 -0.0918881 7.27701 0.275664 7.61872L6.8639 13.7437C7.23145 14.0854 7.82737 14.0854 8.19492 13.7437C8.56248 13.402 8.56248 12.848 8.19492 12.5063L3.21338 7.875H15.0588C15.5786 7.875 16 7.48325 16 7C16 6.51675 15.5786 6.125 15.0588 6.125H3.21338L8.19492 1.49372Z"
            fill="#1F2933" />
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-800">Detalles</h1>
      <button class="text-gray-600 hover:text-gray-800 bg-white rounded-full p-2">
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M9.37369 0.959131C10.8629 0.0102623 12.8411 -0.251877 14.5501 0.300092C18.2675 1.50833 19.4215 5.59271 18.3893 8.84268C16.7967 13.947 9.99464 17.7545 9.70614 17.9142C9.60357 17.9714 9.49 18 9.37644 18C9.26287 18 9.15022 17.9723 9.04765 17.916C8.76099 17.7582 2.00842 14.007 0.362637 8.8436C0.361721 8.8436 0.361721 8.84268 0.361721 8.84268C-0.671358 5.59179 0.47895 1.50648 4.19272 0.300092C5.9365 -0.268491 7.83689 -0.0183514 9.37369 0.959131ZM4.61402 1.61817C1.60911 2.59473 0.854449 5.85208 1.67047 8.42086C2.95449 12.4471 8.02739 15.7026 9.37552 16.5084C10.7282 15.6943 15.8378 12.4028 17.0806 8.42455C17.8966 5.853 17.1392 2.59565 14.1297 1.61817C12.6717 1.1465 10.9709 1.43357 9.79681 2.34921C9.55136 2.53935 9.21067 2.54304 8.96339 2.35474C7.71966 1.41234 6.09495 1.13635 4.61402 1.61817ZM13.2505 3.4512C14.4988 3.85826 15.3734 4.97235 15.4806 6.2895C15.5108 6.67071 15.2296 7.00485 14.8514 7.03531C14.8322 7.03715 14.8138 7.03807 14.7946 7.03807C14.4402 7.03807 14.1398 6.76394 14.1105 6.40211C14.05 5.64339 13.5463 5.00281 12.8292 4.76928C12.4674 4.65113 12.2696 4.2607 12.3859 3.89795C12.5041 3.53428 12.8878 3.33675 13.2505 3.4512Z"
            fill="#6B7580" />
        </svg>
      </button>
    </header>

    <!-- Contenido principal -->
    <main class="p-[25px] pt-[20px]">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- Loading state -->
      <div v-if="!task && !error" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>

      <!-- Task content -->
      <div v-if="task" class="space-y-6">
        <!-- Sección de la imagen principal con categoría -->
        <div class="relative mb-6">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Task Image" class="w-full h-64 object-cover rounded-2xl">
          <div v-if="task.category"
            class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm font-medium px-3 py-1 rounded-full">
            {{ task.category.name }}
          </div>
        </div>

        <!-- Título -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ task.title }}</h2>
        </div>

        <!-- Navegación de pestañas -->
        <div class="flex justify-around mb-6 bg-gray-100 rounded-full p-1 border border-gray-200 p-2">
          <button @click="activeTab = 'progress'" :class="[
            'flex-1 text-center py-2 text-gray-700 rounded-full transition-colors',
            activeTab === 'progress' ? 'bg-purple-600 text-white shadow' : 'hover:bg-gray-300'
          ]">
            Progreso
          </button>
          <button @click="activeTab = 'info'" :class="[
            'flex-1 text-center py-2 text-gray-700 rounded-full transition-colors',
            activeTab === 'info' ? 'bg-purple-600 text-white shadow' : 'hover:bg-gray-300'
          ]">
            Info
          </button>
          <button @click="activeTab = 'trophies'" :class="[
            'flex-1 text-center py-2 text-gray-700 rounded-full transition-colors',
            activeTab === 'trophies' ? 'bg-purple-600 text-white shadow' : 'hover:bg-gray-300'
          ]">
            Trofeos
          </button>
        </div>

        <!-- Contenido de las pestañas -->
        <div class="bg-white rounded-xl shadow p-4 mb-6">
          <!-- Pestaña de Progreso -->
          <div v-if="activeTab === 'progress'" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Progreso Actual</h3>
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold text-purple-600">{{ task.count }}</div>
              </div>
            </div>

            <!-- Próximo logro -->
            <div v-if="nextAchievement" class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-purple-800">Próximo logro</h4>
                <span class="text-sm font-medium text-purple-600">{{ task.count }}/{{ nextAchievement.requirement
                }}</span>
              </div>
              <p class="text-purple-700 mb-3">{{ nextAchievement.title }}</p>
              <div class="relative w-full bg-white rounded-full h-2.5">
                <div
                  class="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  :style="{
                    width: `${Math.min((task.count / nextAchievement.requirement) * 100, 100)}%`,
                    '--progress-width': `${Math.min((task.count / nextAchievement.requirement) * 100, 100)}%`
                  }" :class="{ 'animate-progress': true }" ref="progressBarRef">
                </div>
                <div class="absolute -top-6 right-0 text-sm font-medium text-purple-600">
                  {{ Math.min(Math.round((task.count / nextAchievement.requirement) * 100), 100) }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Pestaña de Info -->
          <div v-if="activeTab === 'info'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">Descripción</h3>
            <p class="text-gray-600 whitespace-pre-line">{{ task.description }}</p>
            <div class="pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Categoría</h4>
              <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {{ task.category?.name || 'Sin categoría' }}
              </span>
            </div>
          </div>

          <!-- Pestaña de Trofeos -->
          <div v-if="activeTab === 'trophies'" class="space-y-4">
            <!-- <h3 class="text-lg font-semibold text-gray-800">Trofeos</h3> -->
            <div v-if="task?.achievements && task.achievements.length > 0" class="grid grid-cols-2 gap-4">
              <div v-for="achievement in task.achievements" :key="achievement.id"
                class="relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-4 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105"
                :class="task.completedAchievementIds.includes(achievement.id) ? 'border-2 border-yellow-400' : 'border border-gray-200'">

                <!-- Overlay para trofeos bloqueados -->
                <div v-if="!task.completedAchievementIds.includes(achievement.id)"
                  class="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div class="flex flex-col items-center">
                    <svg class="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="text-white text-sm font-medium">Bloqueado</span>
                  </div>
                </div>

                <!-- Icono del trofeo -->
                <div class="w-16 h-16 mb-3 relative">
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-20 blur-sm">
                  </div>
                  <svg class="w-full h-full relative z-10"
                    :class="task.completedAchievementIds.includes(achievement.id) ? 'text-yellow-500' : 'text-gray-400'"
                    viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor"
                      d="M26,7H24V6a2.0023,2.0023,0,0,0-2-2H10A2.0023,2.0023,0,0,0,8,6V7H6A2.0023,2.0023,0,0,0,4,9v3a4.0045,4.0045,0,0,0,4,4h.322A8.1689,8.1689,0,0,0,15,21.9341V26H10v2H22V26H17V21.9311A7.9661,7.9661,0,0,0,23.74,16H24a4.0045,4.0045,0,0,0,4-4V9A2.0023,2.0023,0,0,0,26,7ZM8,14a2.0023,2.0023,0,0,1-2-2V9H8Zm14,0a6,6,0,0,1-6.1855,5.9971A6.1991,6.1991,0,0,1,10,13.7065V6H22Zm4-2a2.0023,2.0023,0,0,1-2,2V9h2Z" />
                  </svg>
                </div>

                <!-- Título del logro -->
                <h4 class="font-medium text-gray-800 mb-2"
                  :class="{ 'text-yellow-600': task.completedAchievementIds.includes(achievement.id) }">
                  {{ achievement.title }}
                </h4>

                <!-- Progreso -->
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    class="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min((task.count / achievement.requirement) * 100, 100)}%` }">
                  </div>
                </div>
                <div class="text-sm font-medium"
                  :class="task.completedAchievementIds.includes(achievement.id) ? 'text-yellow-600' : 'text-gray-500'">
                  {{ task.count }}/{{ achievement.requirement }}
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 bg-gray-50 rounded-xl">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p class="text-gray-500">Todavía no hay logros disponibles para esta tarea</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Sección inferior: Botón de acción -->
    <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <button @click="handleIncrement"
        class="w-full bg-gradient-to-r from-lime-400 to-green-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 relative overflow-hidden group"
        :class="{ 'near-achievement': isNearAchievement }">
        <span class="relative z-10">Añadir +1</span>

        <!-- Efecto de onda -->
        <div class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>

        <!-- Efecto de clic -->
        <div class="absolute inset-0 scale-0 bg-white opacity-30 transition-transform duration-300 rounded-full"></div>

        <!-- Efecto de resplandor en el borde -->
        <div class="absolute inset-0 border-2 border-purple-600 rounded-xl" ref="animatedBorder"></div>

        <!-- Texto flotante -->
        <div v-if="showFloatingText" class="floating-text">+1</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '../stores/task.store';
import { useUserStore } from '../stores/user.store';
import { useGamificationStore } from '../stores/gamification.store';
import type { TaskWithProgress, Category } from '../types/task';
import * as taskService from '../services/task.service';
import { useCategoryStore } from '../stores/category.store';
import confetti from 'canvas-confetti';

// Declaración del módulo canvas-confetti
declare module 'canvas-confetti';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();
const userStore = useUserStore();
const gamificationStore = useGamificationStore();
const categoryStore = useCategoryStore();

const taskId = computed(() => Number(route.params.id));
const task = ref<TaskWithProgress | undefined>(undefined);
const error = ref<string | null>(null);
const activeTab = ref<'progress' | 'info' | 'trophies'>('progress');
const progressBarRef = ref<HTMLElement | null>(null);
const showFloatingText = ref(false);
const animatedBorder = ref<HTMLElement | null>(null);
const previousCompletedAchievementIds = ref<number[]>([]);

// Computed para obtener el próximo logro disponible
const nextAchievement = computed(() => {
  if (!task.value?.achievements) return null;

  // Ordenar los logros por requisito
  const sortedAchievements = [...task.value.achievements].sort((a, b) =>
    Number(a.requirement) - Number(b.requirement)
  );

  // Encontrar el primer logro no completado
  return sortedAchievements.find(achievement =>
    !task.value?.completedAchievementIds.includes(achievement.id)
  );
});

// Computed para verificar si estamos cerca de un logro
const isNearAchievement = computed(() => {
  if (!task.value?.achievements || !nextAchievement.value) return false;
  const progress = (task.value.count / nextAchievement.value.requirement) * 100;
  return progress >= 80 && progress < 100;
});

// Watcher para detectar cuando se completa un logro
watch(() => task.value?.completedAchievementIds, (newIds, oldIds) => {
  if (!newIds || !oldIds) return;

  // Si hay nuevos logros completados, lanzar confeti
  const newlyCompleted = newIds.filter(id => !oldIds.includes(id));
  if (newlyCompleted.length > 0) {
    console.log('>>> [TaskDetailView] ¡Nuevo logro completado! Lanzando confeti...');
    launchConfetti();
  }
}, { deep: true });

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

      const category = categoryStore.categories.find((cat: Category) => cat.id === foundTask.category_id);

      task.value = {
        ...foundTask,
        count: progress.count,
        progress: progress.progress,
        completedAchievementIds,
        category: category || { id: 0, name: 'Sin categoría', created_at: '', updated_at: '' }
      };

      // Reiniciar la animación de la barra de progreso
      if (progressBarRef.value) {
        progressBarRef.value.style.animation = 'none';
        progressBarRef.value.offsetHeight; // Forzar reflow
        progressBarRef.value.style.animation = 'progressFill 1s ease-out forwards';
      }
    } else {
      error.value = 'Tarea no encontrada';
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido';
    console.error('Error al cargar la tarea:', e);
  }
}

// Función para lanzar confeti
function launchConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

// Función para reiniciar la animación del borde
function startBorderAnimation() {
  if (animatedBorder.value) {
    animatedBorder.value.classList.remove('animate-border');
    void animatedBorder.value.offsetWidth; // truco para reiniciar animación
    animatedBorder.value.classList.add('animate-border');
  }
}

// Modificar la función handleIncrement
async function handleIncrement() {
  console.log('>>> [TaskDetailView] handleIncrement ejecutado para task:', task.value?.id);
  if (!task.value || !userStore.user) return;

  const userId = userStore.user.id;
  const currentTask = task.value;

  // Mostrar texto flotante
  showFloatingText.value = true;
  setTimeout(() => {
    showFloatingText.value = false;
  }, 1000);

  // Iniciar animación del borde
  startBorderAnimation();

  try {
    console.log('>>> [TaskDetailView] Llamando a gamificationStore.registerAction con userId: %s, taskId: %d', userId, currentTask.id);
    // Llamar a registerAction que maneja la actualización en backend y recarga datos de gamificación
    await gamificationStore.registerAction(userId, currentTask.id);
    console.log('>>> [TaskDetailView] gamificationStore.registerAction finalizado.');

    // Actualizar el estado local (esto es reactivo por Pinia)
    if (task.value) {
      // No necesitamos incrementar localmente, el fetchTaskDetail lo hará
      // task.value.count = task.value.count + 1;
      console.log('>>> [TaskDetailView] Contador local (antes de refetch): ', task.value.count);
    }

    // Recargar los detalles de la tarea para asegurar sincronización con la BD
    // Esto actualizará el task.value reactivo con el nuevo count y completedAchievementIds
    console.log('>>> [TaskDetailView] Refetching task detail...');
    await fetchTaskDetail(currentTask.id);
    console.log('>>> [TaskDetailView] Task detail refetched.');

    // Verificar si se completó un logro (basado en los datos refetched)
    // La lógica de confeti se basa en si completedAchievementIds incluye el nextAchievement.id
    // Esto ya está manejado reactivamente por el computed nextAchievement y la condición en el template.
    // Sin embargo, si necesitas disparar efectos *inmediatamente* al conseguir un logro, podrías necesitar
    // comparar completedAchievementIds antes y después del fetch, o basarte en el resultado de registerAction
    // si este retorna información sobre logros desbloqueados.
    // Por ahora, confiamos en que el template reaccionará a los completedAchievementIds actualizados por fetchTaskDetail.

    console.log('>>> [TaskDetailView] Verificando confeti (basado en estado reactivo)...');
    // El confeti se dispara si nextAchievement cambia de un estado no cumplido a cumplido después del fetch
    // Esto es manejado por la lógica actual que verifica completedAchievementIds en el computed properties y template.

  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al registrar la acción o actualizar la tarea.';
    console.error('>>> [TaskDetailView] Error en handleIncrement:', e);
  }
}

onMounted(async () => {
  if (!userStore.user) {
    await userStore.checkSession();
  }

  await categoryStore.fetchCategories();

  if (taskId.value) {
    await fetchTaskDetail(taskId.value);
  }

  startBorderAnimation();
});

watch(taskId, async (newId: number) => {
  if (newId) {
    await fetchTaskDetail(newId);
  }
});
</script>

<style scoped>
@keyframes progressFill {
  from {
    width: 0%;
  }

  to {
    width: var(--progress-width);
  }
}

.animate-progress {
  animation: progressFill 1s ease-out forwards;
}

/* Estilos para el botón de incremento */
@keyframes buttonPulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

button:active {
  animation: buttonPulse 0.3s ease-out;
}

/* Estilos para las partículas */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--color), 0 0 30px var(--color);
  animation: particle 1.2s ease-out forwards;
  animation-delay: var(--delay);
  animation-duration: var(--duration);
  opacity: 0;
}

@keyframes particle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  100% {
    transform: translate(calc(-50% + var(--x)),
        calc(-50% + var(--y))) scale(0);
    opacity: 0;
  }
}

/* Mejora del efecto del botón */
button {
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

button:active {
  transform: scale(0.95);
  box-shadow: 0 0 0 4px rgba(132, 204, 22, 0.3);
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

button:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }

  100% {
    transform: scale(100, 100);
    opacity: 0;
  }
}

/* Efecto de brillo al hacer hover */
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  transition: 0.5s;
}

button:hover::before {
  left: 100%;
}

/* Efecto de resplandor en el borde */
@keyframes border-draw {
  0% {
    clip-path: inset(0 100% 100% 0);
  }

  100% {
    clip-path: inset(0 0 100% 0);
  }
}

.animate-border {
  animation: border-draw 2s linear forwards;
  box-shadow: 0 0 6px 2px rgba(147, 51, 234, 0.7);
}

/* Efecto especial cuando está cerca de un logro */
.near-achievement .animate-border {
  animation: border-draw 1.5s linear forwards;
  box-shadow: 0 0 8px 3px rgba(147, 51, 234, 0.8);
}

/* Efecto de texto flotante */
.floating-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  pointer-events: none;
  animation: float-up 1s ease-out forwards;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.5);
  }
}

/* Efecto especial cuando está cerca de un logro */
.near-achievement {
  background: linear-gradient(45deg,
      #84cc16,
      #22c55e,
      #16a34a,
      #22c55e,
      #84cc16);
  background-size: 100% 100%;
  box-shadow: 0 0 20px rgba(132, 204, 22, 0.5);
}
</style>