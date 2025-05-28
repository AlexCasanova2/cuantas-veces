<template>
    <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ mission.title }}</h3>
            <span class="text-sm text-indigo-600">+{{ mission.xp_reward }} XP</span>
        </div>

        <p class="text-sm text-gray-600 mb-4">{{ mission.description }}</p>

        <!-- Requisitos -->
        <div class="space-y-2 mb-4">
            <div v-for="(value, key) in mission.requirement" :key="key" class="flex items-center">
                <div class="flex-1">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 capitalize">{{ key }}</span>
                        <span class="text-gray-600">
                            {{ userMissionState?.progress?.[key] || 0 }}/{{ value }}
                        </span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            :style="{ width: `${((Number(userMissionState?.progress?.[key]) || 0) / Number(value)) * 100}%` }"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón de acción -->
        <div class="flex justify-end">
            <button v-if="!userMissionState" @click="$emit('accept-mission', mission.id)"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Aceptar Misión
            </button>
            <span v-else class="px-4 py-2 bg-green-100 text-green-800 rounded-md">
                {{ userMissionState.state === 'completed' ? 'Completada' : 'En progreso' }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Mission } from '../types/mission';
import type { UserMission } from '../services/userMission.service';

defineProps<{
    mission: Mission;
    userMissionState?: UserMission;
}>();

defineEmits<{
    (e: 'accept-mission', missionId: number): void;
}>();

defineOptions({
    name: 'MissionCard'
});
</script>
