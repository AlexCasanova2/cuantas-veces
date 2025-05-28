import { defineStore } from 'pinia';
import * as categoryService from '../services/category.service';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types/category';

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

    async createCategory(category: CreateCategoryDTO) {
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

    async updateCategory(id: number, category: UpdateCategoryDTO) {
      this.loading = true;
      this.error = null;
      try {
        const updatedCategory = await categoryService.updateCategory(id, category);
        const index = this.categories.findIndex(cat => cat.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
        return updatedCategory;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al actualizar la categoría';
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