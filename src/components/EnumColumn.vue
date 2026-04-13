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

const props = defineProps<{
  code: string
  prop: string
  context: string
}>()

onMounted(() => {
  getEnumValues(props.context, props.code).then((rsp) => {
    rsp.data.forEach((item) => {
      enumMap.value[XEUtils.toString(item.value)] = item
    })
  })
})

function parseLabel(value) {
  if (enumMap.value[XEUtils.toString(value)] !== undefined) {
    return enumMap.value[XEUtils.toString(value)]['displayName']
  } else {
    return value
  }
}

function parseType(value) {
  if (enumMap.value[XEUtils.toString(value)] !== undefined) {
    return enumMap.value[XEUtils.toString(value)].css
  } else {
    return 'primary'
  }
}
</script>
