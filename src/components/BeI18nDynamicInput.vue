<template>
  <div class="be-i18n-wrapper flex flex-row items-stretch w-full">
    <!-- 输入框/文本域主体 -->
    <el-input
      ref="refInput"
      v-model="currentLangInput"
      @input="handleDirectInput"
      v-bind="$attrs"
      class="flex-1 be-i18n-field"
      :class="{ 'is-textarea-append': isTextarea }"
    >
      <!-- 普通单行 input 模式下：继续使用官方原生 append 插槽 -->
      <template #append v-if="!isTextarea">
        <div class="append-icon-box" @click="onI18nClick">
          <el-icon
            :class="['my-icon-color-primary flex-row align-items-center', { 'cursor-pointer': !isDisabled, 'is-disabled': isDisabled }]"
            :size="18"
          >
            <IconLocalLanguage />
          </el-icon>
        </div>
      </template>
    </el-input>

    <!-- textarea 模式下：在右侧无缝拼接一个与 append 样式完全一致的按钮条 -->
    <div
      v-if="isTextarea"
      class="textarea-append-btn flex-none flex-row align-items-center justify-content-center"
      :class="{ 'cursor-pointer': !isDisabled, 'is-disabled': isDisabled }"
      @click="onI18nClick"
      :title="t('i18nEditTitle') || '多语言配置'"
    >
      <el-icon :class="['my-icon-color-primary', { 'is-disabled': isDisabled }]" :size="18">
        <IconLocalLanguage />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, onMounted, ref, useAttrs } from 'vue'
import { useModal } from '@/components/dialog/useModal.ts'
import BeI18NDynamicForm from "@/components/BeI18nDynamicForm.vue"
import { useI18n } from 'vue-i18n'
import { langMap } from "@/locales/common.ts"

const { locale, t } = useI18n()
const { open } = useModal()
const refInput = ref(null)
const bindAttrs = useAttrs()

const props = defineProps<{
  modelValue?: string
  lang?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
}>()

const isTextarea = computed(() => bindAttrs.type === 'textarea')
const isDisabled = computed(() => bindAttrs.disabled === true || bindAttrs.disabled === '')

onMounted(() => {
  const inputEl = refInput.value?.input || refInput.value?.textarea
  if (inputEl && !bindAttrs.maxlength) {
    inputEl.maxLength = 1024
  }
})

const currentLang = computed(() => props.lang !== undefined ? props.lang : (langMap[locale.value] || locale.value))

const safeParseJson = (str: string | null | undefined): Record<string, string> => {
  if (!str) return {}
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

const currentLangInput = computed({
  get() {
    const jsonObj = safeParseJson(props.modelValue)
    return jsonObj[currentLang.value] || ''
  },
  set(val) {
    handleDirectInput(val)
  }
})

function handleDirectInput(val: string) {
  const jsonObj = safeParseJson(props.modelValue)
  jsonObj[currentLang.value] = val
  emit('update:modelValue', JSON.stringify(jsonObj))
}

const onI18nClick = () => {
  if (isDisabled.value) return

  open(
    BeI18NDynamicForm,
    {
      i18nData: safeParseJson(props.modelValue) || {},
      maxlength: bindAttrs.maxlength
    },
    {
      title: t('i18nEditTitle'),
      width: '60%',
      dialogModel: true,
      onClose: (data) => {
        if (data) {
          emit('update:modelValue', JSON.stringify(data))
        }
      },
    },
  )
}

const setCurrentLangValue = (value: string) => handleDirectInput(value)
const setLanguageValue = (lang: string, value: string) => {
  const jsonObj = safeParseJson(props.modelValue)
  jsonObj[lang] = value
  emit('update:modelValue', JSON.stringify(jsonObj))
}

defineExpose({
  setCurrentLangValue,
  setLanguageValue
})
</script>

<style scoped>
/* 单行 input 的 append 样式 */
.append-icon-box {
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-input-group__append) {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 多行 textarea 模式下的侧边连接条 */
.is-textarea-append :deep(.el-textarea__inner) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.textarea-append-btn {
  width: 36px;
  background-color: var(--el-fill-color-light, #f5f7fa);
  color: var(--el-color-info);
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-left: none;
  border-top-right-radius: var(--el-border-radius-base, 4px);
  border-bottom-right-radius: var(--el-border-radius-base, 4px);
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-sizing: border-box;
}

.textarea-append-btn:hover:not(.is-disabled) {
  background-color: var(--el-fill-color, #e4e7ed);
}

.is-disabled {
  cursor: not-allowed !important;
  opacity: 0.5;
}
</style>
