import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/app/router/routes.ts'
import { isAuthenticated } from '@/app/router/guard.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(isAuthenticated)

export default router
