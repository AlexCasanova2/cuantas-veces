<template>
    <div class="admin-container">
        <div class="admin-content">
            <div class="admin-card">
                <div class="admin-header">
                    <div>
                        <h1 class="admin-title">Panel de Administración</h1>
                        <p class="admin-subtitle">Gestiona tus tareas y misiones</p>
                    </div>
                    <div class="admin-button-group">
                        <button @click="router.push('/admin/tasks/create')" class="admin-button-primary">
                            Crear Tarea
                        </button>
                        <button @click="router.push('/admin/missions/create')" class="admin-button-success">
                            Crear Misión
                        </button>
                    </div>
                </div>

                <!-- Lista de Tareas -->
                <div class="admin-list">
                    <h2 class="admin-list-title">Tareas</h2>
                    <div class="admin-list-items">
                        <div v-for="task in tasks" :key="task.id" class="admin-list-item">
                            <div class="admin-list-item-content">
                                <h3 class="admin-list-item-title">{{ task.title }}</h3>
                                <p class="admin-list-item-description">{{ task.description }}</p>
                                <div class="admin-list-item-meta">
                                    <span class="admin-badge-category"
                                        :style="{ backgroundColor: task.category?.color + '20', color: task.category?.color }">
                                        {{ task.category?.name }}
                                    </span>
                                    <span class="admin-badge-state">
                                        {{ task.state }}
                                    </span>
                                </div>
                            </div>
                            <div class="admin-item-actions">
                                <button @click="router.push(`/admin/tasks/${task.id}/edit`)" class="admin-button-edit">
                                    Editar
                                </button>
                                <button @click="deleteTask(task.id)" class="admin-button-delete">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lista de Misiones -->
                <div class="admin-list">
                    <h2 class="admin-list-title">Misiones</h2>
                    <div class="admin-list-items">
                        <div v-for="mission in missions" :key="mission.id" class="admin-list-item">
                            <div class="admin-list-item-content">
                                <h3 class="admin-list-item-title">{{ mission.title }}</h3>
                                <p class="admin-list-item-description">{{ mission.description }}</p>
                                <div class="admin-list-item-meta">
                                    <span class="admin-badge-state">
                                        {{ mission.state }}
                                    </span>
                                </div>
                            </div>
                            <div class="admin-item-actions">
                                <button @click="router.push(`/admin/missions/${mission.id}/edit`)"
                                    class="admin-button-edit">
                                    Editar
                                </button>
                                <button @click="deleteMission(mission.id)" class="admin-button-delete">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/task.store';
import type { Task, Achievement } from '@/types/task';
import '@/assets/styles/admin.css';

const router = useRouter();
const taskStore = useTaskStore();

const achievements = ref<Achievement[]>([]);
const missions = ref([]);
const tasks = ref<Task[]>([]);

onMounted(async () => {
    await taskStore.fetchTasks();
    tasks.value = taskStore.tasks;
});

async function deleteTask(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        try {
            await taskStore.deleteTask(id);
            tasks.value = tasks.value.filter(task => task.id !== id);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    }
}

async function deleteMission(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta misión?')) {
        try {
            // Implementar la eliminación de misiones
            console.log('Eliminar misión:', id);
        } catch (error) {
            console.error('Error al eliminar la misión:', error);
        }
    }
}
</script>