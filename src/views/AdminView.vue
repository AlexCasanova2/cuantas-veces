<template>
  <div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900 ">
    <div class="max-w-7xl h-full p-6 mx-auto">
      <!-- Header con estadísticas -->
      <div class="w-full mb-8">
        <div class="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">Gestiona tus tareas y misiones</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button @click="showCreateTaskModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Nueva Tarea
              </button>
              <button @click="showCreateMissionModal = true"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                + Nueva Misión
              </button>
              <button @click="showCategoryManager = true"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Gestionar Categorías
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tareas</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ taskStore.tasks.length }}</p>
              </div>
              <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Misiones</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ missionStore.missions.length }}</p>
              </div>
              <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 dark:text-green-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Categorías</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ categoryStore.categories.length }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tablas de tareas y misiones -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-1 gap-6">
        <!-- Tabla de Tareas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Tareas</h2>
            </div>
          </div>

          <!-- Pestañas -->
          <div class="border-b dark:border-gray-700">
            <nav class="flex -mb-px">
              <button @click="taskFilter = 'all'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                taskFilter === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Todas
              </button>
              <button @click="taskFilter = 'draft'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                taskFilter === 'draft'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Borradores
              </button>
              <button @click="taskFilter = 'published'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                taskFilter === 'published'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Publicadas
              </button>
              <button @click="taskFilter = 'deleted'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                taskFilter === 'deleted'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Eliminadas
              </button>
            </nav>
          </div>

          <!-- Tabla -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tarea
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="task in filteredTasks" :key="task.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ task.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ task.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full" :style="{
                      backgroundColor: `${getCategoryColor(task.category_id)}20`,
                      color: getCategoryColor(task.category_id)
                    }">
                      {{ getCategoryName(task.category_id) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStateBadgeClass(task.state)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getStateText(task.state) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editTask(task)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Editar
                    </button>
                    <button v-if="task.state !== 'deleted'" @click="deleteTask(task.id!)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Eliminar
                    </button>
                    <button v-else @click="restoreTask(task.id!)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      Restaurar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla de Misiones -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Misiones</h2>
            </div>
          </div>

          <!-- Pestañas -->
          <div class="border-b dark:border-gray-700">
            <nav class="flex -mb-px">
              <button @click="missionFilter = 'all'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                missionFilter === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Todas
              </button>
              <button @click="missionFilter = 'draft'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                missionFilter === 'draft'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Borradores
              </button>
              <button @click="missionFilter = 'published'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                missionFilter === 'published'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Publicadas
              </button>
              <button @click="missionFilter = 'deleted'" :class="[
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                missionFilter === 'deleted'
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]">
                Eliminadas
              </button>
            </nav>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Título
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    XP
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="mission in filteredMissions" :key="mission.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ mission.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ mission.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStateBadgeClass(mission.state)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getStateText(mission.state) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {{ mission.xp_reward }} XP
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="editMission(mission)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                      Editar
                    </button>
                    <button @click="deleteMission(mission.id!)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Crear/Editar Tarea -->
    <div v-if="showCreateTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}
            </h3>
            <button @click="closeTaskModal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título
              </label>
              <input v-model="taskForm.title" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción
              </label>
              <textarea v-model="taskForm.description" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Categoría
              </label>
              <div class="flex gap-2">
                <select v-model="taskForm.category_id"
                  class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required>
                  <option value="">Selecciona una categoría</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id"
                    :style="{ color: category.color }">
                    {{ category.name }}
                  </option>
                </select>
                <button type="button" @click="showCategoryManager = true"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado
              </label>
              <select v-model="taskForm.state"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="deleted">Eliminado</option>
              </select>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Logros
                </label>
                <button type="button" @click="addAchievement" class="text-sm text-blue-600 hover:text-blue-700">
                  + Añadir Logro
                </button>
              </div>
              <div v-for="(achievement, index) in taskForm.achievements" :key="index"
                class="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Logro {{ index + 1 }}</h4>
                  <button type="button" @click="removeAchievement(index)" class="text-red-600 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400">Título</label>
                    <input v-model="achievement.title" type="text" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400">Descripción</label>
                    <input v-model="achievement.description" type="text" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400">Requisito</label>
                    <input v-model.number="achievement.requirement" type="number" required min="1"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeTaskModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                {{ editingTask ? 'Guardar Cambios' : 'Crear Tarea' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Crear/Editar Misión -->
    <div v-if="showCreateMissionModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingMission ? 'Editar Misión' : 'Crear Nueva Misión' }}
          </h3>
          <form @submit.prevent="handleMissionSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Título</label>
              <input v-model="missionForm.title" type="text" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model="missionForm.description" rows="3" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <select v-model="missionForm.state"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Recompensa XP</label>
              <input v-model.number="missionForm.xp_reward" type="number" required min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>

            <!-- Requisitos de Logros -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">
                  Requisitos de Logros
                </label>
                <button type="button" @click="addAchievementRequirement"
                  class="text-sm text-blue-600 hover:text-blue-700">
                  + Añadir Logro
                </button>
              </div>

              <div v-for="(req, index) in missionForm.achievement_requirements" :key="index"
                class="mb-4 p-4 border rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="text-sm font-medium text-gray-700">Logro {{ index + 1 }}</h4>
                  <button type="button" @click="removeAchievementRequirement(index)"
                    class="text-red-600 hover:text-red-700">
                    Eliminar
                  </button>
                </div>

                <div class="space-y-3">
                  <div>
                    <label class="block text-xs text-gray-600">Tarea</label>
                    <select v-model="req.taskId" required @change="handleTaskChange(index)"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Selecciona una tarea</option>
                      <option v-for="task in tasks" :key="task.id" :value="task.id">
                        {{ task.title }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs text-gray-600">Logro</label>
                    <select v-model="req.achievementId" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Selecciona un logro</option>
                      <option v-for="achievement in getTaskAchievements(req.taskId)" :key="achievement.id"
                        :value="achievement.id">
                        {{ achievement.title }} ({{ achievement.requirement }} veces)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeMissionModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                Cancelar
              </button>
              <button type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                {{ editingMission ? 'Guardar Cambios' : 'Crear Misión' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Gestión de Categorías -->
    <div v-if="showCategoryManager" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gestionar Categorías</h3>
            <button @click="showCategoryManager = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4">
          <CategoryManager />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useTaskStore } from '../stores/task.store';
import { useMissionStore } from '../stores/mission.store';
import { useCategoryStore } from '../stores/category.store';
import CategoryManager from '../components/CategoryManager.vue';
import type { Task, CreateTaskDTO } from '../types/task';
import type { Mission, CreateMissionDTO, MissionRequirement } from '../types/mission';
import type { Category } from '../types/category';

const authStore = useAuthStore();
const taskStore = useTaskStore();
const missionStore = useMissionStore();
const categoryStore = useCategoryStore();

const showCreateTaskModal = ref(false);
const showCreateMissionModal = ref(false);
const showCategoryManager = ref(false);

const editingTask = ref<Task | null>(null);
const editingMission = ref<Mission | null>(null);

const taskFilter = ref('all');
const missionFilter = ref('all');

const taskForm = ref<CreateTaskDTO>({
  title: '',
  description: '',
  category_id: 0,
  state: 'draft',
  achievements: []
});

const missionForm = ref<CreateMissionDTO>({
  title: '',
  description: '',
  state: 'draft',
  requirement: [],
  achievement_requirements: [],
  xp_reward: 0
});

const tasks = ref<Task[]>([]);

onMounted(async () => {
  await authStore.checkUser();
  await Promise.all([
    taskStore.fetchTasks(),
    missionStore.fetchMissions(),
    categoryStore.fetchCategories()
  ]);
  tasks.value = taskStore.tasks;
});

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return taskStore.tasks;
  return taskStore.tasks.filter((task: Task) => task.state === taskFilter.value);
});

const filteredMissions = computed(() => {
  if (missionFilter.value === 'all') return missionStore.missions;
  return missionStore.missions.filter((mission: Mission) => mission.state === missionFilter.value);
});

function getStateBadgeClass(state: string) {
  switch (state) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'deleted':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

function getStateText(state: string) {
  switch (state) {
    case 'draft':
      return 'Borrador';
    case 'published':
      return 'Publicado';
    case 'deleted':
      return 'Eliminado';
    default:
      return state;
  }
}

function addAchievement() {
  taskForm.value.achievements.push({
    title: '',
    description: '',
    requirement: 1
  });
}

function removeAchievement(index: number) {
  taskForm.value.achievements.splice(index, 1);
}

function addAchievementRequirement() {
  missionForm.value.achievement_requirements.push({
    taskId: 0,
    achievementId: 0
  });
}

function removeAchievementRequirement(index: number) {
  missionForm.value.achievement_requirements.splice(index, 1);
}

function handleTaskChange(index: number) {
  missionForm.value.achievement_requirements[index].achievementId = 0;
}

function getTaskAchievements(taskId: number) {
  const task = tasks.value.find(t => t.id === taskId);
  return task?.achievements || [];
}

function closeTaskModal() {
  showCreateTaskModal.value = false;
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    category_id: 0,
    state: 'draft',
    achievements: []
  };
}

function closeMissionModal() {
  showCreateMissionModal.value = false;
  editingMission.value = null;
  missionForm.value = {
    title: '',
    description: '',
    state: 'draft',
    requirement: [],
    achievement_requirements: [],
    xp_reward: 0
  };
}

async function handleSubmit() {
  try {
    if (editingTask.value) {
      // Simplificamos la actualización para que coincida con el backend
      const taskToUpdate = {
        title: taskForm.value.title,
        description: taskForm.value.description,
        category_id: taskForm.value.category_id,
        state: taskForm.value.state,
        achievements: taskForm.value.achievements.map(achievement => ({
          title: achievement.title,
          description: achievement.description || '',
          requirement: achievement.requirement
        }))
      };

      await taskStore.updateTask(editingTask.value.id, taskToUpdate);
      await taskStore.fetchTasks();
    } else {
      await taskStore.createTask(taskForm.value);
    }
    closeTaskModal();
  } catch (error) {
    console.error('Error al guardar la tarea:', error);
  }
}

async function handleMissionSubmit() {
  try {
    if (missionForm.value.achievement_requirements.some(req => !req.taskId || !req.achievementId)) {
      alert('Por favor, selecciona una tarea y un logro para cada requisito');
      return;
    }

    if (editingMission.value) {
      await missionStore.updateMission(editingMission.value.id!, missionForm.value);
    } else {
      await missionStore.createMission(missionForm.value);
    }
    closeMissionModal();
  } catch (error) {
    console.error('Error al guardar la misión:', error);
  }
}

function editTask(task: Task) {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description,
    category_id: task.category_id,
    state: task.state,
    achievements: task.achievements ? task.achievements.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      requirement: Number(a.requirement)
    })) : []
  };
  showCreateTaskModal.value = true;
}

function editMission(mission: Mission) {
  editingMission.value = mission;
  missionForm.value = {
    title: mission.title,
    description: mission.description,
    state: mission.state,
    requirement: mission.requirement.map((r: MissionRequirement) => ({
      title: r.title,
      description: r.description,
      requirement: Number(r.requirement)
    })),
    achievement_requirements: mission.achievement_requirements || [],
    xp_reward: mission.xp_reward
  };
  showCreateMissionModal.value = true;
}

async function deleteTask(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    try {
      await taskStore.deleteTask(id);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  }
}

async function deleteMission(id: number) {
  if (confirm('¿Estás seguro de que quieres eliminar esta misión?')) {
    try {
      await missionStore.deleteMission(id);
    } catch (error) {
      console.error('Error al eliminar la misión:', error);
    }
  }
}

async function restoreTask(id: number) {
  if (confirm('¿Estás seguro de que quieres restaurar esta tarea?')) {
    try {
      await taskStore.restoreTask(id);
    } catch (error) {
      console.error('Error al restaurar la tarea:', error);
    }
  }
}

function getCategoryName(categoryId: number): string {
  const category = categoryStore.categories.find((c: Category) => c.id === categoryId);
  return category ? category.name : 'Sin categoría';
}

function getCategoryColor(categoryId: number): string {
  const category = categoryStore.categories.find((c: Category) => c.id === categoryId);
  return category ? category.color : '#6B7280';
}
</script>

<style>
/* Estilos globales para esta vista */
#app {
  max-width: 100% !important;
  width: 100% !important;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
}

.admin-view {
  min-height: 100vh;
  width: 100vw;
  padding: 1.5rem;
  background-image: linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05));
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>