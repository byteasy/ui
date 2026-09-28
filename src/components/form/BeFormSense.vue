<template>
  <div class="flex-column w-full el-card h-full">
    <div
      class="w-full flex-row p-2 align-items-center gap-1"
      style="border-bottom: 1px solid var(--el-border-color)"
    >
      <el-button-group direction="horizontal" class="flex-none">
        <el-button type="primary" @click="(evt) => (isMobile = false)" :disabled="!isMobile">
          <el-icon size="24">
            <IconLocalDesktop />
          </el-icon>
        </el-button>
        <el-button type="primary" @click="(evt) => (isMobile = true)" :disabled="isMobile">
          <el-icon size="24">
            <IconLocalMobile />
          </el-icon>
        </el-button>
      </el-button-group>
      <div class="flex-row flex-grow justify-content-end align-items-end">
        <el-button-group direction="horizontal" class="flex-none">
          <el-button type="primary" text :disabled="!isPlay" @click="doPlayStoped">
            <el-icon size="24"><VideoPause /></el-icon>
          </el-button>
          <el-button type="primary" text :disabled="isPlay" @click="doPlay">
            <el-icon size="24"><VideoPlay /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div
      class="flex-grow flex-row w-full h-full justify-content-center align-items-center designer-container"
    >
      <div :class="{ 'w-full h-full': !isMobile, 'mobile-container': isMobile }">
        <div
          :class="{
            'desktop-root-rect w-full': !isMobile,
            'sense-rect-border flex-column': true,
            'mobile-root-rect': isMobile,
          }"
          :style="{ height: `${props.height - 126}px` }"
        >
          <VueDraggable
            class="w-full be-material-target"
            :style="{
              'min-height': isMobile ? '730px' : props.height ? `${props.height - 136}px` : '100vh',
            }"
            v-model="rootComponents"
            v-bind="$attrs"
            :animation="150"
            group="material"
            :on-add="onAdded"
            ghostClass="drag-ghost"
            chosenClass="drag-chosen"
          >
            <template v-for="root in rootComponents" :key="root.id">
              <be-form-component
                :model-value="root"
                @click="onComponentClick(root)"
                :active="root.id === activeComponent?.id"
                @copy="onComponentCopy"
                @delete="onComponentDelete"
                @update:modelValue="doUpdateModelValue"
              />
            </template>
          </VueDraggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import { defineModel, ref, watch } from 'vue';
import BeFormComponent from '@/components/form/BeFormComponent.vue';
import { useFormEngine } from '@/stores/formEngine.ts';
import { storeToRefs } from 'pinia';
import { VideoPlay } from '@element-plus/icons-vue';

const props = defineProps<{
  height: number | undefined;
}>();

const emit = defineEmits([
  'update',
  'add',
  'remove',
  'selected',
  'update:modelValue',
  'playStart',
  'playStoped',
]);
const formEngine = useFormEngine();
const isMobile = ref(false);
const isPlay = ref(false);

const rootComponents = defineModel<any>('rootComponents', { default: () => ([]) });
const { activeComponent } = storeToRefs(formEngine);

function handleDragStart(m) {}

function handleDragEnd(m) {}

function onAdded(event) {}

function onComponentCopy(root) {
  const newRoot = JSON.parse(JSON.stringify(root));
  newRoot.id = newRoot.id + '-' + new Date().getTime();
  rootComponents.value.push(newRoot);
}

function onComponentDelete(root) {
  rootComponents.value = rootComponents.value.filter((item) => item.id !== root.id);
  if (root.id === activeComponent?.value.id) {
    formEngine.setActiveComponent(null);
  }
}

function onComponentClick(ponent) {
  formEngine.setActiveComponent(ponent);
}

function onDragMoveHandle(event, originalEvent) {
  if (
    event.from.classList.contains('be-material-source') &&
    event.to.classList.contains('be-material-target')
  ) {
    return true;
  }
  if (
    event.from.classList.contains('be-material-target') &&
    event.to.classList.contains('be-material-target')
  ) {
    return true;
  }
  if (
    event.from.classList.contains('be-material-source') &&
    event.to.classList.contains('be-material-source')
  ) {
    return false;
  }
  return false;
}

function doUpdateModelValue(root) {
  const index = rootComponents.value.findIndex((item) => item.id === root.id);
  if (index > -1) {
    rootComponents.value[index] = root;
  }
}

function updateComponentProperties() {
  rootComponents.value = [...(props.modelValue || [])];
}

function doPlay() {
  isPlay.value = true;
  emit('playStart');
}

function doPlayStoped() {
  isPlay.value = false;
  emit('playStoped');
}

defineExpose({
  handleDragStart,
  handleDragEnd,
  onDragMoveHandle,
  updateComponentProperties,
});
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
  /* 百分比是相对于父容器宽高 */
  left: 8%; /* 距离父左侧8%宽度 */
  top: 10%; /* 距离父顶部16%高度 */
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
