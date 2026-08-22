<template>
  <div :style="{ height: tableHeightCss }">
    <be-std-page-layout ref="refTable"
                        :class-name="metaData.className"
                        :layout-prams-id="metaData.layoutPramsId"
                        :queryParams="metaData.queryParams"
                        :query-mode="metaData.queryMode"
                        :multiple="metaData.multiple"
                        :form-component="metaData.formComponent"
                        :data-render-finish="metaData.dataRenderFinish"
                        :row-db-click="metaData.rowDbClick"
    />
  </div>
</template>
<script lang="ts" setup>
import {computed, defineExpose, ref} from "vue";
import BeStdPageLayout from "@/views/template/BeStdPageLayout.vue";

const props = defineProps<{
  metaData: object | null | undefined
  dialogModel?: boolean
  fullscreen?: boolean
}>()

const refTable = ref(null)
const tableHeightCss = computed({
  get() {
    return props.dialogModel === true ? (props.fullscreen === true ? 'calc(100vh - 100px)' : 'calc(60vh - 100px)') : 'calc(100vh - 185px)'
  },
  set() {
  }
})

const setCurrentRow = (row) => {
  refTable.value?.setCurrentRow(row)
}

const toggleRowSelection = (row, checked) => {
  refTable.value?.toggleRowSelection(row, checked)
}

const getSelectionRows = () => {
  return refTable.value?.getSelectionRows()
}

defineExpose({
  setCurrentRow, toggleRowSelection, getSelectionRows
})
</script>
