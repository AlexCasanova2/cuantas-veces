<template>
    <div class="min-h-screen flex flex-col bg-[#43553B]" style="min-height: 100dvh;">
        <div class="flex-1 flex flex-col justify-end"></div>
        <div class="rounded-t-3xl bg-white px-6 pt-8 pb-6 shadow-lg">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Crear una cuenta</h1>
            <p class="text-gray-500 mb-6">Regístrate para comenzar a usar la app</p>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <BaseInput v-model="form.name" label="Nombre" type="text" placeholder="Tu nombre" id="register-name" />
                <BaseInput v-model="form.email" label="Email" type="email" placeholder="tucorreo@email.com"
                    id="register-email" />
                <BaseInput v-model="form.password" label="Contraseña" type="password" placeholder="••••••••"
                    id="register-password" />
                <BaseButton type="submit" class="w-full mt-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold">
                    <span v-if="isLoading">Registrando...</span>
                    <span v-else>Registrarse</span>
                </BaseButton>
            </form>
            <div class="my-6 flex items-center justify-center">
                <span class="text-gray-400 text-xs">O continúa con</span>
            </div>
            <div class="flex justify-center gap-4 mb-4">
                <button class="bg-white border border-gray-200 rounded-xl p-3 shadow hover:bg-gray-50 transition">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-6 h-6" />
                </button>
                <button class="bg-white border border-gray-200 rounded-xl p-3 shadow hover:bg-gray-50 transition">
                    <img src="https://www.svgrepo.com/show/475700/facebook-color.svg" alt="Facebook" class="w-6 h-6" />
                </button>
            </div>
            <p class="text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?
                <router-link to="/" class="text-lime-600 font-semibold hover:underline">Inicia sesión
                    aquí</router-link>
            </p>
            <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center mt-2">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
    name: '',
    email: '',
    password: ''
});

const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
    isLoading.value = true;
    error.value = null;
    try {
        await userStore.register(form.value.email, form.value.password, form.value.name);
        router.push('/home');
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Error al registrar usuario';
    } finally {
        isLoading.value = false;
    }
}
</script>