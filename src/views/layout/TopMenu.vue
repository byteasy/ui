<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doHttpGet } from '@/api/common/platform'
import SubAppContainer from '@/views/layout/SubAppContainer.vue'
import WebLayout from '@/views/layout/WebLayout.vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'

const router = useRouter()
const appSettingsStore = useAppSettingsStore()
const route = useRoute() // 新增：获取当前路由参数（redirect）

const popoverWidth = ref(500)
const refPopWindow = ref()

const quickMenus = ref([])
const menuEntries = ref([])
const groupEntries = ref([])
const calculateWidth = () => {
  const viewportWidth = window.innerWidth

  if (viewportWidth < 768) {
    // 移动端：接近全屏
    popoverWidth.value = Math.min(viewportWidth - 40, 500)
  } else if (viewportWidth < 1024) {
    // 平板端：适中宽度
    popoverWidth.value = 600
  } else if (viewportWidth < 1280) {
    // 小桌面端
    popoverWidth.value = 700
  } else if (viewportWidth < 1536) {
    // 标准桌面端
    popoverWidth.value = 800
  } else {
    // 大屏幕
    popoverWidth.value = 900
  }
}

// 新增：获取目标跳转路由（优先级：redirect参数 > 配置的group.router）
const getRedirectRoute = () => {
  // 从路由参数中获取redirect（刷新时的目标路由）
  const redirect = route.query.redirectUrl as string
  // 如果有redirect则用redirect，否则用group.router
  return redirect
}

onMounted(() => {
  console.log('TopMenu mounted, clear active micro app')
  const redirectRoute = getRedirectRoute()
  if (redirectRoute !== null && redirectRoute !== undefined) {
    appSettingsStore.setActiveMicroApp('')
  }
  calculateWidth()
  window.addEventListener('resize', calculateWidth)

  doHttpGet('/platformSvr/sapi/resourceCategorys/topMenu').then((res) => {
    menuEntries.value = res.data.resourceCategoryVOS
    quickMenus.value = res.data.resourceGroups

    const microApps = []
    for (let i = 0; i < menuEntries.value.length; i++) {
      const entry = menuEntries.value[i]
      for (let j = 0; j < entry.resourceGroups.length; j++) {
        const group = entry.resourceGroups[j]
        const path = group.router
        const arrs = (path || '').split('/')

        if (group.isMicroapp === 'YES') {
          console.log('path', path, arrs)
          const dynamicRoute = {
            path: '/' + arrs[1],
            component: WebLayout,
            redirect: router,
            children: [
              {
                path: arrs[2] + '/:path*',
                name: group.code,
                component: SubAppContainer,
              },
            ],
          }
          router.addRoute(dynamicRoute)
          console.log('routes length:', router.getRoutes().length)
          console.log('microappRoute', dynamicRoute)
          // 构建微应用的配置信息
          const microAppConfig = {
            name: group.code,
            entry: group.entry,
            container: '#sub-app-container', // 挂载子应用的dom
            activeRule: '/' + arrs[1] + '/' + arrs[2], // 路由匹配规则
            props: group.props ? JSON.parse(group.props) : {},
          }
          microApps.push(microAppConfig)
        }

        if (redirectRoute !== null && redirectRoute !== undefined) {
          console.log('redirectRoute: ' + redirectRoute + ' arrs: ' + arrs[1] + '/' + arrs[2])
          // 重建当前活跃的micro app
          if (redirectRoute.startsWith('/' + arrs[1] + '/' + arrs[2])) {
            console.log('redirectRoute match micro app: ' + group.code)
            appSettingsStore.setActiveMicroApp(JSON.stringify(group))
          }
        }
      }
    }
    appSettingsStore.setMicroAppConfig(JSON.stringify(microApps))
    console.log('micro app config load complete', microApps)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateWidth)
})

function onItemClick(group) {
  appSettingsStore.setActiveMicroApp(JSON.stringify(group))
  refPopWindow.value.hide()
  if (group.isMicroapp === 'YES') {
    router.push(group.router)
  } else {
    router.push({ path: '/platformCommon/loading' })
  }
}

function onGroupClick(category) {
  groupEntries.value = category.resourceGroups
}
</script>
<template>
  <div class="flex-row align-items-center">
    <el-text
      v-for="item in quickMenus"
      :key="item.code"
      class="app-text-color ml-1"
      @click="onItemClick(item)"
    >
      {{ item.name }}</el-text
    >
    <el-popover placement="bottom-start" :width="popoverWidth" ref="refPopWindow">
      <template #reference>
        <div
          class="flex-row align-items-center ml-5 app-text-color my-font-size-lg"
          style="cursor: pointer"
        >
          <el-icon :size="20"><Menu /></el-icon>
        </div>
      </template>

      <!-- 父容器固定高度，取消全局滚动，改为内部局部滚动 -->
      <div class="flex-row nav-container">
        <!-- 左侧：独立滚动区 -->
        <div class="item-first custom-scrollbar">
          <div class="menu-list">
            <!-- 模拟大量数据测试滚动 -->
            <div
              v-for="item in menuEntries"
              :key="item"
              class="group-one"
              @mouseenter="onGroupClick(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <!-- 右侧：独立滚动区 -->
        <div class="item-second custom-scrollbar">
          <div class="content-wrapper">
            <el-space wrap alignment="normal" size="large">
              <!--            <div class="flex-column align-items-start p-3">-->
              <!--              <div class="my-font-size-md font-bold mb-2">供应商</div>-->
              <!--              <div class="my-font-size group-tow-child" @click="onItemClick">供应商档案参数配置</div>-->
              <!--              <div v-for="n in 10" :key="n" class="my-font-size group-tow-child">供应商子项 {{n}}</div>-->
              <!--            </div>-->
              <div class="flex-column align-items-start p-3">
                <div class="my-font-size-md font-bold mb-2">常用</div>
                <div
                  v-for="item in groupEntries"
                  :key="item.code"
                  class="my-font-size group-tow-child"
                  @click="onItemClick(item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </el-space>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>
.app-text-color {
  color: var(--my-text-color);
  padding: 0.4rem;
  border-radius: 0.4rem;
}
.app-text-color:hover {
  background-color: color-mix(in srgb, var(--my-bg-color) 90%, var(--my-text-color));
}
/* 容器基础布局 */
.nav-container {
  display: flex;
  align-items: stretch;
  height: 50vh; /* 固定整个弹出层高度 */
  min-height: 300px; /* 保证最小可操作空间 */
  overflow: hidden; /* 禁止外层滚动 */
}

/* 左侧样式优化 */
.item-first {
  flex: 0 0 120px; /* 默认宽度 */
  background-color: var(--el-fill-color-light); /* 背景色占满 */
  border-right: 1px solid var(--el-border-color-lighter);
  overflow-y: auto; /* 开启局部滚动 */
  display: flex;
  flex-direction: column;
}

.menu-list {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.group-one {
  padding: 12px 20px;
  text-align: right;
  cursor: pointer;
  white-space: nowrap; /* 窄屏不换行 */
  transition: background 0.2s;
}

.group-one:hover {
  background-color: var(--el-bg-color);
  color: var(--el-color-primary);
}

/* 右侧样式优化 */
.item-second {
  flex: 1;
  overflow-y: auto; /* 开启局部滚动 */
  padding: 1rem;
}

/* 响应式适配：窄屏幕下缩小左侧宽度 */
@media (max-width: 768px) {
  .item-first {
    flex: 0 0 90px;
  }
  .group-one {
    padding: 10px 12px;
    font-size: 12px;
  }
}

/* 响应式适配：宽屏幕下展开左侧 */
@media (min-width: 1200px) {
  .item-first {
    flex: 0 0 180px;
  }
}

/* 美化滚动条 (可选) */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--el-border-color-lighter);
  border-radius: 10px;
}
.group-tow-child {
  padding: 0.1rem;
}
.group-tow-child:hover {
  color: var(--el-color-primary);
  cursor: pointer;
}
</style>
