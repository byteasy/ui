<template>
  <el-card class="w-full be-card-min-height">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
      </div>
    </template>
    <VueDraggable class="w-full h-full p-2 be-material-target sense-rect-border flex-column"
                  v-model="children"
                  v-bind="$attrs" :animation="150" group="material"
                  ghostClass="drag-ghost" chosenClass="drag-chosen">
      <template v-for="root in children" :key="root.id">
        <be-form-component :model-value="root" @click="onComponentClick(root)"
                           @copy="onComponentCopy(root)" @delete="onComponentDelete(root)"
                           :active="root.id === activeComponent?.id" class="w-full" @update:modelValue="value => updateChildrenValue(value)"/>
      </template>
    </VueDraggable>
    <template #footer>Footer content</template>
  </el-card>
</template>
<script lang="ts" setup>
import {ref, watch} from 'vue'
import {VueDraggable} from "vue-draggable-plus";
import BeFormComponent from "@/components/form/BeFormComponent.vue";
import {useFormEngine} from "@/stores/formEngine.ts";
import {storeToRefs} from "pinia";

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

const formEngine = useFormEngine()
const children = ref([...(props.modelValue.children || [])])
const emit = defineEmits(['selected', 'update:modelValue'])
const {activeComponent} = storeToRefs(formEngine)

function onComponentClick(ponent) {
  formEngine.setActiveComponent(ponent)
}

function onComponentCopy(root) {
  const newRoot = JSON.parse(JSON.stringify(root))
  newRoot.id = newRoot.id + '-' + new Date().getTime()
  children.value.push(newRoot)
}

function onComponentDelete(root) {
  children.value = children.value.filter(item => item.id !== root.id)
}

watch(() => children.value, (newVal, oldVal) => {
  doUpdateModelValue()
  },
  {deep: true})

function doUpdateModelValue() {
  const newValue = JSON.parse(JSON.stringify(props.modelValue))
  newValue.children = children.value
  emit('update:modelValue', newValue)
}

function updateChildrenValue(child) {
  const index = children.value.findIndex(item => item.id === child.id)
  if (index > -1) {
    children.value[index] = child
  }
  doUpdateModelValue()
}
</script>
<style scoped>
.be-card-min-height {
  min-height: 100px;
}
</style>
