import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { doHttpGet } from '@/api/common/platform'
import AsideMain from '@/views/layout/AsideMain.vue'
import XEUtils from 'xe-utils'

const router = createRouter({
  history: createWebHashHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/' : '/'),
  routes: [
  ],
})

/**
 * 基座只有静态路由，并动态加载微应用的路由入口
 */
let isMicroAppRouterLoad = false
const modulesTwo = import.meta.glob('../views/*/*.vue', { eager: true, import: 'default' })
const modulesThree = import.meta.glob('../views/*/*/*.vue', { eager: true, import: 'default' })
const modulesFour = import.meta.glob('../views/*/*/*/*.vue', { eager: true, import: 'default' })
console.log('router component level2', modulesTwo)
console.log('router component level3', modulesThree)
console.log('router component level4', modulesFour)

router.beforeEach(async (to, from, next) => {
  if (!isMicroAppRouterLoad) {
    console.log('micro app router not init. try to init', to.fullPath)
    await doHttpGet('/platformSvr/sapi/resources/leftMenu', { fullPath: to.fullPath }).then(
      (response) => {
        response.data.forEach((item) => {
          try {
            const dynamicRoute: RouteRecordRaw = {}
            rebuildLeftMenus(dynamicRoute, item)
            console.log('micro app add dynamicRoute', dynamicRoute)
            router.addRoute(dynamicRoute)
            console.log('micro app routes length:', router.getRoutes().length)
          } catch (err) {
            console.log('micro app add router err', err)
          }
        })
      },
    )
    console.log('micro app router init finished', router.getRoutes().length)
    isMicroAppRouterLoad = true
    next({ ...to, replace: true })
    return
  }
  console.log('micro app goto', to.fullPath)
  next()
})

function rebuildLeftMenus(node, menu) {
  console.log('menu', menu)
  // 支持一级菜单
  if (menu.type === 'MENU' && (menu.parentId === null || menu.parentId === undefined)) {
    const idx = (menu.routerUrl || '').lastIndexOf('/')
    node.path = filteredQueryParameter(menu.routerUrl.substring(0, idx))
    node.name = menu.code + 'Parent'
    node.component = AsideMain
    node.children = [
      {
        path: filteredQueryParameter(menu.routerUrl.substring(idx)),
        name: menu.code,
        meta: { title: menu.title, noCache: menu.keepAlive === 'NO' },
        component: getModule(menu.component),
      },
    ]
  }
  if (hasChildrenMenu(menu)) {
    node.path = menu.routerUrl
    node.name = menu.code
    node.component = AsideMain
    node.redirect = menu.redirectUrl
    node.children = []
    node.meta = { title: menu.name }
    menu.childrenList.forEach((child) => {
      if (child.type === 'MENU' || child.type === 'DIRECTORY') {
        if (hasChildrenMenu(child)) {
          child.childrenList.forEach((subChild) => {
            if (subChild.type === 'MENU') {
              node.children.push({
                path: child.routerUrl + '/' + subChild.routerUrl,
                name: subChild.code,
                meta: {
                  title: subChild.name,
                  affix: subChild.affix === 'YES',
                  noCache: subChild.keepAlive === 'NO',
                  query: parseQueryParameter(subChild.routerUrl),
                },
                component: getModule(subChild.component),
              })
            }
          })
        } else {
          node.children.push({
            path: child.routerUrl,
            name: child.code,
            meta: {
              title: child.name,
              affix: child.affix === 'YES',
              noCache: child.keepAlive === 'NO',
              query: parseQueryParameter(child.routerUrl),
            },
            component: getModule(child.component),
          })
        }
      }
    })
  }
}

function filteredQueryParameter(value) {
  if (value.indexOf('?') >= 0) {
    return value.split('?')[0]
  } else {
    return value
  }
}

function parseQueryParameter(value) {
  const index = value.indexOf('?')
  if (index >= 0) {
    return value.substring(index + 1)
  } else {
    return undefined
  }
}

function hasChildrenMenu(menu) {
  if (
    XEUtils.hasOwnProp(menu, 'childrenList') &&
    menu.childrenList !== null &&
    menu.childrenList.length > 0
  ) {
    const len = menu.childrenList.length
    for (let i = 0; i < len; i++) {
      const child = menu.childrenList[i]
      if (child.type === 'MENU') {
        return true
      }
    }
  }
  return false
}

function getModule(name) {
  if (modulesThree['..' + name] !== undefined) {
    return modulesThree['..' + name]
  }
  if (modulesTwo['..' + name] !== undefined) {
    return modulesTwo['..' + name]
  }
  if (modulesFour['..' + name] !== undefined) {
    return modulesFour['..' + name]
  }
  console.log(name, 'component load error')
  return modulesTwo['./ErrorLoadComponent.vue']
}

export default router
