<template>
  <el-input ref="refInput"
            :model-value="getDisplayName()"
            clearable
            @clear="onClearClick"
            v-bind="bindAttrs">
    <template #append>
      <el-icon :class="{'my-icon-color-primary': true, 'cursor-pointer': !bindAttrs.disabled }"
               @click="onAppendIconClick">
        <IconLocalSelect/>
      </el-icon>
    </template>
  </el-input>
</template>

<script setup lang="ts">

import {defineExpose, onMounted, ref, useAttrs} from 'vue'
import {useModal} from '@/components/dialog/useModal.ts'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import {doHttpGet} from "@/api/common/platform";
import BeObjectSelectDetail from "@/components/BeObjectSelectDetail.vue";

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
  queryMode?: boolean
}>()

const {open} = useModal()
const {t, locale} = useI18n()
const refInput = ref(null)
const bindAttrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()
const selectedObject = ref([])

onMounted(() => {
  console.log(props.modelValue)
  if (props.modelValue !== undefined && props.modelValue !== '') {
    if (!Array.isArray(props.modelValue) || props.modelValue.length === 1) {
      doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.column.externalClass, {}).then(response => {
        const url = response.serviceInstance.contextPath + '/sapi/common/' + props.column.externalClass
        const queryObj = {}
        queryObj[props.column.externalClassPrimaryField] = props.modelValue
        queryObj[props.column.externalClassPrimaryField + 'QueryType'] = 'eq'
        doHttpGet(url, queryObj).then(objResponse => {
          selectedObject.value = objResponse.data.records
        })
      })
    }
  }
})

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.column.externalClass, {}).then(response => {
    const entityDefine = response
    open(
      BeObjectSelectDetail,
      {
        modelValue: props.column.multiple === 'YES' ? selectedObject.value.map(s => s[props.column.externalClassPrimaryField]) : selectedObject.value.map(s => s[props.column.externalClassPrimaryField])[0],
        column: props.column,
        queryMode: props.queryMode,
        entityDefine: entityDefine,
      },
      {
        title: getLangText(entityDefine.name, locale),
        width: '60%',
        dialogModel: true,
        onClose: (data) => {
          if (data) {
            if (Array.isArray(data)) {
              selectedObject.value = data
            } else {
              selectedObject.value = [data]
            }
            if (props.column.multiple === 'NO') {
              emit('update:modelValue', data[props.column.externalClassPrimaryField])
              emit('change', data[props.column.externalClassPrimaryField])
            } else {
              if (data.length < 1) {
                onClearClick()
              } else {
                emit('update:modelValue', data.map(s => s[props.column.externalClassPrimaryField]))
                emit('change', data.map(s => s[props.column.externalClassPrimaryField]))
              }
            }
          }
        },
      },
    )
  })
}

const onClearClick = () => {
  selectedObject.value = []
  emit('update:modelValue', '')
  emit('change', '')
}

function getDisplayName() {
  const names = selectedObject.value.map(s => getLangText(s[props.column.externalClassDisplayField || 'name'], locale.value))
  return names.join(', ')
}

defineExpose({})
</script>
