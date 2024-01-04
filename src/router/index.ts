import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { LoginCallback, navigationGuard } from '@okta/okta-vue'
import Login from '@/views/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/login',
      component: Login
    },
    {
      path: '/login/callback',
      component: LoginCallback
    },

  ]
})

router.beforeEach(navigationGuard)

export default router
