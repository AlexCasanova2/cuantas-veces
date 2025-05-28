import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, CreateTaskDTO, UpdateTaskDTO, UpdateUserTaskProgressDTO, TaskWithProgress, UserTaskProgress, UserAchievement, Achievement } from '../types/task';
import * as taskService from '../services/task.service';
import { useAuthStore } from './auth.store';
import { useUserStore } from './user.store';
import { supabase } from '../services/supabase';

export const useTaskStore = defineStore('task', () => {
    const tasks = ref<TaskWithProgress[]>([]);
    const userAchievements = ref<UserAchievement[]>([]);
    const categories = ref<string[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Getters
    const recentTasks = computed<TaskWithProgress[]>(() => {
        return tasks.value
            .slice()
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    });

    const tasksList = computed<TaskWithProgress[]>(() => tasks.value);

    // Actions
    async function getTask(id: number): Promise<Task | null> {
        try {
            const { data, error: fetchError } = await supabase
                .from('tasks')
                .select(`
                    *,
                    achievements (*),
                    category:categories (
                        id,
                        name,
                        color
                    )
                `)
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;
            return data as Task;
        } catch (error) {
            console.error('Error al obtener la tarea:', error);
            return null;
        }
    }

    async function fetchTasks() {
        isLoading.value = true;
        error.value = null;
        const authStore = useAuthStore();
        const userId = authStore.user?.id;

        if (!userId) {
            try {
                const globalTasks = await taskService.fetchTasks();
                tasks.value = globalTasks.map(task => ({ ...task, count: 0, progress: 0, completedAchievementIds: [] }));
            } catch (e) {
                error.value = e instanceof Error ? e.message : 'Error desconocido';
                console.error('Error al cargar tareas globales:', e);
            } finally {
                isLoading.value = false;
            }
            return;
        }

        try {
            const globalTasks = await taskService.fetchTasks();
            const taskIds = globalTasks.map(task => task.id);

            const userProgress = await taskService.fetchUserTaskProgress(userId, taskIds);
            const userProgressMap = userProgress.reduce((acc, progress) => {
                acc[progress.task_id] = progress;
                return acc;
            }, {} as Record<number, UserTaskProgress>);

            const achievedAchievements = await taskService.fetchUserAchievements(userId);
            userAchievements.value = achievedAchievements;
            const achievedAchievementIds = achievedAchievements.map(ua => ua.achievement_id);

            tasks.value = globalTasks.map(task => ({
                ...task,
                count: userProgressMap[task.id]?.count || 0,
                progress: userProgressMap[task.id]?.progress || 0,
                completedAchievementIds: task.achievements
                                         ?.filter(ach => achievedAchievementIds.includes(ach.id))
                                         .map(ach => ach.id) || [],
            }));

        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error al cargar tareas, progreso y logros conseguidos:', e);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchUserTaskProgress(userId: string) {
        isLoading.value = true;
        error.value = null;
        try {
            const taskIds = tasks.value.map(task => task.id);
            const userProgress = await taskService.fetchUserTaskProgress(userId, taskIds);
            const userProgressMap = userProgress.reduce((acc, progress) => {
                acc[progress.task_id] = progress;
                return acc;
            }, {} as Record<number, UserTaskProgress>);

            tasks.value = tasks.value.map(task => ({
                ...task,
                count: userProgressMap[task.id]?.count || 0,
                progress: userProgressMap[task.id]?.progress || 0,
            }));
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error al cargar el progreso de las tareas:', e);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchCategories() {
        isLoading.value = true;
        error.value = null;
        try {
            const { data, error: fetchError } = await supabase
                .from('categories')
                .select('name');
            
            if (fetchError) throw fetchError;
            categories.value = data.map((c: { name: string }) => c.name);
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error al cargar las categorías:', e);
        } finally {
            isLoading.value = false;
        }
    }

    async function createTask(task: CreateTaskDTO) {
        console.log('TaskStore: Iniciando creación de tarea');
        try {
            const newTask = await taskService.createTask(task);
            console.log('TaskStore: Tarea creada exitosamente:', newTask);
            tasks.value.unshift(newTask);
            return newTask;
        } catch (error) {
            console.error('TaskStore: Error al crear la tarea:', error);
            throw error;
        }
    }

    async function updateTask(id: number, taskData: UpdateTaskDTO) {
        try {
            const updatedTask = await taskService.updateTask(id, taskData);
            const index = tasks.value.findIndex(t => t.id === id);
            
            if (index !== -1) {
                const currentTask = tasks.value[index];
                const taskWithProgress: TaskWithProgress = {
                    ...updatedTask,
                    count: currentTask.count,
                    progress: currentTask.progress,
                    completedAchievementIds: currentTask.completedAchievementIds
                };
                
                tasks.value = tasks.value.map(task => 
                    task.id === id ? taskWithProgress : task
                );
            } else {
                await fetchTasks();
            }
            
            return updatedTask;
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            throw error;
        }
    }

    async function updateTaskCount(updateData: UpdateUserTaskProgressDTO) {
        isLoading.value = true;
        error.value = null;
        const authStore = useAuthStore();
        const userStore = useUserStore();
        const userId = authStore.user?.id;

        if (!userId) {
            error.value = 'Usuario no autenticado.';
            isLoading.value = false;
            throw new Error('Usuario no autenticado.');
        }

        try {
            const updatedProgress = await taskService.updateUserTaskProgress(updateData, userId);
            const task = tasks.value.find(t => t.id === updateData.task_id);
            
            if (task) {
                task.count = updatedProgress.count;
                task.progress = updatedProgress.progress;
            }
            
            return updatedProgress;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteTask(id: number) {
        try {
            await taskService.deleteTask(id);
            tasks.value = tasks.value.filter(task => task.id !== id);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            throw error;
        }
    }

    async function restoreTask(id: number) {
        try {
            const restoredTask = await taskService.restoreTask(id);
            const taskWithProgress: TaskWithProgress = {
                ...restoredTask,
                count: 0,
                progress: 0,
                completedAchievementIds: []
            };
            tasks.value.push(taskWithProgress);
            return taskWithProgress;
        } catch (error) {
            console.error('Error al restaurar la tarea:', error);
            throw error;
        }
    }

    async function addAchievementToTask(taskId: number, achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) {
        try {
            const newAchievement = await taskService.addAchievementToTask(taskId, achievement);
            // Actualizar en el store si es necesario
            return newAchievement;
        } catch (error) {
            console.error('Error al añadir logro:', error);
            throw error;
        }
    }

    async function updateAchievement(achievementId: number, achievement: Partial<Achievement>) {
        try {
            const updatedAchievement = await taskService.updateAchievement(achievementId, achievement);
            // Actualizar en el store si es necesario
            return updatedAchievement;
        } catch (error) {
            console.error('Error al actualizar logro:', error);
            throw error;
        }
    }

    async function deleteAchievement(achievementId: number) {
        try {
            await taskService.deleteAchievement(achievementId);
            // Actualizar en el store si es necesario
        } catch (error) {
            console.error('Error al eliminar logro:', error);
            throw error;
        }
    }

    return {
        tasks,
        userAchievements,
        categories,
        isLoading,
        error,
        recentTasks,
        tasksList,
        getTask,
        fetchTasks,
        fetchUserTaskProgress,
        fetchCategories,
        createTask,
        updateTask,
        updateTaskCount,
        deleteTask,
        restoreTask,
        addAchievementToTask,
        updateAchievement,
        deleteAchievement
    };
}); 