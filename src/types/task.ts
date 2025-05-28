import type { Category } from './category';

export interface Task {
    id: number;
    title: string;
    description: string | null;
    category_id: number;
    state: 'draft' | 'published' | 'deleted';
    created_at: string;
    updated_at: string;
    achievements?: Achievement[];
}

export interface Achievement {
    id: number;
    task_id: number;
    title: string;
    description: string | null;
    requirement: number;
    xp_reward: number;
    created_at: string;
    updated_at: string;
}

// Tipo para una entrada en la nueva tabla user_achievements
export interface UserAchievement {
    id: number; // Primary key de la tabla user_achievements
    user_id: string;
    achievement_id: number;
    achieved_at: string; // Timestamp de cuando se consiguió
    created_at: string;
    updated_at: string;
}

// Nuevo tipo para el progreso del usuario en una tarea específica
export interface UserTaskProgress {
    id: number; // Primary key de la tabla user_task_progress
    user_id: string;
    task_id: number;
    count: number;
    progress: number;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskDTO {
    title: string;
    description: string | null;
    category_id: number;
    state: 'draft' | 'published' | 'deleted';
    achievements: {
        title: string;
        description: string | null;
        requirement: number;
        xp_reward: number;
    }[];
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string | null;
    category_id?: number;
    state?: 'draft' | 'published' | 'deleted';
    achievements?: {
        id?: number;
        title: string;
        description: string | null;
        requirement: number;
        xp_reward: number;
    }[];
}

export interface UpdateUserTaskProgressDTO {
    task_id: number;
    count: number;
}

// Tipo combinado para mostrar en la UI (tarea global + progreso del usuario + logros conseguidos)
export interface TaskWithProgress extends Task {
    progress: number;
    count: number;
    completedAchievementIds: number[];
    category?: Category;
} 