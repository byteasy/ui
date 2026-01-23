import { createRouter, createWebHistory } from 'vue-router'

const routers = [
  {
    path: '/',
    name: 'Home',
    redirect: '/frame'
  },
  {
    // history模式需要通配所有路由，详见vue-router文档
    path: '/frame/:pathMatch(.*)*',
    name: 'system',
    component: () => import('../views/layout/SubAppContainer.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
