<template>
    <el-table height="100%" :data="tableData" scrollbar-always-on highlight-current-row border fit
              table-layout="auto">
      <el-table-column :label="$t('table.columnNo')" type="index" width="60"/>
      <el-table-column :label="$t('table.columnLabel')" prop="displayName" resizable>
        <template #default="scope">
          <tuna-i18n-value :model-value="scope.row.displayName" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnFieldName')" prop="name" resizable/>
      <el-table-column :label="$t('table.columnIsShow')" prop="isShow" resizable>
        <template #default="scope">
          <el-switch v-model="scope.row.isShow" :active-value="'YES'" :inactive-value="'NO'"
                     @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnIsSort')" prop="isSort" resizable>
        <template #default="scope">
          <el-switch v-model="scope.row.isSort" :active-value="'YES'" :inactive-value="'NO'"
                     @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnIsOverflow')" prop="isOverflow" resizable>
        <template #default="scope">
          <el-switch v-model="scope.row.isOverflow" :active-value="'YES'" :inactive-value="'NO'"
                     @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnIsSearch')" prop="isSearch" resizable>
        <template #default="scope">
          <el-switch v-model="scope.row.isSearch" :active-value="'YES'" :inactive-value="'NO'"
                     @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnAlign')" prop="align" resizable width="120">
        <template #default="scope">
          <el-select v-model="scope.row.align">
            <el-option value="LEFT" :label="$t('table.alignLeft')"></el-option>
            <el-option value="CENTER" :label="$t('table.alignCenter')"></el-option>
            <el-option value="RIGHT" :label="$t('table.alignRight')"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnWidth')" prop="width" resizable>
        <template #default="scope">
          <el-input-number v-model="scope.row.width" :min="0" :max="2000" :step="1"
                           @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.columnShowOrder')" prop="showOrder"
                       resizable>
        <template #default="scope">
          <el-input-number v-model="scope.row.showOrder" :min="0" :step="1"
                           @change="onFieldSetClick(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
</template>
<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useAppSettingsStore} from '@/stores/appSettings.ts'

const props = defineProps<{
  className: string,
  columns: Array<never>,
}>()
const appSettingsStore = useAppSettingsStore()

const tableData = ref([])

onMounted(() => {
  tableData.value = props.columns
})

function onFieldSetClick(row) {
  let fieldsDefine = appSettingsStore.getStorageObject(props.className + '.fields')
  if (fieldsDefine === undefined) {
    fieldsDefine = {}
  }
  fieldsDefine[row.name] = row
  appSettingsStore.putStorageObject(props.className + '.fields', fieldsDefine)
  sortColumnsByShowOrder()
}

function sortColumnsByShowOrder() {
  return props.columns.sort((a, b) => a.showOrder - b.showOrder)
}
</script>
