import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    name: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const profile = ref<Profile | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    let inactivityTimeout: ReturnType<typeof setTimeout> | null = null;

    async function login(email: string, password: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) throw signInError;
            
            user.value = data.user;

            // Obtener el perfil del usuario
            if (data.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) throw profileError;
                profile.value = profileData;
            }

            // Iniciar el temporizador de inactividad
            startInactivityTimer();

            return data;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error en login';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function register(email: string, password: string, name: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name
                    }
                }
            });

            if (signUpError) throw signUpError;
            
            user.value = data.user;

            // Iniciar el temporizador de inactividad
            startInactivityTimer();

            return data;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error en registro';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            
            user.value = null;
            profile.value = null;
            clearInactivityTimer();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error en logout';
            throw e;
        }
    }

    async function checkSession() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            user.value = session?.user ?? null;

            if (session?.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) throw profileError;
                profile.value = profileData;
            }

            // Iniciar el temporizador de inactividad
            startInactivityTimer();

            return session;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al verificar sesión';
            throw e;
        }
    }

    function startInactivityTimer() {
        clearInactivityTimer();
        inactivityTimeout = setTimeout(async () => {
            await logout();
            window.location.href = '/';
        }, 10 * 60 * 1000); // 10 minutos
    }

    function clearInactivityTimer() {
        if (inactivityTimeout) {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = null;
        }
    }

    // Detectar cuando la app pasa a segundo plano o vuelve
    if (typeof window !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // App en segundo plano: iniciar temporizador
                startInactivityTimer();
            } else {
                // App vuelve a primer plano: reiniciar temporizador
                startInactivityTimer();
            }
        });
    }

    return {
        user,
        profile,
        isLoading,
        error,
        login,
        register,
        logout,
        checkSession
    };
});
