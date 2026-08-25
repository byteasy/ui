<template>
  <div class="flex-column w-full" @click.stop="$emit('click', modelValue)">
    <div style="position: relative;" class="w-full h-full">
      <div v-if="props.active" class="w-full flex-row justify-content-end"
           style="position: absolute; top: 4px; right: 4px; z-index: 10;">
        <el-button type="primary" icon="CopyDocument" circle size="small"
                   @click="emit('copy', props.modelValue)"/>
        <el-button type="danger" icon="Delete" circle size="small"
                   @click="emit('delete', props.modelValue)"/>
      </div>
      <component :is="getComponent(props.modelValue.path)" :model-value="props.modelValue"
                 :class="{ 'be-component-selected': props.active}"
                 @update:modelValue="value => emit('update:modelValue', value)">
      </component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {getComponent} from "@/util/componentLoader.ts";

const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  },
  active?: boolean
}>()
const emit = defineEmits(['click', 'copy', 'delete', 'selected', 'update:modelValue'])

const {t, locale} = useI18n()

</script>
<style scoped>

.be-component-selected {
  border: 2px solid !important;
  border-color: var(--el-color-success) !important;
}
</style>
