<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const popoverWidth = ref(500)
const refPopWindow = ref()
const currentGroup = ref('')
const router = useRouter()

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

onMounted(() => {
  calculateWidth()
  window.addEventListener('resize', calculateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateWidth)
})

function onItemClick(url) {
  console.log('1111111111')
  router.push('/app/system/123')
  refPopWindow.value.hide()
}

function onGroupClick(group) {
  currentGroup.value = group
  console.log(group)
}
</script>
<template>
  <el-popover placement="bottom-end" :width="popoverWidth" ref="refPopWindow">
    <template #reference>
      <div class="flex-row ml-5 app-text-color my-font-size-lg" style="cursor:pointer">
        系统设置<el-icon class="ml-2"><ArrowDown /></el-icon>
      </div>
    </template>

    <!-- 父容器固定高度，取消全局滚动，改为内部局部滚动 -->
    <div class="flex-row nav-container">

      <!-- 左侧：独立滚动区 -->
      <div class="item-first custom-scrollbar">
        <div class="menu-list">
          <!-- 模拟大量数据测试滚动 -->
          <div v-for="item in ['企业战略', '人力资源', '产品研发', '供应链', '营销', '客服', '法务', '车联网', '财务管理', '资产管理']"
               :key="item"
               class="group-one" @mouseenter="onGroupClick(item)">
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 右侧：独立滚动区 -->
      <div class="item-second custom-scrollbar">
        <div class="content-wrapper">
          <el-space wrap alignment="normal" size="large">
            <div class="flex-column align-items-start p-3" v-if="currentGroup === '企业战略'">
              <div class="my-font-size-md font-bold mb-2">供应商</div>
              <div class="my-font-size group-tow-child" @click="onItemClick">供应商档案参数配置</div>
              <div v-for="n in 10" :key="n" class="my-font-size group-tow-child">供应商子项 {{n}}</div>
            </div>
            <div class="flex-column align-items-start p-3" v-if="currentGroup === '人力资源'">
              <div class="my-font-size-md font-bold mb-2">人力资源</div>
              <div class="my-font-size group-tow-child" @click="onItemClick">供应商档案参数配置</div>
              <div v-for="n in 10" :key="n" class="my-font-size group-tow-child">人力资源 {{n}}</div>
            </div>
          </el-space>
        </div>
      </div>

    </div>
  </el-popover>
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

