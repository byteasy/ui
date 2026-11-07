<template>
  <div class="flex-column w-full el-card h-full">
    <div class="w-full flex-row p-2 align-items-center gap-1"
         style="border-bottom: 1px solid var(--el-border-color);">
      <el-button-group direction="horizontal" class="flex-none">
        <el-button type="primary" @click="evt => isMobile = false" :disabled="!isMobile">
          <el-icon size="24">
            <IconLocalDesktop/>
          </el-icon>
        </el-button>
        <el-button type="primary" @click="evt => isMobile = true" :disabled="isMobile">
          <el-icon size="24">
            <IconLocalMobile/>
          </el-icon>
        </el-button>
      </el-button-group>
      <div class="flex-row flex-grow justify-content-end align-items-end">
        <el-button-group direction="horizontal" class="flex-none">
          <el-button type="primary" text :disabled="!isPlay" @click="doPlayStoped">
            <el-icon size="24">
              <VideoPause/>
            </el-icon>
          </el-button>
          <el-button type="primary" text :disabled="isPlay" @click="doPlay">
            <el-icon size="24">
              <VideoPlay/>
            </el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div
      class="flex-grow flex-row w-full h-full justify-content-center align-items-center designer-container">
      <div :class="{ 'w-full h-full': !isMobile, 'mobile-container': isMobile }">
        <div
          :class="{ 'desktop-root-rect w-full' : !isMobile, 'sense-rect-border flex-column': true, 'mobile-root-rect': isMobile}"
          :style="{ height: `${props.height - 126}px` }">
          <be-page-render :form-define="props.modelValue" :height="props.height" v-model="testFormValue"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {VideoPlay} from "@element-plus/icons-vue";

const props = defineProps<{
  height: number | undefined
  modelValue: Array<any>,
}>()

const emit = defineEmits(['playStart', 'playStoped'])
const isMobile = ref(false);
const isPlay = ref(true);
const testFormValue = ref({})

function doPlay() {
  isPlay.value = true
  emit("playStart")
}

function doPlayStoped() {
  isPlay.value = false
  emit("playStoped")
}

defineExpose({
})
</script>
<style scoped>
.designer-container {
  overflow-y: auto;
  overflow-x: hidden;
}

.mobile-container {
  position: relative; /* 关键 */
  width: calc(0.5 * 60vh) !important;
  height: 60vh !important;
  background-image: url('@/assets/img/bgIphone.svg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.mobile-root-rect {
  position: absolute;
  left: 8%;
  top: 10%;
  right: 8%;
  bottom: 10%;
  width: auto !important;
  height: auto !important;
  overflow-y: auto;
  overflow-x: hidden;
}

.desktop-root-rect {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
