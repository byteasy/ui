<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle" class="w-full">
      <el-row :style="renderCss(props.formDefine.properties)" :gutter="props.formDefine.properties.gutter" :justify="props.formDefine.properties.justify" :align="props.formDefine.properties.align">
        <template v-for="root in children" :key="root.id">
          <el-col :span="root.properties.colSpan" :offset="root.properties.leftColSpan" :push="root.properties.pushSpan" :pull="root.properties.pullSpan">
            <be-render-component class="w-full" :form-define="root" :model-value="props.modelValue"
                                 @update:modelValue="(value) => emit('update:modelValue', value)"/>
          </el-col>
        </template>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";

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

const children = ref([...(props.formDefine.children || [])])
const emit = defineEmits(['selected', 'update:modelValue'])
const {t, locale} = useI18n()


</script>
