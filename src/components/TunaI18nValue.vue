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
  modelValue: string
}>()

// 最终正确的语言（zh_CN）
const currentLang = computed(() => langMap[locale.value] || locale.value)
console.log('currentLang', currentLang)
const currentLangValue = computed({
  get() {
    return JSON.parse(props.modelValue || '{}')[currentLang.value]
  },
  set() {}
})


</script>
