<template>
  <span>{{ currentLangValue }}</span>
</template>
<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {computed} from "vue"
import {getLangText} from "@/locales/common.ts";

const {locale} = useI18n()

// 定义属性
const props = defineProps<{
  modelValue: string | null | undefined
}>()

// 最终正确的语言（zh_CN）
const currentLangValue = computed({
  get() {
    return getLangText(props.modelValue, locale.value)
  },
  set() {
  }
})


</script>
