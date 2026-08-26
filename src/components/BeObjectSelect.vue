<template>
  <el-input ref="refInput" :model-value="getDisplayName()" clearable @clear="onClearClick"
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

import {defineExpose, defineModel, onMounted, ref, useAttrs, watch} from 'vue'
import {useModal} from '@/components/dialog/useModal.ts'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import {doHttpGet, getEntityDefine} from "@/api/common/platform";
import BeObjectSelectDetail from "@/components/BeObjectSelectDetail.vue";
import type {BeColumn} from "@/components/BeTable.ts";

const props = defineProps<{
  lang?: string
  column: BeColumn
}>()

const {open} = useModal()
const {t, locale} = useI18n()
const refInput = ref(null)
const bindAttrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()
const formModel = defineModel<any>('formModel', {default: () => ({})})
const selectedObject = ref([])

onMounted(() => {
  initDisplayName()
})

const initDisplayName = () => {
  if (formModel.value !== undefined && formModel.value !== '' && formModel.value !== null) {
    if (!Array.isArray(formModel.value) || formModel.value.length === 1) {
      getEntityDefine(props.column.externalClass).then(response => {
        const url = response.serviceInstance.contextPath + '/sapi/common/' + props.column.externalClass
        const queryObj = {}
        queryObj[props.column.externalClassPrimaryField] = formModel.value
        queryObj[props.column.externalClassPrimaryField + 'QueryType'] = 'eq'
        Object.assign(queryObj, genQueryParams())
        console.log('BeObjectSelect.vue query', queryObj)
        doHttpGet(url, queryObj).then(objResponse => {
          selectedObject.value = objResponse.data.records
        })
      })
    }
  }
}

watch(() => formModel.value, () => {
  initDisplayName()
})

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return
  console.log('onAppendIconClick', formModel.value)
  getEntityDefine(props.column.externalClass).then(response => {
    const entityDefine = response
    open(
      BeObjectSelectDetail,
      {
        modelValue: props.column.multiple === 'YES' ? selectedObject.value.map(s => s[props.column.externalClassPrimaryField]) : selectedObject.value.map(s => s[props.column.externalClassPrimaryField])[0],
        column: props.column,
        entityDefine: entityDefine,
        formModel: formModel.value
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
              emit('update:modelValue', data.map(s => s[props.column.externalClassPrimaryField]))
              emit('change', data.map(s => s[props.column.externalClassPrimaryField]))
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

function genQueryParams() {
  const result = {}
  if (props.column.extrasParams) {
    const extrasParams = JSON.parse(props.column.extrasParams)
    for (const param of extrasParams) {
      const targetName = param.targetName || param.name
      result[targetName] = formModel.value[param.name]
      result[param.name + 'QueryType'] = param.type
      result[param.name + 'Readonly'] = param.readonly
    }
  }
  return result
}

defineExpose({})
</script>
