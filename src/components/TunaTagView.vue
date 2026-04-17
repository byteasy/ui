<template>
  <div class="tags-view-container">
    <el-scrollbar>
      <div class="flex-row items-center h-full px-2">
        <el-tag
          v-for="tag in visitedViews"
          :key="tag.path"
          :closable="!tag.meta?.affix"
          :type="isActive(tag) ?  'primary' : 'info'"
          :effect="isActive(tag) ? 'dark' : 'plain'"
          class="tag-item"
          @click="router.push(tag.path!)"
          @close="closeSelectedTag(tag)"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
        </el-tag>
      </div>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeLeftTags">关闭左侧</li>
      <li @click="closeRightTags">关闭右侧</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">全部关闭</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore, type TagView } from '@/stores/tagsView'

const route = useRoute()
const router = useRouter()
const tagsStore = useTagsViewStore()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({})

const visitedViews = computed(() => tagsStore.visitedViews)
const isActive = (tag: TagView) => tag.path === route.path

// 路由监听
watch(
  () => route.path,
  () => {
    tagsStore.addView(route)
  },
  { immediate: true },
)

// 点击外部关闭菜单
watch(visible, (val) => {
  const handler = () => (visible.value = false)
  if (val) document.body.addEventListener('click', handler)
  else document.body.removeEventListener('click', handler)
})

const openMenu = (tag: TagView, e: MouseEvent) => {
  left.value = e.clientX
  top.value = e.clientY
  selectedTag.value = tag
  visible.value = true
}

const closeSelectedTag = (tag: TagView) => {
  tagsStore.delView(tag)
  if (isActive(tag)) {
    const next = visitedViews.value[visitedViews.value.length - 1]
    router.push(next ? next.path! : '/')
  }
}

// 批量关闭逻辑
const closeLeftTags = () => tagsStore.delLeftViews(selectedTag.value)
const closeRightTags = () => tagsStore.delRightViews(selectedTag.value)
const closeOthersTags = () => tagsStore.delOthersViews(selectedTag.value)
const closeAllTags = () => {
  tagsStore.delAllViews()
  router.push('/')
}
</script>

<style scoped>
.tags-view-container {
  width: 100%;
  height: 100%;
}
.tag-item {
  margin-right: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.contextmenu {
  position: fixed;
  background: var(--el-bg-color-overlay);
  z-index: 9999;
  padding: 5px 0;
  border-radius: 4px;
  list-style: none;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-lighter);
}
.contextmenu li {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
}
.contextmenu li:hover {
  background: var(--el-fill-color-light);
  color: var(--el-color-primary);
}
</style>
