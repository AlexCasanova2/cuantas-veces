import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task, CreateTaskDTO, UpdateUserTaskProgressDTO, TaskWithProgress, UserTaskProgress, UserAchievement } from '../types/task';
import * as taskService from '../services/task.service';
import { useAuthStore } from './auth.store';

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
            .sort((a: TaskWithProgress, b: TaskWithProgress) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5);
    });

    const tasksList = computed<TaskWithProgress[]>(() => tasks.value);

    // Actions
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

    async function fetchCategories() {
        isLoading.value = true;
        error.value = null;
        try {
            categories.value = await taskService.getAllCategories();
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error al cargar las categorías:', e);
        } finally {
            isLoading.value = false;
        }
    }

    async function createTask(task: CreateTaskDTO) {
        try {
            const newTask = await taskService.createTask(task);
            tasks.value.unshift(newTask);
            return newTask;
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            throw error;
        }
    }

    async function updateTask(id: number, taskData: Partial<Task>) {
        try {
            const updatedTask = await taskService.updateTask(id, taskData);
            
            // Actualizamos la tarea en el store
            const index = tasks.value.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks.value[index] = {
                    ...tasks.value[index],
                    ...updatedTask
                };
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
        const userId = authStore.user?.id;

        if (!userId) {
            error.value = 'Usuario no autenticado.';
            isLoading.value = false;
            throw new Error('Usuario no autenticado.');
        }

        try {
            const updatedProgress = await taskService.updateUserTaskProgress(updateData, userId);

            const task = tasks.value.find(t => t.id === updateData.task_id);
            const newlyAchievedIds: number[] = [];

            if (task && task.achievements) {
                const userCompletedAchievementIdsForTask = userAchievements.value
                    .filter(ua => ua.user_id === userId && task.achievements?.some(ach => ach.id === ua.achievement_id))
                    .map(ua => ua.achievement_id);

                task.achievements.forEach(achievement => {
                    if (!userCompletedAchievementIdsForTask.includes(achievement.id) && updatedProgress.count >= achievement.requirement) {
                        newlyAchievedIds.push(achievement.id);
                    }
                });
            }

            if (newlyAchievedIds.length > 0) {
                for (const achievementId of newlyAchievedIds) {
                    try {
                         await taskService.addUserAchievement(userId, achievementId);
                         userAchievements.value.push({ achievement_id: achievementId, user_id: userId, id: -1, achieved_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
                    } catch (e) {
                        console.error(`Error al añadir logro ${achievementId} para usuario ${userId}:`, e);
                    }
                }
            }

            const index = tasks.value.findIndex((t: TaskWithProgress) => t.id === updateData.task_id);
            if (index !== -1) {
                tasks.value[index].count = updatedProgress.count;
                tasks.value[index].progress = updatedProgress.progress;
                tasks.value[index].completedAchievementIds = userAchievements.value
                                                              ?.filter(ua => ua.user_id === userId && task?.achievements?.some(ach => ach.id === ua.achievement_id))
                                                              .map(ua => ua.achievement_id) || [];
            }
            if (index === -1) { await fetchTasks(); }

            return updatedProgress;
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error en updateTaskCount:', e);
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteTask(id: number) {
        isLoading.value = true;
        error.value = null;
        try {
            await taskService.deleteTask(id);
            tasks.value = tasks.value.filter((t: TaskWithProgress) => t.id !== id);
            userAchievements.value = userAchievements.value.filter(ua => ua.achievement_id !== id);
            const authStore = useAuthStore();
            if (authStore.user?.id) {
               await fetchUserAchievements(authStore.user.id);
            }
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Error desconocido';
            console.error('Error al eliminar la tarea:', e);
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function addAchievementsToTask(taskId: number, achievements: { title: string; requirement: number }[]) {
        try {
            const newAchievements = await taskService.addAchievementsToTask(taskId, achievements);
            
            // Actualizamos la tarea en el store
            const taskIndex = tasks.value.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks.value[taskIndex].achievements = [
                    ...(tasks.value[taskIndex].achievements || []),
                    ...newAchievements
                ];
            }
            
            return newAchievements;
        } catch (error) {
            console.error('Error al añadir logros:', error);
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
        fetchTasks,
        fetchCategories,
        createTask,
        updateTask,
        updateTaskCount,
        deleteTask,
        addAchievementsToTask,
    };
}); 