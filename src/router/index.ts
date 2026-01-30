import { createRouter, createWebHistory } from 'vue-router'

const routers = [
  {
    path: '/',
    name: 'Home',
    redirect: '/app/system'
  },
  {
    path: '/frame',
    component: () => import('../views/layout/WebLayout.vue'),
    children: [
      {
        path: 'appearanceSettings',
        name: 'AppearanceSettings',
        component: () => import('../views/layout/AsideMain.vue')
      }
    ]
  },
  {
    path: '/app',
    component: () => import('../views/layout/WebLayout.vue'),
    children: [
      {
        path: 'system/:path*',
        name: 'System',
        component: () => import('../views/layout/SubAppContainer.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
