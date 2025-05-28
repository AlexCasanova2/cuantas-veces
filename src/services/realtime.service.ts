import { supabase } from './supabase';
import { useTaskStore } from '../stores/task.store';
import { useMissionStore } from '../stores/mission.store';
import { useUserMissionStore } from '../stores/userMission.store';
import { useGamificationStore } from '../stores/gamification.store';
import type { Task, TaskWithProgress } from '../types/task';
import type { Mission } from '../types/mission';
import type { Achievement } from '../types/achievement';

export class RealtimeService {
    private taskStore = useTaskStore();
    private missionStore = useMissionStore();
    private userMissionStore = useUserMissionStore();
    private gamificationStore = useGamificationStore();

    constructor() {
        this.initializeSubscriptions();
    }

    private initializeSubscriptions() {
        // Suscripción a cambios en tareas
        supabase
            .channel('tasks')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks'
            }, (payload) => {
                this.handleTaskChange(payload);
            })
            .subscribe();

        // Suscripción a cambios en misiones
        supabase
            .channel('missions')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'missions'
            }, (payload) => {
                this.handleMissionChange(payload);
            })
            .subscribe();

        // Suscripción a cambios en misiones de usuario
        supabase
            .channel('user_missions')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'user_missions'
            }, (payload) => {
                this.handleUserMissionChange(payload);
            })
            .subscribe();

        // Suscripción a cambios en logros
        supabase
            .channel('achievements')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'achievements'
            }, (payload) => {
                this.handleAchievementChange(payload);
            })
            .subscribe();
    }

    private handleTaskChange(payload: any) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            const taskWithProgress: TaskWithProgress = {
                ...newRecord as Task,
                progress: 0,
                count: 0,
                completedAchievementIds: []
            };
            this.taskStore.tasks.push(taskWithProgress);
        } else if (eventType === 'UPDATE') {
            const index = this.taskStore.tasks.findIndex(t => t.id === newRecord.id);
            if (index !== -1) {
                const taskWithProgress: TaskWithProgress = {
                    ...newRecord as Task,
                    progress: this.taskStore.tasks[index].progress,
                    count: this.taskStore.tasks[index].count,
                    completedAchievementIds: this.taskStore.tasks[index].completedAchievementIds
                };
                this.taskStore.tasks[index] = taskWithProgress;
            }
        } else if (eventType === 'DELETE') {
            const index = this.taskStore.tasks.findIndex(t => t.id === oldRecord.id);
            if (index !== -1) {
                this.taskStore.tasks.splice(index, 1);
            }
        }
    }

    private handleMissionChange(payload: any) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            this.missionStore.missions.push(newRecord as Mission);
        } else if (eventType === 'UPDATE') {
            const index = this.missionStore.missions.findIndex(m => m.id === newRecord.id);
            if (index !== -1) {
                this.missionStore.missions[index] = newRecord as Mission;
            }
        } else if (eventType === 'DELETE') {
            const index = this.missionStore.missions.findIndex(m => m.id === oldRecord.id);
            if (index !== -1) {
                this.missionStore.missions.splice(index, 1);
            }
        }
    }

    private handleUserMissionChange(payload: any) {
        const { eventType, new: newRecord } = payload;

        if (eventType === 'INSERT' || eventType === 'UPDATE') {
            this.userMissionStore.updateUserMission(newRecord);
        }
    }

    private handleAchievementChange(payload: any) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            const achievement = {
                ...newRecord,
                task_id: newRecord.task_id || 0,
                unlocked_at: newRecord.unlocked_at || new Date().toISOString()
            };
            this.gamificationStore.userAchievements.push(achievement);
        } else if (eventType === 'UPDATE') {
            const index = this.gamificationStore.userAchievements.findIndex(a => a.id === newRecord.id);
            if (index !== -1) {
                const achievement = {
                    ...newRecord,
                    task_id: newRecord.task_id || 0,
                    unlocked_at: newRecord.unlocked_at || new Date().toISOString()
                };
                this.gamificationStore.userAchievements[index] = achievement;
            }
        } else if (eventType === 'DELETE') {
            const index = this.gamificationStore.userAchievements.findIndex(a => a.id === oldRecord.id);
            if (index !== -1) {
                this.gamificationStore.userAchievements.splice(index, 1);
            }
        }
    }

    // Método para limpiar las suscripciones
    public cleanup() {
        supabase.removeAllChannels();
    }
} 