<template>
  <div class="w-full" :style="{ height: props.height ? `${props.height - 60}px !important` : '100vh !important' }">
    <el-splitter class="flex-row w-full h-full" >
      <el-splitter-panel class="p-1" size="300" collapsible>
        <BeMaterialContainer ref="refMaterialContainer" @drag-start="onMaterialDrapStart" @drag-end="onMaterialDrapEnd" :on-move-handle="onDragMoveHandle"/>
      </el-splitter-panel>
      <el-splitter-panel class="p-1">
        <BeFormSense ref="refFormSense" :height="props.height"/>
      </el-splitter-panel>
      <el-splitter-panel class="p-1" size="300" collapsible>
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>
<script setup lang="ts">
import BeFormSense from "@/components/form/BeFormSense.vue";
import BeMaterialContainer from "@/components/form/BeMaterialContainer.vue";
import {ref} from "vue";

const props = defineProps<{
  height?: number
}>()

console.log('', props.height)
const refMaterialContainer = ref(null);
const refFormSense = ref(null);

function onMaterialDrapStart(event) {
  refFormSense.value.handleDragStart(event.data)
}

function onMaterialDrapEnd(event) {
  refFormSense.value.handleDragEnd(event.data)
}

function onDragMoveHandle(event, originalEvent) {
  refFormSense.value.onDragMoveHandle(event, originalEvent)
}
</script>
