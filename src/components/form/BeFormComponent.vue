<template>
  <div class="flex-column">
    <div v-if="props.selected" class="w-full flex-row justify-content-end">
      <el-button type="primary" icon="CopyDocument" circle size="small" @click="emit('copy', props.modelValue)"/>
      <el-button type="danger" icon="Delete" circle size="small" @click="emit('delete', props.modelValue)"/>
    </div>
    <component :is="getComponent(props.modelValue.path)" :model-value="props.modelValue" :class="{ 'be-component-selected': props.selected}" @update:modelValue="value => emit('update:modelValue', value)" @selected="(value) => emit('selected', value)">
    </component>
  </div>
</template>
<script lang="ts" setup>
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    paramForm: string
    properties: object
    children: any[]
  },
  selected?: boolean
}>()
const emit = defineEmits(['copy', 'delete', 'selected', 'update:modelValue'])

const {modules} = getRouteComponents()
const {t, locale} = useI18n()

function getComponent(path) {
  return modules['..' + path]
}

</script>
<style scoped>

.be-component-selected {
  border: 1px solid;
  border-color: var(--el-color-primary-light-5);
}
</style>
