<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Gestionar Categorías</h2>
    
    <!-- Formulario de nueva categoría -->
    <form @submit.prevent="handleSubmit" class="mb-6">
      <div class="flex gap-4">
        <div class="flex-grow">
          <input
            v-model="newCategory.name"
            type="text"
            placeholder="Nombre de la categoría"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="w-32">
          <input
            v-model="newCategory.color"
            type="color"
            class="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Añadir
        </button>
      </div>
    </form>

    <!-- Lista de categorías -->
    <div class="space-y-3">
      <div v-for="category in categories" :key="category.id" 
           class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: category.color }"></div>
          <span class="font-medium">{{ category.name }}</span>
        </div>
        <button
          @click="deleteCategory(category.id)"
          class="text-red-600 hover:text-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { useCategoryStore } from '../stores/category.store';

interface Category {
  id: number;
  name: string;
  color: string;
}

const categoryStore = useCategoryStore();
const categories = ref<Category[]>([]);

const newCategory = ref({
  name: '',
  color: '#3B82F6' // Color azul por defecto
});

// Cargar categorías iniciales
const loadCategories = async () => {
  categories.value = await categoryStore.fetchCategories();
};

// Manejar el envío del formulario
const handleSubmit = async () => {
  try {
    await categoryStore.createCategory({
      name: newCategory.value.name,
      color: newCategory.value.color
    });
    newCategory.value.name = '';
    await loadCategories();
  } catch (error) {
    console.error('Error al crear la categoría:', error);
  }
};

// Eliminar categoría
const deleteCategory = async (id: number) => {
  try {
    await categoryStore.deleteCategory(id);
    await loadCategories();
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
  }
};

// Cargar categorías al montar el componente
loadCategories();
</script> 