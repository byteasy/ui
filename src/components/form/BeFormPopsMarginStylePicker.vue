<template>
  <div class="w-full flex flex-column gap-1-2">
    <!-- 上边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">上边距:</el-text>
      <be-unit-input
        v-model="marginTop"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 右边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">右边距:</el-text>
      <be-unit-input
        v-model="marginRight"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 下边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">下边距:</el-text>
      <be-unit-input
        v-model="marginBottom"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 左边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">左边距:</el-text>
      <be-unit-input
        v-model="marginLeft"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

export interface MarginStyle {
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
}

interface Props {
  modelValue?: MarginStyle
  size?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认边距配置
const defaultMargin: MarginStyle = {
  marginTop: '0px',
  marginRight: '0px',
  marginBottom: '0px',
  marginLeft: '0px'
}

// 绑定内部数据
const marginTop = ref(defaultMargin.marginTop)
const marginRight = ref(defaultMargin.marginRight)
const marginBottom = ref(defaultMargin.marginBottom)
const marginLeft = ref(defaultMargin.marginLeft)

// 初始化赋值
const initValue = (val?: MarginStyle) => {
  if (!val) return
  marginTop.value = val.marginTop
  marginRight.value = val.marginRight
  marginBottom.value = val.marginBottom
  marginLeft.value = val.marginLeft
}

initValue(props.modelValue)

// 同步父组件 v-model
const handleChange = () => {
  const data: MarginStyle = {
    marginTop: marginTop.value,
    marginRight: marginRight.value,
    marginBottom: marginBottom.value,
    marginLeft: marginLeft.value
  }
  emit('update:modelValue', data)
}

// 监听外部 modelValue 变更
watch(() => props.modelValue, (newVal) => {
  initValue(newVal)
}, { deep: true })
</script>

<style scoped>
.label-width {
  min-width: 40px;
}
</style>
