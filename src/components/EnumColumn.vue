<template>
  <el-table-column>
    <template #default="scope">
      <el-tag :type="parseType(scope.row[$props.prop])" v-if="scope.row[$props.prop]">
        {{ parseLabel(scope.row[$props.prop]) }}</el-tag
      >
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getEnumValues } from '@/api/common/platform'
import XEUtils from 'xe-utils'

const enumMap = ref({})
const typeMap = ref({})
const typeArray = ['primary', 'success', 'info', 'warning', 'danger']

const props = defineProps<{
  code: string
  prop: string
  context: string
}>()

onMounted(() => {
  getEnumValues(props.context, props.code).then((rsp) => {
    let idx = 0
    rsp.data.forEach((item) => {
      enumMap.value[XEUtils.toString(item.value)] = item
      typeMap.value[XEUtils.toString(item.value)] = typeArray[idx]
      idx = idx + 1
      if (idx >= typeArray.length) {
        idx = 0
      }
    })
  })
})

function parseLabel(value) {
  if (enumMap.value[XEUtils.toString(value)] !== undefined) {
    return enumMap.value[XEUtils.toString(value)]['label']
  } else {
    return value
  }
}

function parseType(value) {
  if (typeMap.value[XEUtils.toString(value)] !== undefined) {
    return typeMap.value[XEUtils.toString(value)]
  } else {
    return 'primary'
  }
}
</script>
