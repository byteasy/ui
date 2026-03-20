<template>
  <el-splitter>
    <el-splitter-panel
      size="220"
      collapsible
      :min="80"
      :max="220"
      @update:size="onLeftMenuSizeUpdate"
    >
      <div class="mt-1">
        <common-left-menu ref="refLeftMenu" v-if="route.fullPath.startsWith('/platformCommon')"></common-left-menu>
        <left-menu ref="refLeftMenu" v-else></left-menu>
      </div>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <div class="pl-1 pt-1 pr-1 w-full h-full my-bg-color-blank" >
        <div class="flex-column h-full w-full">
          <div class="el-card is-always-shadow p-1" style="height: 2.4rem; width: 100%">
            <bread-crumb v-if="tagView === '0'" />
            <tag-view v-else />
          </div>
          <div
            class="el-card is-always-shadow p-2 mt-1 flex-grow"
            style="width: 100%;">
            <div class="h-full" >
              <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                  <keep-alive :include="tagsStore.cachedViews">
                    <component :is="Component" :key="$route.path" />
                  </keep-alive>
                </transition>
              </router-view>
            </div>
          </div>
        </div>
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import LeftMenu from '@/views/layout/LeftMenu.vue'
import CommonLeftMenu from '@/views/layout/CommonLeftMenu.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'
import TagView from '@/components/TagView.vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useTagsViewStore } from '@/stores/tagsView'
import { useRoute } from 'vue-router'

const appSettingsStore = useAppSettingsStore()
const tagsStore = useTagsViewStore()
const { tagView } = storeToRefs(appSettingsStore)
const refLeftMenu = ref()
const route = useRoute()

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
