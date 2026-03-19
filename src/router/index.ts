import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/locales/index.ts'

const { t } = i18n.global

const routers = [
  {
    path: '/',
    name: 'Home',
    redirect: '/platformCommon',
  },
  {
    path: '/platformCommon',
    component: () => import('../views/layout/WebLayout.vue'),
    name: 'platformCommon',
    meta: {
      title: t('platformCommon.title'),
    },
    redirect: '/platformCommon/favoriteSettings',
    children: [
      {
        path: 'favoriteSettings',
        name: 'favoriteSettings',
        redirect: '/platformCommon/favoriteSettings/appearanceSettings',
        component: () => import('../views/layout/AsideMain.vue'),
        meta: {
          title: t('platformCommon.favoriteSettings'),
        },
        children: [
          {
            path: 'appearanceSettings',
            name: 'appearanceSettings',
            meta: {
              title: t('platformCommon.appearanceSettings'),
            },
            component: () => import('../views/common/AppearanceSettings.vue'),
          },
          {
            path: 'languageSettings',
            name: 'languageSettings',
            meta: {
              title: t('platformCommon.languageSettings'),
            },
            component: () => import('../views/common/LanguageSettings.vue'),
          },
          {
            path: 'personalInformation',
            name: 'personalInformation',
            meta: {
              title: t('platformCommon.personalInformation'),
            },
            component: () => import('../views/common/PersonalSettings.vue'),
          },
          {
            path: 'passwordSettings',
            name: 'passwordSettings',
            meta: {
              title: t('platformCommon.passwordSettings'),
            },
            component: () => import('../views/common/PasswordSettings.vue'),
          },
        ],
      },
    ],
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
            component: () => import('../views/platform/resource/ResourceGroupList.vue'),
          },
          {
            path: 'resources',
            name: 'resources',
            component: () => import('../views/platform/resource/ResourceList.vue'),
          },
          {
            path: 'schemaDefines',
            name: 'schemaDefines',
            component: () => import('../views/platform/schemaDefine/SchemaDefineList.vue'),
          },
          {
            path: 'i18nDefines',
            name: 'i18nDefines',
            component: () => import('../views/platform/i18n/I18nDefineList.vue'),
          },
        ],
      },
    ],
  },
  {
    // 微应用接入路由示例
    path: '/app',
    component: () => import('../views/layout/WebLayout.vue'),
    redirect: '/app/system/index',
    children: [
      {
        path: 'system/:path*',
        name: 'System',
        component: () => import('../views/layout/SubAppContainer.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routers,
})

export default router
