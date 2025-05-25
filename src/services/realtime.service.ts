import { supabase } from './supabase';
import { useTaskStore } from '../stores/task.store';
import { useMissionStore } from '../stores/mission.store';
import { useUserMissionStore } from '../stores/userMission.store';
import { useGamificationStore } from '../stores/gamification.store';
import type { Task } from '../types/task';
import type { Mission } from '../types/mission';

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

        switch (eventType) {
            case 'INSERT':
                this.taskStore.addTask(newRecord as Task);
                break;
            case 'UPDATE':
                this.taskStore.updateTask(newRecord as Task);
                break;
            case 'DELETE':
                this.taskStore.removeTask(oldRecord.id);
                break;
        }
    }

    private handleMissionChange(payload: any) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        switch (eventType) {
            case 'INSERT':
                this.missionStore.addMission(newRecord as Mission);
                break;
            case 'UPDATE':
                this.missionStore.updateMissionRealtime(newRecord as Mission);
                break;
            case 'DELETE':
                this.missionStore.removeMission(oldRecord.id);
                break;
        }
    }

    private handleUserMissionChange(payload: any) {
        const { eventType, new: newRecord } = payload;

        if (eventType === 'INSERT' || eventType === 'UPDATE') {
            this.userMissionStore.updateUserMission(newRecord);
        }
    }

    private handleAchievementChange(payload: any) {
        const { eventType, new: newRecord } = payload;

        if (eventType === 'INSERT' || eventType === 'UPDATE') {
            this.gamificationStore.updateAchievement(newRecord);
        }
    }

    // Método para limpiar las suscripciones
    public cleanup() {
        supabase.removeAllChannels();
    }
} 