<template>
  <span>{{ currentLangValue }}</span>
</template>
<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {langMap} from "@/locales/common.ts"
import {computed} from "vue"

const {locale} = useI18n()

// 定义属性
const props = defineProps<{
  modelValue: string | null | undefined
}>()

// 最终正确的语言（zh_CN）
const currentLang = computed(() => langMap[locale.value] || locale.value)
const currentLangValue = computed({
  get() {
    if (props.modelValue === undefined || props.modelValue === null) {
      return ''
    }
    if (props.modelValue.startsWith('{')) {
      return JSON.parse(props.modelValue || '{}')[currentLang.value]
    }
    return props.modelValue
  },
  set() {
  }
})


</script>
