<template>
  <!-- 1. 目录类型（DIRECTORY）：渲染为 el-sub-menu，并递归调用自己渲染 childrenList -->
  <el-sub-menu
    v-if="item.type === 'DIRECTORY' && item.visible === 'YES'"
    :index="currentPath"
  >
    <template #title>
      <be-svg-icon
        :svg="item.icon"
        :style-var="'var(--my-menu-icon-color)'"
        v-if="item.icon"
      />
      <be-i18n-value :model-value="item.name" :class="depth === 0 ? 'my-font-size-md' : 'pl-3'" />
    </template>

    <!-- 递归渲染子节点 -->
    <template v-for="child in item.childrenList" :key="child.code">
      <sub-menu-item
        :item="child"
        :parent-path="currentPath"
        :depth="depth + 1"
        @open="onChildOpen"
      />
    </template>
  </el-sub-menu>

  <!-- 2. 叶子菜单类型（MENU）：渲染为 el-menu-item，点击触发跳转 -->
  <el-menu-item
    v-else-if="item.type === 'MENU' && item.visible === 'YES'"
    :index="currentPath"
    @click="handleClick"
  >
    <be-svg-icon
      :svg="item.icon"
      :style-var="'var(--my-menu-icon-color)'"
      v-if="item.icon"
    />
    <be-i18n-value :model-value="item.name" class="pl-3" />
  </el-menu-item>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import BeSvgIcon from '@/components/BeSvgIcon.vue';

// 递归组件名称，以便自调用
defineOptions({
  name: 'SubMenuItem',
});

const props = withDefaults(
  defineProps<{
    item: any;
    parentPath?: string;
    depth?: number;
  }>(),
  {
    parentPath: '',
    depth: 0,
  }
);

const emit = defineEmits<{
  (e: 'open', fullPath: string, resource: any): void;
}>();

/**
 * 智能组合并规范化路径，避免出现重复的斜杠 "//" 或末尾斜杠
 */
const currentPath = computed(() => {
  const rawUrl = getUrl(props.item.routerUrl || '');
  if (!props.parentPath) {
    return rawUrl;
  }
  // 如果子路由自身以 "/" 开头，则规范化去除
  const cleanChild = rawUrl.replace(/^\//, '');
  const cleanParent = props.parentPath.replace(/\/$/, '');
  return `${cleanParent}/${cleanChild}`;
});

function getUrl(path: string) {
  if (!path) return '';
  return path.includes('?') ? path.split('?')[0] : path;
}

function handleClick() {
  emit('open', currentPath.value, props.item);
}

function onChildOpen(fullPath: string, resource: any) {
  // 向父级透传 open 事件
  emit('open', fullPath, resource);
}
</script>
<style scoped>
.el-menu-border {
  border-right: 0;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--my-bg-menu-item-active-color);
}
</style>
