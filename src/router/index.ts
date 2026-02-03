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
    name: 'frame',
    redirect: '/frame/favoriteSettings',
    children: [
      {
        path: 'favoriteSettings',
        name: 'favoriteSettings',
        redirect: '/frame/favoriteSettings/appearanceSettings',
        component: () => import('../views/layout/AsideMain.vue'),
        children: [
          {
            path: 'appearanceSettings',
            name: 'appearanceSettings',
            component: () => import('../views/common/appearanceSettings.vue')
          },
          {
            path: 'languageSettings',
            name: 'languageSettings',
            component: () => import('../views/common/languageSettings.vue')
          },
          {
            path: 'personalSettings',
            name: 'personalSettings',
            component: () => import('../views/common/appearanceSettings.vue')
          },
          {
            path: 'passwordSettings',
            name: 'passwordSettings',
            component: () => import('../views/common/appearanceSettings.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/app',
    component: () => import('../views/layout/WebLayout.vue'),
    redirect: '/app/system/index',
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
