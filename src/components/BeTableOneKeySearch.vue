<template>
  <el-input
    style="width: 240px; margin-right: 1rem"
    :placeholder="$t('platform.ebApp.pleaseInputOneKeySearch')"
    clearable
    @keyup.enter="() => emit('refresh')"
    class="advance-suffix-input"
  >
    <!-- 左侧：搜索放大镜 -->
    <template #prefix>
      <el-icon class="search-prefix-icon">
        <Search />
      </el-icon>
    </template>

    <!-- 右侧：内嵌在输入框内的漏斗切换按钮 -->
    <template #suffix>
      <div
        class="filter-suffix-btn"
        :class="{ 'is-active': isAdvanceSearchActive }"
        :title="
          isAdvanceSearchActive
            ? $t('platform.ebApp.closeAdvance')
            : $t('platform.ebApp.openAdvance')
        "
        @click="toggleAdvanceSearch"
      >
        <IconLocalSearchAdvance class="filter-icon" />
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { defineModel } from 'vue';
import { Search } from '@element-plus/icons-vue';

const isAdvanceSearchActive = defineModel<boolean>('isAdvanceSearchActive');

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'advance-change', active: boolean): void;
}>();

function toggleAdvanceSearch() {
  isAdvanceSearchActive.value = !isAdvanceSearchActive.value;
  emit('advance-change', isAdvanceSearchActive.value);
}
</script>

<style scoped>
/* 1. 调整输入框内右侧间距，为内嵌按钮腾出精致空间 */
.advance-suffix-input :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  margin-right: -4px; /* 贴紧右侧边框内壁 */
}

/* 2. 内嵌按钮本体：精致的小方块 */
.filter-suffix-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.2s ease;
  user-select: none;
}

/* 3. 悬停状态：淡灰色背景反馈 */
.filter-suffix-btn:hover {
  background-color: var(--el-fill-color-light, #f0f2f5);
}

/* 4. 激活选中状态：淡蓝色/主题色背景 */
.filter-suffix-btn.is-active {
  background-color: var(--el-color-primary-light-9, #ecf5ff);
}

/* 5. 漏斗图标样式 */
.filter-icon {
  width: 14px !important;
  height: 14px !important;
  color: var(--el-text-color-secondary, #909399);
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

/* 悬停变深 */
.filter-suffix-btn:hover .filter-icon {
  color: var(--el-text-color-primary, #303133);
}

/* 激活态变品牌高亮色 */
.filter-suffix-btn.is-active .filter-icon {
  color: var(--el-color-primary, #409eff) !important;
  transform: scale(1.05);
}

/* 左侧放大镜图标弱化 */
.search-prefix-icon {
  color: var(--el-text-color-placeholder, #a8abb2);
  font-size: 14px;
}
</style>
