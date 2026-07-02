<template>
  <el-tag :type="parseType($props.prop)" v-if="$props.prop">
    {{ parseLabel($props.prop) }}</el-tag
  >
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getEnumValues } from '@/api/common/platform'
import XEUtils from 'xe-utils'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

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
  if (enumMap.value[XEUtils.toString(value)] !== undefined) {
    return getLangText(enumMap.value[XEUtils.toString(value)]['label'], locale.value)
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
