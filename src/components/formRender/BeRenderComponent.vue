<template>
  <div class="flex-column w-full" @click.stop="$emit('click', props.formDefine)">
    <component :is="getComponent(props.formDefine.render)" :formDefine="props.formDefine"
               v-model:cascade-model="cascadeModel"
               class="w-full"
               v-model="formValue"
               ></component>
  </div>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {getComponent} from "@/util/componentLoader.ts";
import { defineModel } from 'vue';

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
const formValue = defineModel<any>('modelValue', { default: () => {} });
const cascadeModel = defineModel<any>('cascadeModel', { default: () => {} });

const emit = defineEmits(['click', 'update:modelValue'])

const {t, locale} = useI18n()
</script>
<style scoped>
</style>
