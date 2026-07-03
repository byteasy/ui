<template>
  <el-text v-if="props.truncated" truncated> {{ currentLangValue }}</el-text>
  <span v-else>{{ currentLangValue }}</span>
</template>
<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {computed} from "vue"
import {getLangText} from "@/locales/common.ts";

const {locale} = useI18n()

// 定义属性
const props = defineProps<{
  modelValue: string | null | undefined
  lang?: string
  truncated?: boolean
}>()

// 最终正确的语言（zh_CN）
const currentLangValue = computed({
  get() {
    const lang = props.lang === undefined ? locale.value : props.lang
    return getLangText(props.modelValue, lang)
  },
  set() {
  }
})


</script>
