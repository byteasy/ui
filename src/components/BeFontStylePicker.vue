<!-- FontStylePicker.vue -->
<template>
  <div class="w-full flex flex-column gap-1-2">
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">字体:</el-text>
      <el-select v-model="fontFamily" placeholder="请选择字体" size="small" @change="handleChange">
        <el-option label="微软雅黑" value="Microsoft YaHei" />
        <el-option label="宋体" value="SimSun" />
        <el-option label="黑体" value="SimHei" />
        <el-option label="Arial" value="Arial" />
        <el-option label="Times New Roman" value="Times New Roman" />
        <el-option label="Consolas" value="Consolas" />
      </el-select>
    </div>

    <!-- 字体大小 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">字号:</el-text>
      <be-unit-input v-model="fontSize" :units="['px', 'vw', 'rem', '%']" size="small"/>
    </div>

    <!-- 字重 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">字重:</el-text>
      <el-select v-model="fontWeight" size="small" class="flex-grow" @change="handleChange">
        <el-option label="常规(400)" value="400" />
        <el-option label="中等(500)" value="500" />
        <el-option label="粗体(600)" value="600" />
        <el-option label="加粗(700)" value="700" />
        <el-option label="特粗(900)" value="900" />
      </el-select>
    </div>

    <!-- 文字倾斜 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">样式:</el-text>
      <el-radio-group v-model="fontStyle" size="small" @change="handleChange">
        <el-radio-button label="normal">正常</el-radio-button>
        <el-radio-button label="italic">倾斜</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 字体颜色 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">颜色:</el-text>
      <el-color-picker v-model="fontColor" show-alpha size="small" @change="handleChange" />
    </div>

    <!-- 对齐方式 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">对齐:</el-text>
      <el-radio-group v-model="textAlign" size="small" @change="handleChange">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
        <el-radio-button label="justify">两端对齐</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 文字装饰 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" size="small">装饰:</el-text>
      <el-radio-group v-model="textDecoration" size="small" @change="handleChange">
        <el-radio-button label="none">无</el-radio-button>
        <el-radio-button label="underline">下划线</el-radio-button>
        <el-radio-button label="line-through">删除线</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

export interface FontStyle {
  fontFamily: string
  fontSize: string
  fontWeight: string
  fontStyle: 'normal' | 'italic'
  fontColor: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textDecoration: 'none' | 'underline' | 'line-through'
}

interface Props {
  modelValue?: FontStyle
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认配置
const defaultFont: FontStyle = {
  fontFamily: 'Microsoft YaHei',
  fontSize: '14px',
  fontWeight: '400',
  fontStyle: 'normal',
  fontColor: '#000000',
  textAlign: 'left',
  textDecoration: 'none'
}

// 绑定数据
const fontFamily = ref(defaultFont.fontFamily)
const fontSize = ref(defaultFont.fontSize)
const fontWeight = ref(defaultFont.fontWeight)
const fontStyle = ref<'normal' | 'italic'>(defaultFont.fontStyle)
const fontColor = ref(defaultFont.fontColor)
const textAlign = ref<'left' | 'center' | 'right' | 'justify'>(defaultFont.textAlign)
const textDecoration = ref<'none' | 'underline' | 'line-through'>(defaultFont.textDecoration)

// 初始化赋值
const initValue = (val?: FontStyle) => {
  if (!val) return
  fontFamily.value = val.fontFamily
  fontSize.value = val.fontSize
  fontWeight.value = val.fontWeight
  fontStyle.value = val.fontStyle
  fontColor.value = val.fontColor
  textAlign.value = val.textAlign
  textDecoration.value = val.textDecoration
}

initValue(props.modelValue)

// 同步父组件
const handleChange = () => {
  const data: FontStyle = {
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    fontColor: fontColor.value,
    textAlign: textAlign.value,
    textDecoration: textDecoration.value
  }
  emit('update:modelValue', data)
}

// 监听外部赋值
watch(() => props.modelValue, (newVal) => {
  initValue(newVal)
}, { deep: true })
</script>
<style scoped>

.label-width {
  min-width: 40px;
}
</style>
