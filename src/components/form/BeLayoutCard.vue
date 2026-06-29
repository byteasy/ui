<template>
  <el-card class="w-full be-card-min-height">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
      </div>
    </template>
    <VueDraggable class="w-full h-full p-2 be-material-target sense-rect-border flex-column" v-model="children"
                  v-bind="$attrs" :animation="150" group="material"
                  :on-add="doUpdateModelValue"
                  :on-change="doUpdateModelValue"
                  ghostClass="drag-ghost" chosenClass="drag-chosen">
      <template v-for="root in children" :key="root.id">
        <be-form-component :model-value="root"  @click="onComponentClick(root)" :selected="root.id === selectedComponent?.id" @copy="onComponentCopy(root)" @delete="onComponentDelete(root)"/>
      </template>
    </VueDraggable>
    <template #footer>Footer content</template>
  </el-card>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {VueDraggable} from "vue-draggable-plus";
import BeFormComponent from "@/components/form/BeFormComponent.vue";
const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    paramForm: string
    properties: object
    children: any[]
  }
}>()

const children = ref([...(props.modelValue.children || [])])
const emit = defineEmits(['selected', 'update:modelValue'])
const selectedComponent = ref(undefined)

function onComponentClick(ponent) {
  emit('selected', ponent)
  selectedComponent.value = ponent
}

function onComponentCopy(root) {
  const newRoot = JSON.parse(JSON.stringify(root))
  newRoot.id = newRoot.id + '-' + new Date().getTime()
  children.value.push(newRoot)
  doUpdateModelValue()
}

function onComponentDelete(root) {
  const index = children.value.findIndex(item => item.id === root.id)
  if (index > -1) {
    // 删除数组对应项
    children.value.splice(index, 1)
    // 如果当前选中的就是被删除的组件，清空选中状态
    if (selectedComponent.value?.id === root.id) {
      selectedComponent.value = undefined
    }
    doUpdateModelValue()
  }
}

function doUpdateModelValue() {
  const newValue = JSON.parse(JSON.stringify(props.modelValue))
  newValue.children = children.value
  emit('update:modelValue', newValue)
}
</script>
<style scoped>
.be-card-min-height {
  min-height: 100px;
}
</style>
