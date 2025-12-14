import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LearnView from '@/views/LearnView.vue'
import RankView from '@/views/RankView.vue'
import GameView from '@/views/GameView.vue'
import WrongWordsView from '@/views/WrongWordsView.vue'
import AdminLogin from '@/views/Admin/AdminLogin.vue'
import AdminDashboard from '@/views/Admin/AdminDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/learn', name: 'Learn', component: LearnView },
  { path: '/rank', name: 'Rank', component: RankView },
  { path: '/game', name: 'Game', component: GameView },
  { path: '/wrong-words', name: 'WrongWords', component: WrongWordsView },
  { path: '/admin', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 简单的权限守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('adminToken')) {
    next('/admin')
  } else {
    next()
  }
})

export default router
