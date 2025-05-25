<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Crear Nueva Tarea</h1>
                        <p class="text-gray-600 dark:text-gray-400 mt-1">Completa los detalles de la tarea</p>
                    </div>
                    <button @click="$router.push('/admin')"
                        class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        Volver
                    </button>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Título
                        </label>
                        <input v-model="taskForm.title" type="text" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>
                        <textarea v-model="taskForm.description" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Categoría
                        </label>
                        <div class="flex gap-2">
                            <select v-model="taskForm.category_id"
                                class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required>
                                <option value="">Selecciona una categoría</option>
                                <option v-for="category in categoryStore.categories" :key="category.id"
                                    :value="category.id" :style="{ color: category.color }">
                                    {{ category.name }}
                                </option>
                            </select>
                            <button type="button" @click="showCategoryManager = true"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 110 2h-5v5a1 1 11-2 0v-5H4a1 1 110-2h5V4a1 1 111-1z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estado
                        </label>
                        <select v-model="taskForm.state"
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
                                Logros
                            </label>
                            <button type="button" @click="addAchievement"
                                class="text-sm text-blue-600 hover:text-blue-700">
                                + Añadir Logro
                            </button>
                        </div>
                        <div v-for="(achievement, index) in taskForm.achievements" :key="index"
                            class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Logro {{ index + 1 }}
                                </h4>
                                <button type="button" @click="removeAchievement(index)"
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
                                    <input v-model="achievement.title" type="text" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Descripción</label>
                                    <input v-model="achievement.description" type="text" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Requisito</label>
                                    <input v-model.number="achievement.requirement" type="number" required min="1"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600 dark:text-gray-400">Recompensa XP</label>
                                    <input v-model.number="achievement.xp_reward" type="number" required min="0"
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
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de gestión de categorías -->
        <div v-if="showCategoryManager"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div class="p-4 border-b dark:border-gray-700">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gestionar Categorías</h3>
                        <button @click="showCategoryManager = false"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <CategoryManager />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '../../stores/task.store';
import { useCategoryStore } from '../../stores/category.store';
import CategoryManager from '../../components/CategoryManager.vue';
import type { CreateTaskDTO } from '../../types/task';

const router = useRouter();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const showCategoryManager = ref(false);

const taskForm = ref<CreateTaskDTO>({
    title: '',
    description: '',
    category_id: 0,
    state: 'draft',
    achievements: []
});

const achievement = ref<{
    id?: number;
    title: string;
    description: string | null;
    requirement: number;
    xp_reward: number;
}>({
    title: '',
    description: '',
    requirement: 1,
    xp_reward: 50 // Valor por defecto de 50 XP
});

onMounted(async () => {
    await categoryStore.fetchCategories();
});

function addAchievement() {
    taskForm.value.achievements.push({
        title: '',
        description: '',
        requirement: 1,
        xp_reward: 50  // Valor por defecto de 50 XP
    });
}

function removeAchievement(index: number) {
    taskForm.value.achievements.splice(index, 1);
}

async function handleSubmit() {
    try {
        console.log('>>> [CreateTaskView] taskForm antes de crear la tarea:', JSON.parse(JSON.stringify(taskForm.value)));
        await taskStore.createTask(taskForm.value);
        router.push('/admin');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
    }
}
</script>