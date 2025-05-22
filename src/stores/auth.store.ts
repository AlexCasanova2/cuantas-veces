import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const profile = ref<Profile | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const isAdmin = computed(() => {
        return profile.value?.role === 'admin';
    });

    const isWebUser = computed(() => {
        return !navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
    });

    const canAccessAdmin = computed(() => {
        return isAdmin.value && isWebUser.value;
    });

    async function checkUser() {
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
            } else {
                profile.value = null;
            }

            return session;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            throw e;
        }
    }

    async function register(email: string, password: string, metadata: { name: string }) {
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            });

            if (signUpError) throw signUpError;
            return data;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al registrar usuario';
            throw e;
        }
    }

    async function login(email: string, password: string) {
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) throw signInError;
            
            user.value = data.user;
            await checkUser();
            
            return data;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error al iniciar sesión';
            throw e;
        }
    }

    async function setUserRole(userId: string, role: 'admin' | 'user') {
        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', userId);

            if (updateError) throw updateError;
            
            if (profile.value) {
                profile.value.role = role;
            }
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            throw e;
        }
    }

    async function logout() {
        try {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            
            user.value = null;
            profile.value = null;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            throw e;
        }
    }

    return {
        user,
        profile,
        isLoading,
        error,
        isAdmin,
        isWebUser,
        canAccessAdmin,
        checkUser,
        register,
        login,
        setUserRole,
        logout
    };
}); 