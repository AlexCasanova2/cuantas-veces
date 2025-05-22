<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-gray-900 dark:text-white">
              Cuantas Veces
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <template v-if="authStore.user">
            <router-link
              v-if="authStore.canAccessAdmin"
              to="/admin"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Administración
            </router-link>
            <button
              @click="handleLogout"
              class="ml-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="ml-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Registrarse
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

async function handleLogout() {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}
</script> 