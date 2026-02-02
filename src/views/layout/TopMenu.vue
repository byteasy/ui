<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const popoverWidth = ref(500)

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
</script>

<template>
  <el-popover placement="bottom-end" :width="popoverWidth">
    <template #reference>
      <div class="flex-row ml-5 app-text-color my-font-size-lg" type="text">
        系统设置<el-icon class="ml-2"><ArrowDown /></el-icon>
      </div>
    </template>
    <div class="flex-row align-items-start" style="height: 50vh; overflow-y: auto; width: 100%;">
      <div class="item-first">
        <el-space direction="vertical" fill>
          <div><span class="my-font-size group-one">企业战略</span></div>
          <div><span class="my-font-size group-one">人力资源</span></div>
          <div><span class="my-font-size group-one">产品研发</span></div>
          <div><span class="my-font-size group-one">供应链</span></div>
          <div><span class="my-font-size group-one">营销</span></div>
          <div><span class="my-font-size group-one">客服</span></div>
          <div><span class="my-font-size group-one">法务</span></div>
          <div><span class="my-font-size group-one">车联网</span></div>
        </el-space>
      </div>
      <div class="my-bg-color-blank item-second">
        <el-space wrap alignment="normal" size="large">
          <div class="flex-column align-items-start p-3">
            <div class="my-font-size font-bold">供应商</div>
            <div class="group-tow-child"><el-link :underline="false">供应商档案参数配置</el-link></div>
            <div class="group-tow-child"><el-link :underline="false">供应商档案</el-link></div>
            <div class="group-tow-child"><el-link :underline="false">供应商变更</el-link></div>
            <div class="group-tow-child"><el-link :underline="false">供应商淘汰</el-link></div>
          </div>
          <div class="flex-column align-items-start p-3">
            <div class="my-font-size font-bold">生产管理</div>
            <div class="my-font-size group-tow-child"><el-link :underline="false">物料生产视图</el-link></div>
            <div class="my-font-size group-tow-child"><el-link :underline="false">年度生产大纲</el-link></div>
            <div class="my-font-size group-tow-child"><el-link :underline="false">月度生产预测</el-link></div>
          </div>
        </el-space>

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
.item-first {
  flex: 0 0 20%; /* 不增长，不收缩，基础宽度30% */
  /* 或者 */
  flex-basis: 20%;
  flex-shrink: 0; /* 禁止收缩 */
  flex-grow: 0;   /* 禁止增长 */
  display: flex;
  justify-content: flex-end; /* 水平右对齐 */
  padding-top: 1rem;
}

.item-second {
  flex: 1; /* 简写：flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  /* 或者详细写法 */
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
  height: 100%;
  padding: 2rem;
}
.group-one {
  padding: 1rem;
  display: block;
  min-width: 80px;
}

.group-one:hover {
  padding: 1rem;
  color: var(--my-text-color);
  background-color: var(--my-bg-color);
}

.group-tow-child:hover {
}
</style>
