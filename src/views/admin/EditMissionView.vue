<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Misión</h1>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">Modifica los detalles de la misión</p>
                    </div>
                    <button @click="$router.push('/admin')"
                        class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        Volver
                    </button>
                </div>

                <form v-if="mission" @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Título
                        </label>
                        <input v-model="missionForm.title" type="text" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>
                        <textarea v-model="missionForm.description" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estado
                        </label>
                        <select v-model="missionForm.state"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required>
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                            <option value="deleted">Eliminado</option>
                        </select>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Requisitos
                            </label>
                            <button type="button" @click="addRequirement"
                                class="text-sm text-blue-600 hover:text-blue-700">
                                + Añadir Requisito
                            </button>
                        </div>
                        <div v-for="(requirement, index) in missionForm.requirement" :key="index"
                            class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Requisito {{ index + 1
                                }}</h4>
                                <button type="button" @click="removeRequirement(index)"
                                    class="text-red-600 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Título</label>
                                    <input v-model="requirement.title" type="text" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Descripción</label>
                                    <input v-model="requirement.description" type="text" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Requisito</label>
                                    <input v-model.number="requirement.requirement" type="number" required min="1"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="$router.push('/admin')"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                            Guardar Cambios
                        </button>
                    </div>
                </form>

                <div v-else class="text-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando misión...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { useMissionStore } from '../../stores/mission.store';
import type { Mission, MissionRequirement } from '../../types/mission';

const route = useRoute();
const router = useRouter();
const missionStore = useMissionStore();

const mission = ref<Mission | null>(null);

const missionForm = ref({
    title: '',
    description: '',
    state: 'draft' as const,
    requirement: [] as MissionRequirement[],
    xp_reward: 0
});

onMounted(async () => {
    await loadMission();
});

async function loadMission() {
    try {
        const missionId = Number(route.params.id);
        const loadedMission = await missionStore.getMission(missionId);
        if (loadedMission) {
            mission.value = loadedMission;
            missionForm.value = {
                title: loadedMission.title,
                description: loadedMission.description,
                state: loadedMission.state,
                requirement: loadedMission.requirement.map((r: MissionRequirement) => ({
                    title: r.title,
                    description: r.description,
                    requirement: Number(r.requirement)
                })),
                xp_reward: loadedMission.xp_reward
            };
        }
    } catch (error) {
        console.error('Error al cargar la misión:', error);
        router.push('/admin');
    }
}

function addRequirement() {
    missionForm.value.requirement.push({
        title: '',
        description: '',
        requirement: 1
    });
}

function removeRequirement(index: number) {
    missionForm.value.requirement.splice(index, 1);
}

async function handleSubmit() {
    if (!mission.value) return;

    try {
        await missionStore.updateMission(mission.value.id!, missionForm.value);
        router.push('/admin');
    } catch (error) {
        console.error('Error al actualizar la misión:', error);
    }
}
</script>