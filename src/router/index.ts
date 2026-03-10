import { createRouter, createWebHashHistory } from 'vue-router'

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
            component: () => import('../views/common/AppearanceSettings.vue')
          },
          {
            path: 'languageSettings',
            name: 'languageSettings',
            component: () => import('../views/common/LanguageSettings.vue')
          },
          {
            path: 'personalSettings',
            name: 'personalSettings',
            component: () => import('../views/common/PersonalSettings.vue')
          },
          {
            path: 'passwordSettings',
            name: 'passwordSettings',
            component: () => import('../views/common/PasswordSettings.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/platform',
    component: () => import('../views/layout/WebLayout.vue'),
    name: 'platform',
    redirect: '/platform/baseCommon',
    children: [
      {
        path: 'baseCommon',
        name: 'baseCommon',
        redirect: '/platform/baseCommon/resourceGroups',
        component: () => import('../views/layout/AsideMain.vue'),
        children: [
          {
            path: 'resourceGroups',
            name: 'resourceGroups',
            component: () => import('../views/platform/resource/ResourceGroupList.vue')
          },
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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
