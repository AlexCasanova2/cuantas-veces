import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import TaskDetailView from '../views/TaskDetailView.vue'
import ProfileView from '../views/ProfileView.vue'
import AchievementsView from '../views/AchievementsView.vue'
import GamificationView from '../views/GamificationView.vue'
import TasksView from '../views/TasksView.vue'
import { useUserStore } from '../stores/user.store'
import { useAuthStore } from '../stores/auth.store'
import CreateTaskView from '../views/admin/CreateTaskView.vue'
import EditTaskView from '../views/admin/EditTaskView.vue'
import CreateMissionView from '../views/admin/CreateMissionView.vue'
import EditMissionView from '../views/admin/EditMissionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/task/:id',
      name: 'task-detail',
      component: TaskDetailView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: AchievementsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/gamification',
      name: 'gamification',
      component: GamificationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/tasks/create',
      name: 'create-task',
      component: () => import('../views/admin/CreateTaskView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/tasks/:id/edit',
      name: 'edit-task',
      component: EditTaskView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/missions/create',
      name: 'create-mission',
      component: CreateMissionView
    },
    {
      path: '/admin/missions/:id/edit',
      name: 'edit-mission',
      component: EditMissionView,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  await authStore.checkUser();

  if (to.meta.requiresAuth && !userStore.user) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && userStore.user) {
    next({ name: 'home' });
  } else if (to.meta.requiresAdmin && !authStore.canAccessAdmin) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router
