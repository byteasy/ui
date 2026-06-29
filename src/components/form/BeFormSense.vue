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
    <div class="flex-grow flex-row w-full h-full justify-content-center align-items-center designer-container">
        <div :class="{ 'w-full h-full': !isMobile, 'mobile-container': isMobile }">
          <div :class="{ 'desktop-root-rect w-full' : !isMobile, 'sense-rect-border flex-column': true, 'mobile-root-rect': isMobile}" :style="{ height: `${props.height - 126}px` }">
            <VueDraggable
              class="w-full be-material-target"
              :style="{ 'min-height': isMobile ? '730px' : (props.height ? `${props.height - 136}px` : '100vh') }"
              v-model="rootComponents"
              v-bind="$attrs" :animation="150" group="material"
              :on-add="onAdded"
              ghostClass="drag-ghost" chosenClass="drag-chosen">
              <template v-for="root in rootComponents" :key="root.id">
                <be-form-component :model-value="root" @click="onComponentClick(root)"
                                   :active="root.id === activeComponent?.id"
                                   @copy="onComponentCopy" @delete="onComponentDelete" @update:modelValue="doUpdateModelValue" />
              </template>
            </VueDraggable>
          </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {VueDraggable} from "vue-draggable-plus";
import {ref, watch} from "vue";
import BeFormComponent from "@/components/form/BeFormComponent.vue";
import {useFormEngine} from "@/stores/formEngine.ts";
import {storeToRefs} from "pinia";

const props = defineProps<{
  height: number | undefined
  modelValue: Array<any>,
}>()

const emit = defineEmits(['update', 'add', 'remove', 'selected', 'update:modelValue'])
const formEngine = useFormEngine()
const isMobile = ref(false);
const rootComponents = ref([...(props.modelValue || [])])
const { activeComponent } = storeToRefs(formEngine)

watch(() => rootComponents.value, (newVal, oldVal) => {
  const newValue = JSON.parse(JSON.stringify(newVal))
  emit('update:modelValue', newValue)
}, {
  deep: true
})

function handleDragStart(m) {
}

function handleDragEnd(m) {
}

function onAdded(event) {
}

function onComponentCopy(root) {
  const newRoot = JSON.parse(JSON.stringify(root))
  newRoot.id = newRoot.id + '-' + new Date().getTime()
  rootComponents.value.push(newRoot)
}

function onComponentDelete(root) {
  rootComponents.value = rootComponents.value.filter(item => item.id !== root.id)
}

function onComponentClick(ponent) {
  formEngine.setActiveComponent(ponent)
}

function onDragMoveHandle(event, originalEvent) {
  if (event.from.classList.contains('be-material-source') && event.to.classList.contains('be-material-target')) {
    return true;
  }
  if (event.from.classList.contains('be-material-target') && event.to.classList.contains('be-material-target')) {
    return true;
  }
  if (event.from.classList.contains('be-material-source') && event.to.classList.contains('be-material-source')) {
    return false
  }
  return false
}

function doUpdateModelValue(root) {
  const index = rootComponents.value.findIndex(item => item.id === root.id)
  if (index > -1) {
    rootComponents.value[index] = root
  }
}

defineExpose({
  handleDragStart, handleDragEnd, onDragMoveHandle
})
</script>
<style scoped>
.designer-container {
  overflow-y: auto;
  overflow-x: hidden;
}

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
}

.desktop-root-rect {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
