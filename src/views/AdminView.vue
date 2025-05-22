<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
        <button @click="showCreateTaskModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Crear Nueva Tarea
        </button>
      </div>

      <!-- Lista de tareas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="task in taskStore.tasks" :key="task.id" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
            <div class="flex space-x-2">
              <button @click="editTask(task)" class="text-blue-600 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="deleteTask(task.id)" class="text-red-600 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">{{ task.description }}</p>
          <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{{ task.category }}</span>
          </div>
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logros:</h4>
            <ul class="space-y-2">
              <li v-for="achievement in task.achievements" :key="achievement.id"
                class="text-sm text-gray-600 dark:text-gray-400">
                • {{ achievement.title }} ({{ achievement.requirement }})
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de creación/edición -->
    <div v-if="showCreateTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ editingTask ? 'Editar Tarea' : 'Crear Nueva Tarea' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título
            </label>
            <input v-model="taskForm.title" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea v-model="taskForm.description"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoría
            </label>
            <div class="flex gap-2">
              <select v-model="taskForm.category_id"
                class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required>
                <option value="">Selecciona una categoría</option>
                <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id"
                  :style="{ color: category.color }">
                  {{ category.name }}
                </option>
              </select>
              <button type="button" @click="showCategoryManager = true"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Logros -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Logros
              </label>
              <button type="button" @click="addAchievement" class="text-sm text-blue-600 hover:text-blue-700">
                + Añadir Logro
              </button>
            </div>
            <div v-for="(achievement, index) in taskForm.achievements" :key="index"
              class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Logro {{ index + 1 }}</h4>
                <button type="button" @click="removeAchievement(index)" class="text-red-600 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400">Título</label>
                  <input v-model="achievement.title" type="text" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400">Descripción</label>
                  <input v-model="achievement.description" type="text" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-400">Requisito</label>
                  <input v-model.number="achievement.requirement" type="number" required min="1"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateTaskModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              Cancelar
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
              {{ editingTask ? 'Guardar Cambios' : 'Crear Tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de gestión de categorías -->
    <div v-if="showCategoryManager" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gestionar Categorías</h3>
            <button @click="showCategoryManager = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <CategoryManager />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '@vue/runtime-core';
import { useAuthStore } from '../stores/auth.store';
import { useTaskStore } from '../stores/task.store';
import { useCategoryStore } from '../stores/category.store';
import CategoryManager from '../components/CategoryManager.vue';
import type { Task, CreateTaskDTO } from '../types/task';

const authStore = useAuthStore();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const showCreateTaskModal = ref(false);
const showCategoryManager = ref(false);
const editingTask = ref<Task | null>(null);
const taskForm = ref<CreateTaskDTO>({
  title: '',
  description: '',
  category_id: 0,
  achievements: []
});

onMounted(async () => {
  await authStore.checkUser();
  await taskStore.fetchTasks();
  await categoryStore.fetchCategories();
});

function addAchievement() {
  taskForm.value.achievements.push({
    title: '',
    description: '',
    requirement: 1
  });
}

function removeAchievement(index: number) {
  taskForm.value.achievements.splice(index, 1);
}

async function handleSubmit() {
  try {
    if (editingTask.value) {
      // Solo actualizamos la tarea si ha cambiado
      const hasTaskChanged =
        taskForm.value.title !== editingTask.value.title ||
        taskForm.value.description !== editingTask.value.description ||
        taskForm.value.category_id !== editingTask.value.category_id;

      if (hasTaskChanged) {
        await taskStore.updateTask(editingTask.value.id, {
          title: taskForm.value.title,
          description: taskForm.value.description,
          category_id: taskForm.value.category_id
        });
      }

      // Filtramos solo los logros nuevos (los que no tienen id)
      const newAchievements = taskForm.value.achievements.filter(a => !('id' in a));
      if (newAchievements.length > 0) {
        await taskStore.addAchievementsToTask(editingTask.value.id, newAchievements);
      }
    } else {
      await taskStore.createTask(taskForm.value);
    }
    showCreateTaskModal.value = false;
    resetForm();
  } catch (error) {
    console.error('Error al guardar la tarea:', error);
  }
}

function editTask(task: Task) {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    category_id: task.category_id,
    achievements: task.achievements?.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      requirement: Number(a.requirement)
    })) || []
  };
  showCreateTaskModal.value = true;
}

async function deleteTask(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    try {
      await taskStore.deleteTask(id);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  }
}

function resetForm() {
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    category_id: 0,
    achievements: []
  };
}
</script>