<template>
  <el-table-column>
    <template #default="scope">
      <el-tag :type="parseType(scope.row[$props.prop])" v-if="scope.row[$props.prop]">
        {{ parseLabel(scope.row[$props.prop]) }}
      </el-tag>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getEnumValues } from '@/api/common/platform'
import XEUtils from 'xe-utils'
import {useI18n} from "vue-i18n";
import {getLangText} from "@/locales/common.ts";

const {t, locale} = useI18n()
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
  const key = XEUtils.toString(value)
  if (enumMap.value[key] !== undefined) {
    return getLangText(enumMap.value[key].label, locale.value)
  } else {
    return getLangText(value, locale.value)
  }
}

function parseType(value) {
  // 统一转字符串，解决数字/布尔值找不到 key 的问题
  const key = XEUtils.toString(value)

  if (enumMap.value[key] !== undefined) {
    return enumMap.value[key].css
  } else {
    return 'primary'
  }
}
</script>
