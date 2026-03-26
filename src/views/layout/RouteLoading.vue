<template>
  <div class="w-full h-full">
    <el-splitter :draggable="false" class="w-full h-full">
      <el-splitter-panel size="220" :min="80" :max="220" draggable="false" :resizable="false">
        <div class="mt-1">
          <el-skeleton :rows="15" animated class="h-full w-full" />
        </div>
      </el-splitter-panel>
      <el-splitter-panel :min="200">
        <div class="pl-1 pt-1 pr-1 w-full h-full my-bg-color-blank">
          <el-skeleton :rows="20" animated class="h-full w-full" />
        </div>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { doHttpGet } from '@/api/common/platform'
import router from '@/router'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import XEUtils from 'xe-utils'
import WebLayout from '@/views/layout/WebLayout.vue'
import AsideMain from '@/views/layout/AsideMain.vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute() // 新增：获取当前路由参数（redirect）
const appSettingsStore = useAppSettingsStore()
const modulesTwo = import.meta.glob('../*/*.vue', { eager: true, import: 'default' })
const modulesThree = import.meta.glob('../*/*/*.vue', { eager: true, import: 'default' })
const modulesFour = import.meta.glob('../*/*/*/*.vue', { eager: true, import: 'default' })
console.log('modulesFour', modulesFour)
console.log('modulesThree', modulesThree)
console.log('modulesTwo', modulesTwo)

const { activeMicroApp } = storeToRefs(appSettingsStore)

// 新增：获取目标跳转路由（优先级：redirect参数 > 配置的group.router）
const getTargetRoute = () => {
  // 从路由参数中获取redirect（刷新时的目标路由）
  const redirect = route.query.redirectUrl as string
  // 如果有redirect则用redirect，否则用group.router
  return redirect || JSON.parse(appSettingsStore.activeMicroApp).router
}

watch(
  () => activeMicroApp.value, // 关键：监听 ref 的 value
  (newVal, oldVal) => {
    console.log('activeMicroApp change: ', newVal)
    loadRouteFromServer()
  },
)

onMounted(() => {
  /**
   * F5刷新后，本地路由信息丢失，但是路由状态存储到了local storage,此时TopMenu的路由还没有构建完成。需要TopMenu构建完路由后再加载.
   */
  if(activeMicroApp.value) {
    loadRouteFromServer()
  }
})

const loadRouteFromServer = () => {
  console.log('loadRouteFromServer')
  if(appSettingsStore.activeMicroApp === '' || appSettingsStore.activeMicroApp === undefined) {
    console.log('Loading route from server stop, because no active active micro app info.')
    return
  }
  const group = JSON.parse(appSettingsStore.activeMicroApp)
  if(group.isMicroapp === 'YES') {
    console.log('loadRouteFromServer stop, because current route is micro app')
    const redirect = route.query.redirectUrl as string
    if(redirect !== null && redirect !== undefined) {
      router.push({
        path: redirect,
        replace: true, // 替换历史记录，优化体验
      })
    }
    return
  }

  doHttpGet('/platformSvr/sapi/resources/leftMenu?groupId=' + group.id).then((response) => {
    response.data.forEach((item) => {
      try {
        const dynamicRoute: RouteRecordRaw = {}
        rebuildLeftMenus(dynamicRoute, item)
        console.log('dynamicRoute', dynamicRoute)
        router.addRoute(dynamicRoute)
        console.log('routes length:', router.getRoutes().length)
        buildPermissionSession(item)
        appSettingsStore.setIsDynamicRoutesLoaded(true)
      } catch (err) {
        console.log(err)
      }
    })
    const targetRoute = getTargetRoute()
    console.log('getTargetRoute', targetRoute)
    router.push({
      path: targetRoute,
      replace: true, // 替换历史记录，优化体验
    })
  })
}

function buildPermissionSession(menu) {
  // sessionStore.addAuthorizedCode(menu.name)
  if (hasChildrenMenu(menu)) {
    menu.childrenList.forEach((child) => {
      buildPermissionSession(child)
    })
  }
}

function rebuildLeftMenus(node, menu) {
  console.log('menu', menu)
  // 支持一级菜单
  if (menu.type === 'MENU' && menu.parentId === null && menu.parentId === undefined) {
    node.path = ''
    node.name = undefined
    node.component = WebLayout
    node.children = [
      {
        path: '',
        component: AsideMain,
        redirect: menu.redirectUrl,
        name: undefined,
        meta: { title: menu.title },
        children: [
          {
            path: filteredQueryParameter(menu.routerUrl),
            component: getModule(menu.component),
            name: menu.name,
            meta: { title: menu.title },
          },
        ],
      },
    ]
    node.redirect = menu.redirectUrl
    node.meta = { title: menu.name }
  }
  if (hasChildrenMenu(menu)) {
    const dirArrs = (menu.routerUrl || '').split('/')
    console.log('dirArrs', dirArrs)
    node.path = filteredQueryParameter('/' + dirArrs[1])
    node.name = menu.code
    node.component = WebLayout
    node.redirect = menu.redirectUrl
    node.children = []
    node.meta = { title: menu.name }
    menu.childrenList.forEach((child) => {
      if (menu.type === 'MENU' || menu.type === 'DIRECTORY') {
        if (hasChildrenMenu(child)) {
          // 构建三级路由
          const subRoute = {
            path: filteredQueryParameter(child.routerUrl),
            component: AsideMain,
            redirect: child.redirectUrl,
            name: child.name,
            meta: { title: child.name },
            children: [],
          }
          child.childrenList.forEach((subChild) => {
            const arrs = (subChild.routerUrl || '').split('/')
            console.log('subChild arrs', arrs)
            subRoute.children.push({
              path: filteredQueryParameter(arrs[3]),
              name: subChild.name,
              meta: {
                title: subChild.name,
                affix: subChild.affix === 'YES',
                noCache: !subChild.keepAlive,
                query: parseQueryParameter(subChild.routerUrl),
              },
              component: getModule(subChild.component),
            })
          })
          node.children.push(subRoute)
        } else {
          const arrs = (child.routerUrl || '').split('/')
          console.log('childArrs', arrs)
          if (arrs.length === 4) {
            node.children.push({
              path: filteredQueryParameter(arrs[2]),
              component: AsideMain,
              redirect: child.routerUrl,
              children: [
                {
                  path: filteredQueryParameter(arrs[3]),
                  name: child.name,
                  meta: {
                    title: child.name,
                    affix: child.affix === 'YES',
                    noCache: !child.keepAlive,
                    query: parseQueryParameter(child.routerUrl),
                  },
                  component: getModule(child.component),
                },
              ],
            })
          } else {
            console.log(
              'routerUrl must like this: /string/string/string, actual is',
              child.routerUrl,
            )
          }
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

function getRedirectUrl() {
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get('redirectUrl')
  } catch (error) {
    console.error('解析URL失败:', error)
    return null
  }
}
</script>
