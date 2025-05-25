<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre
        </label>
        <input v-model="categoryForm.name" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        <div class="flex gap-2">
          <input v-model="categoryForm.color" type="color"
            class="h-10 w-20 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
          <input v-model="categoryForm.color" type="text" required
            class="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
          {{ editingCategory ? 'Guardar Cambios' : 'Crear Categoría' }}
        </button>
      </div>
    </form>

    <div class="mt-6">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categorías Existentes</h4>
      <div class="space-y-2">
        <div v-for="category in categoryStore.categories" :key="category.id"
          class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: category.color }"></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="editCategory(category)"
              class="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="deleteCategory(category.id)"
              class="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { useCategoryStore } from '../stores/category.store';
import type { Category, CreateCategoryDTO } from '../types/category';

const categoryStore = useCategoryStore();

const editingCategory = ref<Category | null>(null);

const categoryForm = ref<CreateCategoryDTO>({
  name: '',
  color: '#6B7280'
});

function editCategory(category: Category) {
  editingCategory.value = category;
  categoryForm.value = {
    name: category.name,
    color: category.color
  };
}

async function handleSubmit() {
  try {
    if (editingCategory.value) {
      await categoryStore.updateCategory(editingCategory.value.id, categoryForm.value);
    } else {
      await categoryStore.createCategory(categoryForm.value);
    }
    resetForm();
  } catch (error) {
    console.error('Error al guardar la categoría:', error);
  }
}

async function deleteCategory(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
    try {
      await categoryStore.deleteCategory(id);
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  }
}

function resetForm() {
  categoryForm.value = {
    name: '',
    color: '#6B7280'
  };
  editingCategory.value = null;
}
</script>