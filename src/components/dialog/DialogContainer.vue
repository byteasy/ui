<!-- DialogContainer.vue 最简化版本 -->
<template>
  <Teleport to="body">
    <el-config-provider :locale="locale" :size="componentSize as any">
      <div v-for="item in modals" :key="String(item.id)" class="my-bg-color-blank">
        <el-dialog
          v-if="item.dialogModel"
          v-model="item.visible"
          :title="item.title"
          :width="item.width"
          :draggable="item.draggable"
          :close-on-click-modal="item.closeOnClickModal"
          :fullscreen="item.fullscreen"
          @close="handleClose(item.id)"
          :show-close="false"
          destroy-on-close
          append-to-body
          body-class="my-bg-color-blank"
          align-center>
          <template #header="{ close, titleId, titleClass }">
            <div class="flex-row w-full">
              <div class="flex-grow">
                <el-icon class="my-icon-color-primary cursor-pointer">
                  <Document/>
                </el-icon>
                <el-text style="font-size: var(--el-font-size-large)" class="ml-2 font-bold">
                  {{ item.title }}
                </el-text>
              </div>
              <div class="flex-none">
                <el-icon class="my-icon-color-primary cursor-pointer"
                         @click="onFullscreenClick(item)">
                  <FullScreen/>
                </el-icon>
                <el-icon class="ml-2 my-icon-color-primary cursor-pointer" @click="close()"
                         style="">
                  <Close/>
                </el-icon>
              </div>
            </div>
          </template>
          <el-scrollbar always class="w-full" max-height="75vh">
            <component :is="item.component" v-bind="item.props" @close="(data) => handleClose(item.id, data)" class="p-3 my-bg-color-blank"/> </el-scrollbar>
        </el-dialog>
        <el-drawer
          v-else
          v-model="item.visible"
          :title="item.title"
          :size="item.width"
          :resizable="item.draggable"
          :close-on-click-modal="item.closeOnClickModal"
          body-class="my-bg-color-blank"
          @close="handleClose(item.id)"
          :direction="item.direction"
        >
          <component ref="componentRef" :is="item.component" v-bind="item.props"
                     @close="(data) => handleClose(item.id, data)"/>
        </el-drawer>
      </div>
    </el-config-provider>
  </Teleport>
</template>

<script setup lang="ts">
import {useModal} from './useModal.ts'
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {elementLocales} from '@/locales/common.ts'

const appSettingsStore = useAppSettingsStore()
const componentRef = ref(null)

const {componentSize, lang} = storeToRefs(appSettingsStore)

const locale = computed(() => elementLocales[lang.value])

const {modals, close} = useModal()

// 添加调试
console.log('DialogContainer 渲染，弹窗数量：', modals.length)

const handleClose = (id: symbol, data?: unknown) => {
  console.log('关闭弹窗：', id, data)
  close(id, data)
}

function onFullscreenClick(item) {
  if (item.fullscreen === true) {
    item.fullscreen = false
  } else {
    item.fullscreen = true
  }
  item.props.fullscreen = item.fullscreen
}
</script>
