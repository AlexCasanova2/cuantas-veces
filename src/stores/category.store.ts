import { defineStore } from 'pinia';
import * as categoryService from '../services/category.service';
import type { Category } from '../types/task';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const categories = await categoryService.fetchCategories();
        this.categories = categories;
        return categories;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al cargar las categorías';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(category: Omit<Category, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        const newCategory = await categoryService.createCategory(category);
        this.categories.push(newCategory);
        return newCategory;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al crear la categoría';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await categoryService.deleteCategory(id);
        this.categories = this.categories.filter(cat => cat.id !== id);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al eliminar la categoría';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
}); 