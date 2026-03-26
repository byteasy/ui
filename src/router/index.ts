import { createRouter, createWebHashHistory } from 'vue-router'
import i18n from '@/locales/index.ts'
import { useAppSettingsStore } from '@/stores/appSettings.ts'

const { t } = i18n.global

const routers = [
  {
    path: '/platformCommon',
    component: () => import('../views/layout/WebLayout.vue'),
    name: 'platformCommon',
    meta: { title: t('platformCommon.title') },
    redirect: '/platformCommon/favoriteSettings',
    children: [
      {
        path: 'loading',
        name: 'RouteLoading',
        component: () => import('../views/layout/RouteLoading.vue'),
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('../views/common/Error404.vue')
      },
      {
        path: 'favoriteSettings',
        name: 'favoriteSettings',
        redirect: '/platformCommon/favoriteSettings/appearanceSettings',
        component: () => import('../views/layout/AsideMain.vue'),
        meta: { title: t('platformCommon.favoriteSettings') },
        children: [
          {
            path: 'appearanceSettings',
            name: 'appearanceSettings',
            meta: { title: t('platformCommon.appearanceSettings') },
            component: () => import('../views/common/AppearanceSettings.vue'),
          },
          {
            path: 'languageSettings',
            name: 'languageSettings',
            meta: { title: t('platformCommon.languageSettings') },
            component: () => import('../views/common/LanguageSettings.vue'),
          },
          {
            path: 'personalInformation',
            name: 'personalInformation',
            meta: { title: t('platformCommon.personalInformation') },
            component: () => import('../views/common/PersonalSettings.vue'),
          },
          {
            path: 'passwordSettings',
            name: 'passwordSettings',
            meta: { title: t('platformCommon.passwordSettings') },
            component: () => import('../views/common/PasswordSettings.vue'),
          },
        ],
      },
      // {
      //   path: 'baseCommon',
      //   name: 'baseCommon',
      //   redirect: '/platform/baseCommon/resourceGroups',
      //   component: () => import('../views/layout/AsideMain.vue'),
      //   children: [
      //     {
      //       path: 'resourceGroups',
      //       name: 'resourceGroups',
      //       component: () => import('../views/platform/resource/ResourceGroupList.vue'),
      //     },
      //     {
      //       path: 'resources',
      //       name: 'resources',
      //       component: () => import('../views/platform/resource/ResourceList.vue'),
      //     },
      //     {
      //       path: 'schemaDefines',
      //       name: 'schemaDefines',
      //       component: () => import('../views/platform/schemaDefine/SchemaDefineList.vue'),
      //     },
      //     {
      //       path: 'i18nDefines',
      //       name: 'i18nDefines',
      //       component: () => import('../views/platform/i18n/I18nDefineList.vue'),
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/platformCommon/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers,
})

router.beforeEach(async (to, from, next) => {
  const appSettingsStore = useAppSettingsStore
  if (to.path === '/platformCommon/404') {
    if (!appSettingsStore.isDynamicRoutesLoaded) {
      const originalPath = to.redirectedFrom
      console.log('from', originalPath)
      next('/platformCommon/loading?redirectUrl=' + originalPath.fullPath)
      return
    }
    next()
  } else {
    next()
  }
})

export default router
