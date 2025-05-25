<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useUserStore } from './stores/user.store'
import { RealtimeService } from './services/realtime.service'

const userStore = useUserStore()
const isAuthenticated = computed(() => {
  return !!userStore.user && !!userStore.profile
})

let realtimeService: RealtimeService | null = null

onMounted(async () => {
  await userStore.checkSession()
  if (userStore.user) {
    realtimeService = new RealtimeService()
  }
})

onUnmounted(() => {
  if (realtimeService) {
    realtimeService.cleanup()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

/* Transiciones de deslizamiento */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Estilo para asegurar que las vistas ocupen espacio para la transición */
.router-view-transition {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<style>
body,
#app {
  width: 100%;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* Estilos específicos para la vista de administración */
.admin-view {
  width: 100%;
  min-height: 100vh;
  padding: 1.5rem;
}
</style>
