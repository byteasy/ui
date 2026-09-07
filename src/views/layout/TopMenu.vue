<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { doHttpGet } from '@/api/common/platform'

const router = useRouter()

const popoverWidth = ref(500)
const refPopWindow = ref()
const activeGroup = ref<any>(undefined)

const quickMenus = ref<any[]>([])
const menuEntries = ref<any[]>([])
const groupEntries = ref<any[]>([])

const calculateWidth = () => {
  const viewportWidth = window.innerWidth
  if (viewportWidth < 768) {
    popoverWidth.value = Math.min(viewportWidth - 40, 500)
  } else if (viewportWidth < 1024) {
    popoverWidth.value = 600
  } else if (viewportWidth < 1280) {
    popoverWidth.value = 700
  } else if (viewportWidth < 1536) {
    popoverWidth.value = 800
  } else {
    popoverWidth.value = 900
  }
}

/**
 * 纯粹基于当前浏览器的 location 路径实时计算高亮
 */
function updateActiveByLocation() {
  // 1. 获取当前浏览器物理路径（兼容 hash 与 history）
  let currentPath = window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname
  if (currentPath.includes('?')) {
    currentPath = currentPath.split('?')[0]
  }

  if (!currentPath || currentPath === '/' || currentPath.includes('/platformCommon/loading')) {
    return
  }

  const pathSegments = currentPath.split('/').filter(Boolean)
  // 取出前两级路径作为模块根路径，例如 "/SystemManage/EasyBuilder"
  const rootPath = pathSegments.length >= 2 ? `/${pathSegments[0]}/${pathSegments[1]}` : currentPath

  // 2. 优先在快捷菜单 quickMenus 中匹配
  const matchedQuick = quickMenus.value.find((item) => {
    if (!item?.router) return false
    const base = item.router.split('?')[0]
    return currentPath.startsWith(base) || base.startsWith(rootPath)
  })

  if (matchedQuick) {
    activeGroup.value = matchedQuick
    return
  }

  // 3. 在全部菜单树 menuEntries 中匹配（修复了原代码中的下标变量越界 Bug）
  let foundGroup: any = null
  for (let i = 0; i < menuEntries.value.length; i++) {
    const parent = menuEntries.value[i]
    if (!parent?.children) continue

    for (let j = 0; j < parent.children.length; j++) {
      const entry = parent.children[j]
      if (!entry?.resourceGroups) continue

      for (let m = 0; m < entry.resourceGroups.length; m++) {
        // 🔥 修复了原代码中把 m 误写成 j 的重大 Bug
        const group = entry.resourceGroups[m]
        if (!group?.router) continue

        const base = group.router.split('?')[0]
        if (currentPath.startsWith(base) || base.startsWith(rootPath)) {
          foundGroup = group
          break
        }
      }
      if (foundGroup) break
    }
    if (foundGroup) break
  }

  if (foundGroup) {
    activeGroup.value = foundGroup
  }
}

// 浏览器地址变化时的原生事件回调
function onLocationChange() {
  nextTick(() => {
    updateActiveByLocation()
  })
}

onMounted(() => {
  calculateWidth()
  window.addEventListener('resize', calculateWidth)

  // 🔥 核心：直接监听浏览器原生的 hashchange 与 popstate，无视沙箱与路由框架
  window.addEventListener('hashchange', onLocationChange)
  window.addEventListener('popstate', onLocationChange)

  doHttpGet('/platformSvr/sapi/resourceCategorys/topMenu').then((res) => {
    menuEntries.value = res.data?.resourceCategoryVOS || []
    quickMenus.value = res.data?.resourceGroups || []

    if (menuEntries.value.length > 0 && menuEntries.value[0].children) {
      groupEntries.value = menuEntries.value[0].children
    }

    // 接口返回后立即执行一次高亮定位，彻底解决 F5 刷新无状态的问题
    nextTick(() => {
      updateActiveByLocation()
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateWidth)
  window.removeEventListener('hashchange', onLocationChange)
  window.removeEventListener('popstate', onLocationChange)
})

function onItemClick(group: any) {
  if (group.code === activeGroup.value?.code) {
    return
  }
  refPopWindow.value?.hide()
  activeGroup.value = group
  router.push(group.router)
}

function onGroupClick(category: any) {
  groupEntries.value = category.children || []
}
</script>
<template>
  <div class="flex-row align-items-center">
    <el-text
      v-for="item in quickMenus"
      :key="item.code"
      :class="{
        'app-text-color ml-1': true,
        'app-text-color-active': activeGroup?.code === item.code,
      }"
      @click="onItemClick(item)"
    >
      <tuna-i18n-value :model-value="item.name" />
    </el-text
    >
    <el-popover placement="bottom-start" :width="popoverWidth" ref="refPopWindow">
      <template #reference>
        <div
          class="flex-row align-items-center ml-5 app-text-color my-font-size-lg"
          style="cursor: pointer"
        >
          <el-icon :size="20">
            <Menu/>
          </el-icon>
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
              <tuna-i18n-value :model-value="item.name" />
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
              <div class="flex-column align-items-start p-3" v-for="group in groupEntries" :key="group.id">
                <div class="my-font-size-md font-bold mb-2"><tuna-i18n-value :model-value="group.name" /></div>
                <div
                  v-for="item in group.resourceGroups"
                  :key="item.code"
                  class="my-font-size group-tow-child"
                  @click="onItemClick(item)"
                >
                  <tuna-i18n-value :model-value="item.name" />
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

.app-text-color-active {
  background-color: color-mix(in srgb, var(--my-bg-color) 60%, var(--my-text-color));
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
