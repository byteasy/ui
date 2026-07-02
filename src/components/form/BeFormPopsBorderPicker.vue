<template>
  <div class="w-full flex flex-column gap-1-2">
    <!-- 边框样式 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">样式:</el-text>
      <el-select v-model="borderStyle" :size="props.size" class="flex-grow" @change="handleChange">
        <el-option label="无 none" value="none" />
        <el-option label="实线 solid" value="solid" />
        <el-option label="虚线 dashed" value="dashed" />
        <el-option label="点线 dotted" value="dotted" />
        <el-option label="双线 double" value="double" />
      </el-select>
    </div>

    <!-- 边框颜色 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">颜色:</el-text>
      <el-color-picker
        v-model="borderColor"
        color-format="hex6"
        show-alpha
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 上边框宽度 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">上边框:</el-text>
      <be-unit-input
        v-model="borderTopWidth"
        :units="['px', 'vw', 'rem', 'em']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 右边框宽度 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">右边框:</el-text>
      <be-unit-input
        v-model="borderRightWidth"
        :units="['px', 'vw', 'rem', 'em']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 下边框宽度 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">下边框:</el-text>
      <be-unit-input
        v-model="borderBottomWidth"
        :units="['px', 'vw', 'rem', 'em']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 左边框宽度 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">左边框:</el-text>
      <be-unit-input
        v-model="borderLeftWidth"
        :units="['px', 'vw', 'rem', 'em']"
        :size="props.size"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

export interface BorderStyleInfo {
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double'
  borderColor: string
  borderTopWidth: string
  borderRightWidth: string
  borderBottomWidth: string
  borderLeftWidth: string
}

interface Props {
  modelValue?: BorderStyleInfo
  size?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认边框配置
const defaultBorder: BorderStyleInfo = {
  borderStyle: 'none',
  borderColor: '#000000',
  borderTopWidth: '0px',
  borderRightWidth: '0px',
  borderBottomWidth: '0px',
  borderLeftWidth: '0px'
}

// 内部响应式变量
const borderStyle = ref<BorderStyleInfo['borderStyle']>(defaultBorder.borderStyle)
const borderColor = ref(defaultBorder.borderColor)
const borderTopWidth = ref(defaultBorder.borderTopWidth)
const borderRightWidth = ref(defaultBorder.borderRightWidth)
const borderBottomWidth = ref(defaultBorder.borderBottomWidth)
const borderLeftWidth = ref(defaultBorder.borderLeftWidth)

// 初始化赋值：空值重置默认 + 字段缺失兜底
const initValue = (val?: BorderStyleInfo) => {
  if (!val) {
    borderStyle.value = defaultBorder.borderStyle
    borderColor.value = defaultBorder.borderColor
    borderTopWidth.value = defaultBorder.borderTopWidth
    borderRightWidth.value = defaultBorder.borderRightWidth
    borderBottomWidth.value = defaultBorder.borderBottomWidth
    borderLeftWidth.value = defaultBorder.borderLeftWidth
    return
  }
  borderStyle.value = val.borderStyle ?? defaultBorder.borderStyle
  borderColor.value = val.borderColor ?? defaultBorder.borderColor
  borderTopWidth.value = val.borderTopWidth ?? defaultBorder.borderTopWidth
  borderRightWidth.value = val.borderRightWidth ?? defaultBorder.borderRightWidth
  borderBottomWidth.value = val.borderBottomWidth ?? defaultBorder.borderBottomWidth
  borderLeftWidth.value = val.borderLeftWidth ?? defaultBorder.borderLeftWidth
}

initValue(props.modelValue)

// 同步父组件 v-model
const handleChange = () => {
  const data: BorderStyleInfo = {
    borderStyle: borderStyle.value,
    borderColor: borderColor.value,
    borderTopWidth: borderTopWidth.value,
    borderRightWidth: borderRightWidth.value,
    borderBottomWidth: borderBottomWidth.value,
    borderLeftWidth: borderLeftWidth.value
  }
  emit('update:modelValue', data)
}

// 监听外部数据变化
watch(() => props.modelValue, (newVal) => {
  initValue(newVal)
}, { deep: true })
</script>

<style scoped>
.label-width {
  min-width: 40px;
}
</style>
