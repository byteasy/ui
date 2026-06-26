<template>
  <div class="flex-column w-full el-card h-full">
    <div class="w-full flex-row p-2 align-items-center gap-1" style="border-bottom: 1px solid var(--el-border-color);">
      <el-button-group direction="horizontal">
        <el-button type="primary" ><el-icon size="24"><IconLocalDesktop /></el-icon></el-button>
        <el-button type="primary" ><el-icon size="24"><IconLocalMobile /></el-icon></el-button>
      </el-button-group>
    </div>
    <VueDraggable class="flex-row flex-wrap p-2" v-model="componentGroups" v-bind="$attrs" :animation="150" group="material"
                  ghostClass="ghost">
        {{componentGroups}}
    </VueDraggable>
  </div>
</template>
<script setup lang="ts">
import {VueDraggable} from "vue-draggable-plus";
import {ref} from "vue";
defineEmits(['update', 'add', 'remove'])

const componentGroups = ref([])

function handleDragStart(m) {
  // componentGroups.value.push(m)
}
function handleDragEnd(m) {
  // componentGroups.value.push(m)
}

defineExpose({
  handleDragStart, handleDragEnd
})
</script>
<style scoped>
.forbidden-area {
  cursor: not-allowed !important;
}
/* 正常可拖拽样式 */
.drag-item {
  cursor: grab;
}
.sortable-drag {
  cursor: grabbing !important;
}
</style>
