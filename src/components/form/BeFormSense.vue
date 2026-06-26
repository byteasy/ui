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
    <div class="flex-grow flex-row w-full h-full justify-content-center align-items-center ">
      <div :class="{ 'w-full h-full flex-row w-full h-full justify-content-center align-items-center': !isMobile, 'mobile-container': isMobile }">
        <VueDraggable :class="{'w-full h-full p-2': !isMobile, 'be-material-target sense-rect-border': true, 'mobile-root-rect': isMobile }" v-model="rootComponents"
                      v-bind="$attrs" :animation="150" group="material"
                      ghostClass="ghost">
          <div v-for="com in rootComponents" :key="com.id"> {{ com.name }}</div>
        </VueDraggable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {VueDraggable} from "vue-draggable-plus";
import {ref} from "vue";

defineEmits(['update', 'add', 'remove'])

const isMobile = ref(false);
const rootComponents = ref([])

function handleDragStart(m) {
  // rootComponents.value.push(m)
}

function handleDragEnd(m) {
  // rootComponents.value.push(m)
}

defineExpose({
  handleDragStart, handleDragEnd
})
</script>
<style scoped>

.mobile-container {
  width:  459px !important;
  height: 945px !important;
  background-image: url('@/assets/img/bgIphone.svg');;
}

.mobile-root-rect {
  margin-left: 24px;
  margin-top: 100px;
  width: 414px !important;
  height: 736px !important;
}

.sense-rect-border {
  border: 1px solid;
  border-color: var(--el-color-primary);
}

</style>
