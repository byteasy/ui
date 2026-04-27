<template>
    <el-input ref="refInput" v-model="currentLangInput" @input="handleDirectInput" v-bind="bindAttrs">
      <template #append>
        <el-icon :class="{'my-icon-color-primary': true, 'cursor-pointer': !props.disabled }"
                 @click="onI18nClick">
          <IconLocalLanguage/>
        </el-icon>
      </template>
    </el-input>
</template>

<script setup lang="ts">

import {computed, defineExpose, onMounted, ref, useAttrs} from 'vue'
import {useModal} from '@/components/dialog/useModal.ts'
import TunaI18nDynamicForm from "@/components/TunaI18nDynamicForm.vue"
import {useI18n} from 'vue-i18n'
import {langMap} from "@/locales/common.ts"

const {locale} = useI18n()
const {open} = useModal()
const {t} = useI18n()
const refInput = ref(null)

const bindAttrs = useAttrs()
// 🔥 核心修改：modelValue 改成 string 类型
const props = defineProps<{
  modelValue?: string
  lang?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()

onMounted(() => {
  const input = refInput.value?.input
  if (input) {
    input.maxLength = 1024
  }
})

// 最终正确的语言（zh_CN）
const currentLang = computed(() => props.lang !== undefined ? props.lang : (langMap[locale.value] || locale.value))

// 工具方法：安全解析 JSON 字符串
const safeParseJson = (str: string | null | undefined): Record<string, string> => {
  if (!str) return {}
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

/**
 * 1. 输入框显示当前语言的值（自动解析 string 类型的 JSON）
 */
const currentLangInput = computed({
  get() {
    const jsonObj = safeParseJson(props.modelValue)
    return jsonObj[currentLang.value] || ''
  },
  set(val) {
    handleDirectInput(val)
  }
})

/**
 * 2. 用户直接输入 → 只更新当前语言
 */
function handleDirectInput(val: string) {
  // 解析原字符串 -> 修改 -> 重新转成字符串
  const jsonObj = safeParseJson(props.modelValue)
  jsonObj[currentLang.value] = val
  // 🔥  emit 出去的是 string 类型
  emit('update:modelValue', JSON.stringify(jsonObj))
}

/**
 * 3. 点击图标打开多语言弹窗
 */
const onI18nClick = () => {
  if (bindAttrs.disabled === true) return

  open(
    TunaI18nDynamicForm,
    {
      // 把 string 解析成对象传给弹窗
      i18nData: safeParseJson(props.modelValue) || {},
      maxlength: bindAttrs.maxlength
    },
    {
      title: t('i18nEditTitle'),
      width: '60%',
      dialogModel: true,
      onClose: (data) => {
        if (data) {
          // 🔥 弹窗返回对象，这里转成 string 再 emit
          emit('update:modelValue', JSON.stringify(data))
        }
      },
    },
  )
}

const setCurrentLangValue = (value) => {
  handleDirectInput(value)
}

const setLanguageValue = (lang, value) => {
  // 解析原字符串 -> 修改 -> 重新转成字符串
  const jsonObj = safeParseJson(props.modelValue)
  jsonObj[lang] = value
  // 🔥  emit 出去的是 string 类型
  emit('update:modelValue', JSON.stringify(jsonObj))
}

defineExpose({
  setCurrentLangValue,
  setLanguageValue
})
</script>
