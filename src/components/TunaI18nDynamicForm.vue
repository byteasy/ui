<template>
  <div class="w-full flex-column" style="overflow: hidden;">
    <el-scrollbar max-height="70vh" always class="w-full">
      <el-form ref="refForm" label-width="auto" label-position="right" class="w-full">
        <el-form-item :label="lang.label + '(' + lang.description + ')'" :prop="lang.label" v-for="lang in langList"
                      :key="lang.value">
          <el-input v-model="i18nForm[lang.value]" type="textarea" :rows="1" :maxlength="props.maxlength" show-word-limit/>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-divider/>
    <div class="w-full">
      <el-affix position="bottom" class="w-full">
        <div class="flex-row w-full justify-content-center pb-2">
          <slot name="footerButton" :props="props">
            <el-button type="primary" icon="Check" @click="onSaveClick">{{
                $t('save')
              }}
            </el-button>
            <el-button icon="Close" @click="onCancelClick">{{ $t('close') }}</el-button>
          </slot>
        </div>
      </el-affix>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, getCurrentInstance, onUnmounted, defineEmits} from 'vue'
import { langList as langDefileList } from "@/locales/common.ts"

// 接收父组件传入的参数（JSON 格式多语言）
const props = defineProps<{
  i18nData?: Record<string, string>
  maxlength?: number
}>()

// 弹窗关闭、返回数据
const emit = defineEmits(['close'])

// 所有支持的语言（和你表格完全一致）
const langList = ref(langDefileList)

// 表单数据
const i18nForm = ref<Record<string, string>>({})

onMounted(() => {
  // 初始化：把传入的 JSON 赋值给表单
  if (props.i18nData) {
    i18nForm.value = {...props.i18nData}
  }
})

onUnmounted(() => {
  onSaveClick()
})

// 暴露给弹窗关闭时调用
const getFormData = () => {
  return i18nForm.value
}

// 把方法挂载到 modal 上下文
const instance = getCurrentInstance()
if (instance?.proxy) {
  instance.proxy.getFormData = getFormData
}

function onSaveClick() {
  emit('close', getFormData())
}

function onCancelClick() {
  emit('close')
}
</script>

