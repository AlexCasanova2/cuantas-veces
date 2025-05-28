<template>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
            <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                <div class="max-w-md mx-auto">
                    <div class="divide-y divide-gray-200">
                        <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <div class="flex justify-between items-center mb-6">
                                <div>
                                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Misión</h1>
                                    <p class="text-gray-600 dark:text-gray-400 mt-1">Completa los detalles de la misión
                                    </p>
                                </div>
                                <button @click="$router.push('/admin')"
                                    class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    Volver
                                </button>
                            </div>

                            <form @submit.prevent="handleSubmit" class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Título</label>
                                    <input v-model="missionForm.title" type="text" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea v-model="missionForm.description" rows="3" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Estado</label>
                                    <select v-model="missionForm.state"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="draft">Borrador</option>
                                        <option value="published">Publicado</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Recompensa XP</label>
                                    <input v-model.number="missionForm.xp_reward" type="number" required min="0"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                </div>

                                <!-- Requisitos de Logros -->
                                <div>
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="block text-sm font-medium text-gray-700">
                                            Requisitos de Logros
                                        </label>
                                        <button type="button" @click="addAchievementRequirement"
                                            class="text-sm text-blue-600 hover:text-blue-700">
                                            + Añadir Logro
                                        </button>
                                    </div>

                                    <div v-for="(req, index) in missionForm.achievement_requirements" :key="index"
                                        class="mb-4 p-4 border rounded-lg">
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="text-sm font-medium text-gray-700">Logro {{ index + 1 }}</h4>
                                            <button type="button" @click="removeAchievementRequirement(index)"
                                                class="text-red-600 hover:text-red-700">
                                                Eliminar
                                            </button>
                                        </div>

                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-xs text-gray-600">Tarea</label>
                                                <select v-model="req.taskId" required @change="updateAchievementId(index, req.achievementId)"
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                    <option value="">Selecciona una tarea</option>
                                                    <option v-for="task in tasks" :key="task.id" :value="task.id">
                                                        {{ task.title }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="block text-xs text-gray-600">Logro</label>
                                                <select v-model="req.achievementId" required
                                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                    <option value="">Selecciona un logro</option>
                                                    <option v-for="achievement in getTaskAchievements(req.taskId)"
                                                        :key="achievement.id" :value="achievement.id">
                                                        {{ achievement.title }} ({{ achievement.requirement }} veces)
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-end space-x-3">
                                    <button type="button" @click="$router.push('/admin')"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                                        Cancelar
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                        Crear Misión
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMissionStore } from '../../stores/mission.store';
import { useTaskStore } from '../../stores/task.store';
import type { CreateMissionDTO } from '../../types/mission';
import type { Task } from '../../types/task';

const router = useRouter();
const missionStore = useMissionStore();
const taskStore = useTaskStore();

const tasks = ref<Task[]>([]);

const missionForm = ref<CreateMissionDTO>({
    title: '',
    description: '',
    state: 'draft',
    requirement: [],
    achievement_requirements: [],
    xp_reward: 100
});

function addAchievementRequirement() {
    missionForm.value.achievement_requirements.push({
        taskId: 0,
        achievementId: 0
    });
}

function removeAchievementRequirement(index: number) {
    missionForm.value.achievement_requirements.splice(index, 1);
}

function updateAchievementId(index: number, achievementId: number) {
    if (missionForm.value.achievement_requirements) {
        missionForm.value.achievement_requirements[index].achievementId = achievementId;
    }
}

function getTaskAchievements(taskId: number) {
    const task = tasks.value.find(t => t.id === taskId);
    return task?.achievements || [];
}

async function loadTasks() {
    try {
        await taskStore.fetchTasks();
        tasks.value = taskStore.tasks;
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

async function handleSubmit() {
    try {
        if (!validateForm()) {
            alert('Por favor, completa todos los campos y selecciona una tarea y un logro para cada requisito');
            return;
        }

        await missionStore.createMission(missionForm.value);
        router.push('/admin');
    } catch (error) {
        console.error('Error al crear la misión:', error);
    }
}

const validateForm = () => {
    if (!missionForm.value.title || !missionForm.value.description) {
        return false;
    }

    if (missionForm.value.achievement_requirements?.some(req => !req.taskId || !req.achievementId)) {
        return false;
    }

    return true;
};

onMounted(() => {
    loadTasks();
});
</script>