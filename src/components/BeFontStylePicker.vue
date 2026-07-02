<!-- FontStylePicker.vue -->
<template>
  <div class="w-full flex flex-column gap-1-2">
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">字体:</el-text>
      <el-select v-model="fontFamily" placeholder="请选择字体" :size="props.size" @change="handleChange">
        <!-- 中文字体 - Windows 常用 -->
        <el-option label="微软雅黑" value="Microsoft YaHei" />
        <el-option label="宋体" value="SimSun" />
        <el-option label="新宋体" value="NSimSun" />
        <el-option label="黑体" value="SimHei" />
        <el-option label="微软雅黑粗体" value="Microsoft YaHei Bold" />
        <el-option label="楷体" value="KaiTi" />
        <el-option label="仿宋" value="FangSong" />
        <el-option label="方正姚体" value="FZYaoti" />
        <el-option label="方正舒体" value="FZShuTi" />

        <!-- Mac 常用中文字体 -->
        <el-option label="苹方" value="PingFang SC" />
        <el-option label="华文宋体" value="STSong" />
        <el-option label="华文黑体" value="STHeiti" />
        <el-option label="华文楷体" value="STKaiti" />
        <el-option label="华文仿宋" value="STFangsong" />
        <el-option label="华文细黑" value="STXihei" />

        <!-- 无衬线英文字体（网页最常用） -->
        <el-option label="Arial" value="Arial" />
        <el-option label="Helvetica" value="Helvetica" />
        <el-option label="Helvetica Neue" value="Helvetica Neue" />
        <el-option label="Segoe UI" value="Segoe UI" />
        <el-option label="Roboto" value="Roboto" />
        <el-option label="Open Sans" value="Open Sans" />

        <!-- 衬线英文印刷字体 -->
        <el-option label="Times New Roman" value="Times New Roman" />
        <el-option label="Georgia" value="Georgia" />
        <el-option label="Garamond" value="Garamond" />

        <!-- 等宽代码类字体 -->
        <el-option label="Consolas" value="Consolas" />
        <el-option label="Courier New" value="Courier New" />
        <el-option label="Monaco" value="Monaco" />

        <!-- 通用网页安全字体兜底 -->
        <el-option label="系统默认无衬线" value="sans-serif" />
        <el-option label="系统默认衬线" value="serif" />
        <el-option label="系统等宽字体" value="monospace" />
      </el-select>
    </div>

    <!-- 字体大小 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">字号:</el-text>
      <be-unit-input v-model="fontSize" :units="['px', 'vw', 'rem', '%']" :size="props.size" @change="handleChange"/>
    </div>

    <!-- 字重 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">字重:</el-text>
      <el-select v-model="fontWeight" :size="props.size" class="flex-grow" @change="handleChange">
        <el-option label="常规(400)" value="400" />
        <el-option label="中等(500)" value="500" />
        <el-option label="粗体(600)" value="600" />
        <el-option label="加粗(700)" value="700" />
        <el-option label="特粗(900)" value="900" />
      </el-select>
    </div>

    <!-- 文字倾斜 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">样式:</el-text>
      <el-radio-group v-model="fontStyle" :size="props.size" @change="handleChange">
        <el-radio-button value="normal">正常</el-radio-button>
        <el-radio-button value="italic">倾斜</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 字体颜色 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">颜色:</el-text>
      <el-color-picker v-model="color" color-format="hex6" show-alpha :size="props.size" @change="handleChange" />
    </div>

    <!-- 对齐方式 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">对齐:</el-text>
      <el-radio-group v-model="textAlign" :size="props.size" @change="handleChange">
        <el-radio-button value="left">左对齐</el-radio-button>
        <el-radio-button value="center">居中</el-radio-button>
        <el-radio-button value="right">右对齐</el-radio-button>
        <el-radio-button value="justify">两端对齐</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 文字装饰 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">装饰:</el-text>
      <el-radio-group v-model="textDecoration" :size="props.size" @change="handleChange">
        <el-radio-button value="none">无</el-radio-button>
        <el-radio-button value="underline">下划线</el-radio-button>
        <el-radio-button value="line-through">删除线</el-radio-button>
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
  color: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textDecoration: 'none' | 'underline' | 'line-through'
}

interface Props {
  modelValue?: FontStyle
  size?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认配置
const defaultFont: FontStyle = {
  fontFamily: 'Microsoft YaHei',
  fontSize: '14px',
  fontWeight: '400',
  fontStyle: 'normal',
  color: '#000000',
  textAlign: 'left',
  textDecoration: 'none'
}

// 绑定数据
const fontFamily = ref(defaultFont.fontFamily)
const fontSize = ref(defaultFont.fontSize)
const fontWeight = ref(defaultFont.fontWeight)
const fontStyle = ref<'normal' | 'italic'>(defaultFont.fontStyle)
const color = ref(defaultFont.color)
const textAlign = ref<'left' | 'center' | 'right' | 'justify'>(defaultFont.textAlign)
const textDecoration = ref<'none' | 'underline' | 'line-through'>(defaultFont.textDecoration)

// 初始化赋值
const initValue = (val?: FontStyle) => {
  if (!val) {
    // 外部传入空值，全部重置为默认配置
    fontFamily.value = defaultFont.fontFamily
    fontSize.value = defaultFont.fontSize
    fontWeight.value = defaultFont.fontWeight
    fontStyle.value = defaultFont.fontStyle
    color.value = defaultFont.color
    textAlign.value = defaultFont.textAlign
    textDecoration.value = defaultFont.textDecoration
    return
  }
  // 有值时逐个赋值，同时兜底防止单个字段缺失
  fontFamily.value = val.fontFamily ?? defaultFont.fontFamily
  fontSize.value = val.fontSize ?? defaultFont.fontSize
  fontWeight.value = val.fontWeight ?? defaultFont.fontWeight
  fontStyle.value = val.fontStyle ?? defaultFont.fontStyle
  color.value = val.color ?? defaultFont.color
  textAlign.value = val.textAlign ?? defaultFont.textAlign
  textDecoration.value = val.textDecoration ?? defaultFont.textDecoration
}

initValue(props.modelValue)

// 同步父组件
const handleChange = () => {
  const data: FontStyle = {
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    color: color.value,
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
