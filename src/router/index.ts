import {createRouter, createWebHashHistory} from 'vue-router'
import i18n from '@/locales/index.ts'
import {doHttpGet} from "@/api/common/platform";
import WebLayout from "@/views/layout/WebLayout.vue";
import SubAppContainer from "@/views/layout/SubAppContainer.vue";

const {t} = i18n.global

const routers = [
  {
    path: '/platformCommon',
    component: () => import('../views/layout/WebLayout.vue'),
    name: 'platformCommon',
    meta: {title: t('platformCommon.title')},
    redirect: '/platformCommon/favoriteSettings',
    children: [
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
        meta: {title: t('platformCommon.favoriteSettings')},
        children: [
          {
            path: 'appearanceSettings',
            name: 'appearanceSettings',
            meta: {title: t('platformCommon.appearanceSettings')},
            component: () => import('../views/common/AppearanceSettings.vue'),
          },
          {
            path: 'languageSettings',
            name: 'languageSettings',
            meta: {title: t('platformCommon.languageSettings')},
            component: () => import('../views/common/LanguageSettings.vue'),
          },
          {
            path: 'personalInformation',
            name: 'personalInformation',
            meta: {title: t('platformCommon.personalInformation')},
            component: () => import('../views/common/PersonalSettings.vue'),
          },
          {
            path: 'passwordSettings',
            name: 'passwordSettings',
            meta: {title: t('platformCommon.passwordSettings')},
            component: () => import('../views/common/PasswordSettings.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routers,
})

/**
 * 基座只有静态路由，并动态加载微应用的路由入口
 */
let isRouterLoad = false

router.beforeEach(async (to, from, next) => {
  if (!isRouterLoad) {
    /**
     * 从服务端加载微前端的入口路由+所有的基座路由,微前端的路由交给子应用自己去加载。
     */
    await doHttpGet('/platformSvr/sapi/resourceCategorys/topMenu').then((res) => {
      let activeGroup = null
      for (let i = 0; i < res.data.resourceCategoryVOS.length; i++) {
        const entry = res.data.resourceCategoryVOS[i]
        for (let j = 0; j < entry.resourceGroups.length; j++) {
          const group = entry.resourceGroups[j]
          // 默认打开第一个
          if (activeGroup === null) {
            activeGroup = group
          }

          const path = group.router
          const pathArrs = (path || '').split('/')
          console.log('path', path, pathArrs)

          if (group.isMicroapp === 'YES') {
            const dynamicRoute = {
              path: '/' + pathArrs[1],
              component: WebLayout,
              redirect: router,
              children: [
                {
                  path: pathArrs[2] + '/:path*',
                  name: group.code,
                  component: SubAppContainer,
                },
              ],
            }
            router.addRoute(dynamicRoute)
            console.log('add microappRoute', dynamicRoute)
          }
        }
      }

      // 最后添加404
      router.addRoute(
        {
          path: '/:catchAll(.*)',
          redirect: '/platformCommon/404'
        }
      )
      isRouterLoad = true
      console.log('动态路由加载完成', isRouterLoad, to.fullPath, activeGroup.router)
      if (to.fullPath === '/') {
        next(activeGroup.router)
      } else {
        next({...to, replace: true})
      }
      return
    })
  }
  next()
})

export default router
