<template>
  <el-splitter>
    <el-splitter-panel size="220" collapsible :min="80" :max="220" @update:size="onLeftMenuSizeUpdate">
      <div class="mt-1">
        <left-menu ref="refLeftMenu"></left-menu>
      </div>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <div class="flex-column ml-1 mt-1 mr-1">
        <div class="el-card is-always-shadow p-1" style="height: 2.8rem; width: 100%">
          <bread-crumb v-if="tagView === '0'" />
          <tag-view v-else />
        </div>
        <div class="el-card is-always-shadow p-2 mt-1" style="width: 100%">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition>
          </router-view>
        </div>
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import LeftMenu from '@/views/layout/LeftMenu.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import TagView from '@/components/TagView.vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { tagView } = storeToRefs(appSettingsStore)
const refLeftMenu = ref()

function onLeftMenuSizeUpdate(size) {
  refLeftMenu.value.closeOrOpenMenu(size)
}
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 保持页面切换时的滚动位置 */
.router-view-container {
  min-height: 100%;
}
</style>
