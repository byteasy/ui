<template>
  <tuna-table-form>
    <template v-slot:formItemField_groupId="scope">
      <el-select
        v-model="scope.row.groupId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResourceGroups"
          :key="item.id"
          :label="getLangText(item.name, locale)"
          :value="item.id"
        />
      </el-select>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <el-select
        v-model="scope.row.parentId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResources"
          :key="item.id"
          :label="getLangText(item.name, locale)"
          :value="item.id"
        />
      </el-select>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
const {locale} = useI18n()

const parentResourceGroups = ref([])
const parentResources = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResourceGroups.value = res.data.records
  })

  doHttpGet('/platformSvr/sapi/resources', {
    current: 1,
    size: 10000,
    ascColumns: ['parentId', 'showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})
</script>
