export interface Achievement {
    id: number;
    title: string;
    description: string;
    requirement: number;
    xp_reward: number;
    badge_url: string;
    created_at: string;
    updated_at: string;
}

export interface UserAchievement {
    id: number;
    user_id: string;
    achievement_id: number;
    achieved_at: string;
    created_at: string;
    updated_at: string;
    achievement?: Achievement;
} 