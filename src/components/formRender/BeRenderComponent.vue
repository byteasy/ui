<template>
  <div class="flex-column w-full" @click.stop="$emit('click', props.formDefine)">
    <component :is="getComponent(props.formDefine.render)" :form-define="props.formDefine"
               @update:modelValue="value => emit('update:modelValue', value)"></component>
  </div>
</template>
<script lang="ts" setup>
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  formDefine: {
    id: string
    name: string
    path: string
    render: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  },
}>()
const emit = defineEmits(['click', 'copy', 'delete', 'selected', 'update:modelValue'])

const {modules} = getRouteComponents()
const {t, locale} = useI18n()

function getComponent(path) {
  return modules['..' + path]
}

</script>
<style scoped>
</style>
