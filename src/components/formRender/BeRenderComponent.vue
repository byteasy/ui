<template>
  <div class="flex-column w-full" @click.stop="$emit('click', props.formDefine)">
    <component :is="getComponent(props.formDefine.render)" :formDefine="props.formDefine"
               class="w-full"
               :model-value="props.modelValue"
               @update:modelValue="(value) => emit('update:modelValue', value)"
               ></component>
  </div>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {getComponent} from "@/util/componentLoader.ts";

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
  modelValue: Record<string, any>
}>()
const emit = defineEmits(['click', 'update:modelValue'])

const {t, locale} = useI18n()

</script>
<style scoped>
</style>
