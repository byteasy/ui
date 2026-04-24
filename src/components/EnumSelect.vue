<template>
  <el-select :loading="loading" >
    <el-option v-for="item in enumValues" :key="item.value" :label="getLangText(item.label, locale)" :value="item.value" />
  </el-select>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { getEnumValues } from '@/api/common/platform'
import {getLangText} from "@/locales/common.ts";

const { t, locale } = useI18n()

const props = defineProps<{
  code: string
  context: string
}>()
const enumValues = ref([])
const loading = ref(false)

onMounted(() => {
  getEnumValues(props.context, props.code).then(rsp => {
    enumValues.value = rsp.data
  })
})
</script>
