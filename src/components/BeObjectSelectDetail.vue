<template>
  <div class="form-container"
       :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
       style="container-type: inline-size;">
    <el-select v-model="selectedKey" v-bind="$attrs" class="w-full"
               v-if="props.column.uiComponent === 'SELECT'"
               :multiple="props.column.multiple === 'YES'">
      <el-option v-for="obj in tableData.records"
                 :key="obj[props.column.externalClassPrimaryField]"
                 :value="obj[props.column.externalClassPrimaryField]"
                 :label="getLangText(obj[props.column.externalClassDisplayField], locale)"/>
    </el-select>
    <el-radio-group v-model="selectedKey" v-bind="$attrs" class="w-full"
                    v-if="props.column.uiComponent === 'RADIO' && props.column.multiple === 'NO'">
      <el-radio v-for="obj in tableData.records"
                :key="obj[props.column.externalClassPrimaryField]"
                :value="obj[props.column.externalClassPrimaryField]"
                :label="getLangText(obj[props.column.externalClassDisplayField], locale)"/>
    </el-radio-group>
    <div v-if="props.column.uiComponent === 'TABLE' || props.column.uiComponent === undefined"
         :style="{ 'height': tableHeight }" class="w-full">
      <be-std-page-layout ref="refTable" class="w-full h-full"
                          :class-name="props.entityDefine.code"
                          :query-params="queryParams"
                          :query-mode="props.queryMode"
                          :multiple="props.column.multiple === 'YES'"
                          :row-db-click="onTableRowDoubleClick"
                          :data-render-finish="onTableDataRenderFinish"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, defineEmits, defineExpose, onMounted, ref} from "vue";
import {doHttpGet} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
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
    uiComponent: 'SELECT' | 'RADIO' | 'TABLE'
  }
  entityDefine: object
  queryParams?: Record<string, any>
  fullscreen?: boolean
  isDrawer?: boolean
  queryMode?: boolean
}>()
const refTable = ref(null)
const emit = defineEmits(['close'])
const queryParams = ref({current: 1, size: 20, ...props.queryParams})
const tableData = ref({total: '0'})
const loading = ref(false)
const selectedKey = ref(props.modelValue)
const {t, locale} = useI18n()

onMounted(() => {
  if (props.column.uiComponent === 'TABLE') {
  } else { // RADIO OR SELECT
    refresh()
  }
})

const tableHeight = computed({
  get() {
    return props.fullscreen === true ? 'calc(100vh - 200px)' : 'calc(55vh - 100px)'
  },
  set() {
  }
})

function refresh() {
  loading.value = true
  doHttpGet(props.entityDefine.serviceInstance.contextPath + '/sapi/common/' + props.entityDefine.code, queryParams.value).then((rsp) => {
    tableData.value = rsp.data
    loading.value = false
  })
}

function onSaveClick() {
  // 表格选择模式
  if (props.column.uiComponent === 'TABLE') {
    selectedKey.value = refTable.value?.getSelectionRows().map(e => e[props.column.externalClassPrimaryField])
    if (props.column.multiple === 'NO') {
      const selObj = refTable.value?.getSelectionRows()[0]
      emit('close', selObj)
    } else {
      const selObjs = refTable.value?.getSelectionRows()
      emit('close', selObjs)
    }
    return
  }

  // SELECT/RADIO选择模式
  if (props.column.multiple === 'NO') {
    let selObj = {}
    for (let i = 0; i < tableData.value.records.length; i++) {
      if (tableData.value.records[i][props.column.externalClassPrimaryField] === selectedKey.value) {
        selObj = tableData.value.records[i]
      }
    }
    emit('close', selObj)
  } else {
    // 多选模式
    const selObj = []
    for (let i = 0; i < tableData.value.records.length; i++) {
      if (selectedKey.value.includes(tableData.value.records[i][props.column.externalClassPrimaryField])) {
        selObj.push(tableData.value.records[i])
      }
    }
    emit('close', selObj)
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
