import { createRouter, createWebHistory } from 'vue-router'

const routers = [
  {
    path: '/',
    name: 'Home',
    redirect: '/app/system'
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
  {
    path: '/frame',
    component: () => import('../views/layout/WebLayout.vue'),
    children: [
      {
        path: 'appearanceSettings',
        name: 'AppearanceSettings',
        component: () => import('../views/common/AppearanceSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
