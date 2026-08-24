<template>
  <div class="form-container"
       :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
       style="container-type: inline-size;">
    <div :style="{ 'height': tableHeight }" class="w-full">
      <be-std-page-layout ref="refTable" class="w-full h-full"
                          :class-name="props.column.externalClass"
                          :query-params="queryParams"
                          :query-mode="props.queryMode"
                          :multiple="props.column.multiple === 'YES'"
                          :row-db-click="onTableRowDoubleClick"
                          :data-render-finish="onTableDataRenderFinish"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, defineEmits, defineExpose, defineModel, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import BeStdPageLayout from "@/views/template/BeStdPageLayout.vue";

const props = defineProps<{
  modelValue: any
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
    extrasParams: string
  }
  fullscreen?: boolean
  isDrawer?: boolean
  queryMode?: boolean
}>()
const refTable = ref(null)
const emit = defineEmits(['close'])
const queryParams = ref({current: 1, size: 20})
const selectedKey = ref(props.modelValue)
const formModel = defineModel<any>('formModel', {default: () => ({})})
const {t, locale} = useI18n()

onMounted(() => {
  Object.assign(queryParams.value, genQueryParams())
})

const tableHeight = computed({
  get() {
    return props.fullscreen === true ? 'calc(100vh - 200px)' : 'calc(55vh - 100px)'
  },
  set() {
  }
})

function onSaveClick() {
  // 表格选择模式
  selectedKey.value = refTable.value?.getSelectionRows().map(e => e[props.column.externalClassPrimaryField])
  if (props.column.multiple === 'NO') {
    const selObj = refTable.value?.getSelectionRows()[0]
    emit('close', selObj)
  } else {
    const selObjs = refTable.value?.getSelectionRows()
    emit('close', selObjs)
  }
}

function onTableRowDoubleClick(row) {
  if (props.column.multiple === 'NO') {
    selectedKey.value = row[props.column.externalClassPrimaryField]
    emit('close', row)
  } else {
    selectedKey.value = [row[props.column.externalClassPrimaryField]]
    emit('close', [row])
  }
}

function onClearForm() {
  if (props.column.multiple === 'NO') {
    emit('close', {})
  } else {
    emit('close', [])
  }
}

function onTableDataRenderFinish(tableData) {
  for (let j = 0; j < tableData.records.length; j++) {
    if (props.column.multiple === 'NO') {
      if (tableData.records[j][props.column.externalClassPrimaryField] === selectedKey.value) {
        refTable.value?.setCurrentRow(tableData.records[j])
      }
    } else {
      if (selectedKey.value.includes(tableData.records[j][props.column.externalClassPrimaryField])) {
        refTable.value?.toggleRowSelection(tableData.records[j], true)
      }
    }
  }
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    onSaveClick()
  } else if (btnName === 'cancel') {
    onClearForm()
  }
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

defineExpose({
  props,
  onButtonClick
})
</script>


<style scoped>
/* 整体容器：高度100% 自适应 */
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  container-type: inline-size;
}

/* 全屏模式内边距 */
.form-container.fullscreen {
  padding: 12px;
}
</style>
