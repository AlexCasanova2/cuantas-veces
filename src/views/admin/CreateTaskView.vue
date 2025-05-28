<template>
    <div class="admin-container">
        <div class="admin-content">
            <div class="admin-card">
                <h1 class="admin-title mb-6">Crear Nueva Tarea</h1>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Título -->
                    <div>
                        <label for="title"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                        <input type="text" id="title" v-model="taskForm.title" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <!-- Descripción -->
                    <div>
                        <label for="description"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                        <textarea id="description" v-model="taskForm.description" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                    </div>

                    <!-- Categoría -->
                    <div>
                        <label for="category"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                        <select id="category" v-model="taskForm.category_id" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">Selecciona una categoría</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Estado -->
                    <div>
                        <label for="state"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                        <select id="state" v-model="taskForm.state" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                        </select>
                    </div>

                    <!-- Logros -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Logros</h2>
                            <button type="button" @click="addAchievement" class="admin-button-primary">
                                Añadir Logro
                            </button>
                        </div>

                        <div v-for="(achievement, index) in taskForm.achievements" :key="index"
                            class="mb-4 p-4 border rounded-lg dark:border-gray-600">
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-md font-medium text-gray-900 dark:text-white">Logro {{ index + 1 }}</h3>
                                <button type="button" @click="removeAchievement(index)" class="admin-button-delete">
                                    Eliminar
                                </button>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label :for="'achievement-title-' + index"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                                    <input :id="'achievement-title-' + index" v-model="achievement.title" required
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>

                                <div>
                                    <label :for="'achievement-description-' + index"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                                    <textarea :id="'achievement-description-' + index" v-model="achievement.description"
                                        rows="2"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label :for="'achievement-requirement-' + index"
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">Requisito</label>
                                        <input :id="'achievement-requirement-' + index" type="number"
                                            v-model="achievement.requirement" required min="1"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>

                                    <div>
                                        <label :for="'achievement-xp-' + index"
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-300">XP</label>
                                        <input :id="'achievement-xp-' + index" type="number"
                                            v-model="achievement.xp_reward" required min="0"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex justify-end space-x-4">
                        <button type="button" @click="router.push('/admin')"
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" class="admin-button-primary">
                            Crear Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/task.store';
import { useCategoryStore } from '@/stores/category.store';
import type { CreateTaskDTO } from '@/types/task';
import type { Category } from '@/types/category';
import '@/assets/styles/admin.css';

const router = useRouter();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();

const taskForm = ref<CreateTaskDTO>({
    title: '',
    description: '',
    category_id: 0,
    state: 'draft',
    achievements: []
});

const categories = ref<Category[]>([]);

onMounted(async () => {
    try {
        await categoryStore.fetchCategories();
        categories.value = categoryStore.categories;
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
});

function addAchievement() {
    taskForm.value.achievements?.push({
        title: '',
        description: '',
        requirement: 1,
        xp_reward: 0
    });
}

function removeAchievement(index: number) {
    taskForm.value.achievements?.splice(index, 1);
}

async function handleSubmit() {
    try {
        console.log('Creando nueva tarea:', taskForm.value);
        await taskStore.createTask(taskForm.value);
        console.log('Tarea creada exitosamente');
        router.push('/admin');
    } catch (error) {
        console.error('Error al crear la tarea:', error);
    }
}
</script>