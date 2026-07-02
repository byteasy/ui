<template>
  <div class="w-full flex flex-column gap-1-2">
    <!-- 左上角 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">左上:</el-text>
      <be-unit-input
        v-model="borderTopLeftRadius"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 右上角 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">右上:</el-text>
      <be-unit-input
        v-model="borderTopRightRadius"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 右下角 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">右下:</el-text>
      <be-unit-input
        v-model="borderBottomRightRadius"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 左下角 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">左下:</el-text>
      <be-unit-input
        v-model="borderBottomLeftRadius"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

export interface BorderRadiusStyle {
  borderTopLeftRadius: string
  borderTopRightRadius: string
  borderBottomRightRadius: string
  borderBottomLeftRadius: string
}

interface Props {
  modelValue?: BorderRadiusStyle
  size?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认圆角配置
const defaultRadius: BorderRadiusStyle = {
  borderTopLeftRadius: '0px',
  borderTopRightRadius: '0px',
  borderBottomRightRadius: '0px',
  borderBottomLeftRadius: '0px'
}

// 内部绑定变量
const borderTopLeftRadius = ref(defaultRadius.borderTopLeftRadius)
const borderTopRightRadius = ref(defaultRadius.borderTopRightRadius)
const borderBottomRightRadius = ref(defaultRadius.borderBottomRightRadius)
const borderBottomLeftRadius = ref(defaultRadius.borderBottomLeftRadius)

// 初始化赋值：空值重置默认 + 字段缺失兜底
const initValue = (val?: BorderRadiusStyle) => {
  if (!val) {
    borderTopLeftRadius.value = defaultRadius.borderTopLeftRadius
    borderTopRightRadius.value = defaultRadius.borderTopRightRadius
    borderBottomRightRadius.value = defaultRadius.borderBottomRightRadius
    borderBottomLeftRadius.value = defaultRadius.borderBottomLeftRadius
    return
  }
  borderTopLeftRadius.value = val.borderTopLeftRadius ?? defaultRadius.borderTopLeftRadius
  borderTopRightRadius.value = val.borderTopRightRadius ?? defaultRadius.borderTopRightRadius
  borderBottomRightRadius.value = val.borderBottomRightRadius ?? defaultRadius.borderBottomRightRadius
  borderBottomLeftRadius.value = val.borderBottomLeftRadius ?? defaultRadius.borderBottomLeftRadius
}

initValue(props.modelValue)

// 同步父组件
const handleChange = () => {
  const data: BorderRadiusStyle = {
    borderTopLeftRadius: borderTopLeftRadius.value,
    borderTopRightRadius: borderTopRightRadius.value,
    borderBottomRightRadius: borderBottomRightRadius.value,
    borderBottomLeftRadius: borderBottomLeftRadius.value
  }
  emit('update:modelValue', data)
}

// 监听外部数据变更
watch(() => props.modelValue, (newVal) => {
  initValue(newVal)
}, { deep: true })
</script>

<style scoped>
.label-width {
  min-width: 40px;
}
</style>
