<template>
  <div class="flex-column w-full el-card h-full">
    <div class="w-full flex-row p-2 align-items-center gap-1"
         style="border-bottom: 1px solid var(--el-border-color);">
      <el-button-group direction="horizontal">
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
    </div>
    <div class="flex-grow flex-row w-full h-full justify-content-center align-items-center">
      <div :class="{ 'w-full h-full': !isMobile, 'mobile-container': isMobile }">
        <div :class="{ 'desktop-root-rect w-full' : !isMobile, 'sense-rect-border flex-column': true, 'mobile-root-rect': isMobile}" :style="{ height: `${props.height - 126}px` }">
          <VueDraggable
            class="w-full be-material-target"
            style="min-height: 400px;width: 100% !important;"
            v-model="rootComponents"
            v-bind="$attrs" :animation="150" group="material"
            ghostClass="drag-ghost" chosenClass="drag-chosen">
            <template v-for="root in rootComponents" :key="root.uuid">
              <be-form-component :meta="root" v-model="root.childrenList" :props-value="root.propsValue"/>
            </template>
          </VueDraggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {VueDraggable} from "vue-draggable-plus";
import {ref} from "vue";
import BeFormComponent from "@/components/form/BeFormComponent.vue";

const props = defineProps<{
  height: number
}>()

defineEmits(['update', 'add', 'remove'])

const isMobile = ref(false);
const rootComponents = ref([])

function handleDragStart(m) {
  m.uuid = m.id + '-' + new Date().getTime();
}

function handleDragEnd(m) {
}

function onDragMoveHandle(event, originalEvent) {
  if (event.from.classList.contains('be-material-source') && event.to.classList.contains('be-material-target')) {
    console.log(event)
    return true;
  }
  if (event.from.classList.contains('be-material-source') && event.to.classList.contains('be-material-source')) {
    return false
  }
  return false
}

defineExpose({
  handleDragStart, handleDragEnd, onDragMoveHandle
})
</script>
<style scoped>

.mobile-container {
  width: 459px !important;
  height: 945px !important;
  background-image: url('@/assets/img/bgIphone.svg');;
}

.mobile-root-rect {
  margin-left: 24px;
  margin-top: 100px;
  width: 414px !important;
  height: 736px !important;
  overflow-y: auto;
  overflow-x: hidden;
}

.sense-rect-border {
  border: 1px solid;
  border-color: var(--el-color-success);
}

.desktop-root-rect {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
