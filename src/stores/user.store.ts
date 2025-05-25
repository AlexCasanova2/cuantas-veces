import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    name: string;
    role: 'admin' | 'user';
    bio?: string;
    avatar_url?: string;
    xp: number;
    level: number;
    created_at: string;
    updated_at: string;
}

interface UpdateProfileDTO {
    name?: string;
    bio?: string;
    avatar?: File;
    removeAvatar?: boolean;
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
            const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            user.value = session.user;
            await fetchProfile();
        }
    }

    async function fetchProfile() {
        if (!user.value) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.value.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return;
        }

        profile.value = data;
    }

    async function updateProfile(updates: UpdateProfileDTO) {
        if (!user.value) return;

        let avatar_url: string | undefined = profile.value?.avatar_url;

        // Si se solicita eliminar el avatar
        if (updates.removeAvatar) {
            avatar_url = undefined;
        }
        // Si hay un nuevo avatar, súbelo primero
        else if (updates.avatar) {
            try {
                const fileExt = updates.avatar.name.split('.').pop();
                const fileName = `${user.value.id}-${Date.now()}.${fileExt}`;
                
                // Subir el archivo
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, updates.avatar, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Error uploading avatar:', uploadError);
                    throw uploadError;
                }

                // Obtener la URL pública del avatar
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName);

                avatar_url = publicUrl;
            } catch (error) {
                console.error('Error al procesar el avatar:', error);
                throw error;
            }
        }

        try {
            // Actualizar el perfil
            const { data, error } = await supabase
                    .from('profiles')
                .update({
                    name: updates.name,
                    bio: updates.bio,
                    avatar_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.value.id)
                .select()
                    .single();

            if (error) {
                console.error('Error updating profile:', error);
                throw error;
            }

            profile.value = data;
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            throw error;
        }
    }

    async function addXP(amount: number) {
        if (!user.value || !profile.value) return;

        try {
            const newXP = (profile.value.xp || 0) + amount;
            const newLevel = Math.floor(newXP / 100) + 1; // Cada 100 XP sube un nivel

            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    xp: newXP,
                    level: newLevel,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.value.id)
                .select()
                .single();

            if (updateError) throw updateError;

            profile.value = data;
            return data;
        } catch (e) {
            console.error('Error al añadir XP:', e);
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
        checkSession,
        fetchProfile,
        updateProfile,
        addXP
    };
});
