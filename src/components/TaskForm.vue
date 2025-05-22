<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
        Título
      </label>
      <input
        v-model="form.title"
        type="text"
        id="title"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Descripción
      </label>
      <textarea
        v-model="form.description"
        id="description"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <!-- Selector de categoría -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
        Categoría
      </label>
      <div class="flex gap-2">
        <select
          v-model="form.category_id"
          id="category"
          class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Selecciona una categoría</option>
          <option v-for="category in categoryStore.categories" 
                  :key="category.id" 
                  :value="category.id"
                  :style="{ color: category.color }">
            {{ category.name }}
          </option>
        </select>
        <button
          type="button"
          @click="showCategoryManager = true"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }} Tarea
      </button>
    </div>
  </form>

  <!-- Modal de gestión de categorías -->
  <div v-if="showCategoryManager" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
      <div class="p-4 border-b">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Gestionar Categorías</h3>
          <button @click="showCategoryManager = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from '@vue/runtime-core';
import { useCategoryStore } from '../stores/category.store';
import CategoryManager from './CategoryManager.vue';
import type { Task } from '../types/task';

const props = defineProps<{
  task?: Task;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', task: Partial<Task>): void;
}>();

const categoryStore = useCategoryStore();
const showCategoryManager = ref(false);

const form = ref({
  title: props.task?.title || '',
  description: props.task?.description || '',
  category_id: props.task?.category_id || '',
});

onMounted(async () => {
  await categoryStore.fetchCategories();
});

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    category_id: Number(form.value.category_id)
  });
};
</script> 