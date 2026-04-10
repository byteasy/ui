<template>
  <el-table height="80vh" :data="tableData" fix border scrollbar-always-on highlight-current-row>
    <el-table-column :label="$t('table.columnNo')" type="index" resizable show-overflow-tooltip
                     width="60"></el-table-column>
    <el-table-column :label="$t('table.columnLabel')" prop="displayName" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnFieldName')" prop="name" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnIsShow')" prop="isShow" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnIsSort')" prop="isSort" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnIsOverflow')" prop="isOverflow" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnIsSearch')" prop="isSearch" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnAlign')" prop="align" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnWidth')" prop="width" resizable
                     show-overflow-tooltip></el-table-column>
    <el-table-column :label="$t('table.columnShowOrder')" prop="showOrder" resizable
                     show-overflow-tooltip></el-table-column>
  </el-table>
</template>
<script lang="ts" setup>

import {onMounted, ref} from "vue";

const props = defineProps<{
  className: string,
  columns: Array<never>
}>()

const tableData = ref([])

onMounted(() => {
  tableData.value = props.columns
})

</script>
