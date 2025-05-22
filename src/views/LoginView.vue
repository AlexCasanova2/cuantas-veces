<template>
    <div class="min-h-screen flex flex-col bg-[#43553B]" style="min-height: 100dvh;">
        <div class="flex-1 flex flex-col justify-end"></div>
        <div class="rounded-t-3xl bg-white px-6 pt-8 pb-6 shadow-lg">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
            <p class="text-gray-500 mb-6">Accede a tu cuenta para continuar</p>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <BaseInput v-model="email" label="Email" type="email" placeholder="tucorreo@email.com"
                    id="login-email" />
                <BaseInput v-model="password" label="Contraseña" type="password" placeholder="••••••••"
                    id="login-password" />
                <BaseButton type="submit" class="w-full mt-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold">
                    Entrar
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
                ¿No tienes cuenta?
                <router-link to="/register" class="text-lime-600 font-semibold hover:underline">Regístrate
                    aquí</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user.store';
import BaseButton from '../components/ui/BaseButton.vue';
import BaseInput from '../components/ui/BaseInput.vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

async function handleLogin() {
    try {
        await userStore.login(email.value, password.value);
        router.push('/home');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        alert('Error en login: ' + errorMessage);
    }
}
</script>