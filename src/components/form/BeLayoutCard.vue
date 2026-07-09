<template>
  <div class="w-full drag-container-border">
    <div :style="props.modelValue.properties.marginStyle">
      <el-card :style="renderCss(props.modelValue.properties)">
        <template #header>
          <div class="card-header">
            <span>{{ getLangText(props.modelValue.properties.title || "{\"zh_CN\":\"标题\",\"en\":\"title\"}", locale) }}</span>
          </div>
        </template>
        <VueDraggable class="w-full h-full be-material-target sense-rect-border flex-column drag-rect-border"
                      v-model="children"
                      v-bind="$attrs" :animation="150" group="material"
                      ghostClass="drag-ghost" chosenClass="drag-chosen">
          <template v-for="root in children" :key="root.id">
            <be-form-component :model-value="root" @click="onComponentClick(root)"
                               @copy="onComponentCopy(root)" @delete="onComponentDelete(root)"
                               :active="root.id === activeComponent?.id" class="w-full"
                               @update:modelValue="value => updateChildrenValue(value)"/>
          </template>
        </VueDraggable>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch} from 'vue'
import {VueDraggable} from "vue-draggable-plus";
import BeFormComponent from "@/components/form/BeFormComponent.vue";
import {useFormEngine} from "@/stores/formEngine.ts";
import {storeToRefs} from "pinia";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";

const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  }
}>()

const formEngine = useFormEngine()
const children = ref([...(props.modelValue.children || [])])
const emit = defineEmits(['selected', 'update:modelValue'])
const {activeComponent} = storeToRefs(formEngine)
const {t, locale} = useI18n()

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
  if (root.id === activeComponent.value?.id) {
    formEngine.setActiveComponent(null)
  }
}

watch(() => children.value, (newVal, oldVal) => {
    doUpdateModelValue()
  },
  {deep: true})

watch(
  () => {
    return JSON.stringify(collectAllPropsNodes(props.modelValue.children)
    )
  },
  () => {
    children.value = props.modelValue.children
  }
)

function collectAllPropsNodes(list: any[]): Array<{ id: string; properties: any }> {
  const result: Array<{ id: string; properties: any }> = []
  if (!Array.isArray(list)) return result

  for (const node of list) {
    result.push({
      id: node.id,
      properties: node.properties
    })
    result.push(...collectAllPropsNodes(node.children))
  }
  return result
}

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
.drag-rect-border {
  min-height: 100px;
  border: 1px dashed var(--el-color-info);
}
.drag-container-border {
  border: 1px dashed var(--el-color-primary);
}
</style>
