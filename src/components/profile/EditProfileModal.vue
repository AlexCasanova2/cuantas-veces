<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-dark dark:text-white">Editar Perfil</h2>
                <button @click="close"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Avatar -->
                <div class="flex flex-col items-center mb-6">
                    <div class="relative">
                        <div
                            class="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <span v-if="!avatarPreview && !userStore.profile?.avatar_url"
                                class="text-3xl text-white font-semibold">
                                {{ userInitials }}
                            </span>
                            <img v-else :src="avatarPreview || userStore.profile?.avatar_url" alt="Avatar"
                                class="w-24 h-24 rounded-full object-cover" />
                        </div>
                        <div class="absolute bottom-0 right-0 flex gap-2">
                            <label class="bg-white dark:bg-gray-700 rounded-full p-2 cursor-pointer shadow-lg">
                                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                            <button v-if="userStore.profile?.avatar_url || avatarPreview" @click="removeAvatar"
                                class="bg-white dark:bg-gray-700 rounded-full p-2 cursor-pointer shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Nombre -->
                <div>
                    <label for="name"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input type="text" id="name" v-model="form.name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                <!-- Email -->
                <div>
                    <label for="email"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" v-model="form.email" disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400" />
                </div>

                <!-- Biografía -->
                <div>
                    <label for="bio"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografía</label>
                    <textarea id="bio" v-model="form.bio" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>

                <!-- Botones -->
                <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" @click="close"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '../../stores/user.store';

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'update'): void;
}>();

const userStore = useUserStore();
const avatarPreview = ref<string | null>(null);

const form = ref({
    name: '',
    email: '',
    bio: '',
    avatar: null as File | null,
    removeAvatar: false
});

const userInitials = computed(() => {
    const name = form.value.name || '';
    return name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
});

function handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        form.value.avatar = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
}

function removeAvatar() {
    form.value.avatar = null;
    form.value.removeAvatar = true;
    avatarPreview.value = null;
}

const handleSubmit = async () => {
    try {
        const formData = {
            name: form.value.name,
            bio: form.value.bio,
            avatar: form.value.avatar || undefined,
            removeAvatar: form.value.removeAvatar
        };
        await userStore.updateProfile(formData);
        emit('close');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
    }
};

function close() {
    emit('close');
}
</script>