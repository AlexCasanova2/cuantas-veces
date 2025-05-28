export interface MissionRequirement {
  title: string;
  description: string;
  requirement: number;
}

export interface AchievementRequirement {
  taskId: number;
  achievementId: number;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  state: 'draft' | 'published' | 'deleted';
  requirement: MissionRequirement[];
  achievement_requirements: AchievementRequirement[];
  xp_reward: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMissionDTO {
  title: string;
  description: string;
  state: 'draft' | 'published' | 'deleted';
  requirement: MissionRequirement[];
  achievement_requirements: AchievementRequirement[];
  xp_reward: number;
}

export interface UpdateMissionDTO {
  title?: string;
  description?: string;
  state?: 'draft' | 'published' | 'deleted';
  requirement?: MissionRequirement[];
  achievement_requirements?: AchievementRequirement[];
  xp_reward?: number;
}

export interface UserMission {
  id: number;
  user_id: string;
  mission_id: number;
  progress: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
} 