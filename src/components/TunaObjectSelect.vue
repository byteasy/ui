<template>
  <el-input ref="refInput"
            :model-value="getLangText(selectedObject[props.column.externalClassDisplayField || 'name'], locale)"
            readonly v-bind="bindAttrs">
    <template #append>
      <el-icon :class="{'my-icon-color-primary': true, 'cursor-pointer': !bindAttrs.disabled }"
               @click="onAppendIconClick">
        <IconLocalSelect/>
      </el-icon>
    </template>
  </el-input>
</template>

<script setup lang="ts">

import {defineExpose, ref, useAttrs} from 'vue'
import {useModal} from '@/components/dialog/useModal.ts'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import {doHttpGet} from "@/api/common/platform";
import TunaObjectSelectDetail from "@/components/TunaObjectSelectDetail.vue";

const props = defineProps<{
  modelValue?: any
  lang?: string
  column: {
    className: string
    name: string
    displayName: string
    type: string // 若值固定（如 STRING/Number），可改为 "STRING" | "NUMBER" 限定
    typeClassName: string
    isShow: 'YES' | 'NO' // 枚举值用联合类型限定
    isSort: 'YES' | 'NO'
    isOverflow: 'YES' | 'NO'
    isSearch: 'YES' | 'NO'
    isFixed: 'YES' | 'NO'
    isRequire: 'YES' | 'NO'
    isForm: 'YES' | 'NO'
    align: 'LEFT' | 'CENTER' | 'RIGHT' // 对齐方式限定
    width: number
    showOrder: number
    minLength: number
    maxLength: number
    min: number
    max: number
    precision: number
    multiple: 'YES' | 'NO'
    relationType: 'EXTERNAL_KEY' | 'DETAIL_TABLE' | null | undefined
    externalClass: any
    externalClassPrimaryField: any
    externalClassDisplayField: any
    uiComponent: 'SELECT' | 'RADIO' | 'TABLE'
  }
}>()

const {open} = useModal()
const {t, locale} = useI18n()
const refInput = ref(null)
const bindAttrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()
const selectedObject = ref({})

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.column.externalClass, {}).then(response => {
    const entityDefine = response
    open(
      TunaObjectSelectDetail,
      {
        modelValue: selectedObject.value[props.column.externalClassPrimaryField || 'name'],
        column: props.column,
        entityDefine: entityDefine,
      },
      {
        title: getLangText(entityDefine.name, locale),
        width: '60%',
        dialogModel: true,
        onClose: (data) => {
          if (data) {
            selectedObject.value = data
            emit('update:modelValue', data[props.column.externalClassPrimaryField])
            emit('change', data[props.column.externalClassPrimaryField])
          }
        },
      },
    )
  })
}

defineExpose({})
</script>
