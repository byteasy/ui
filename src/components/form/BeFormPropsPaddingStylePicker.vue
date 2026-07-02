<template>
  <div class="w-full flex flex-column gap-1-2">
    <!-- 上内边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">上内边距:</el-text>
      <be-unit-input
        v-model="paddingTop"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 右内边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">右内边距:</el-text>
      <be-unit-input
        v-model="paddingRight"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 下内边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">下内边距:</el-text>
      <be-unit-input
        v-model="paddingBottom"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>

    <!-- 左内边距 -->
    <div class="flex-row w-full align-items-center gap-1-2">
      <el-text class="flex-none label-width" :size="props.size">左内边距:</el-text>
      <be-unit-input
        v-model="paddingLeft"
        :units="['px', 'vw', 'vh', 'rem', 'em', '%']"
        :size="props.size"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

export interface PaddingStyle {
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
}

interface Props {
  modelValue?: PaddingStyle
  size?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 默认内边距配置
const defaultPadding: PaddingStyle = {
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px'
}

// 绑定内部数据
const paddingTop = ref(defaultPadding.paddingTop)
const paddingRight = ref(defaultPadding.paddingRight)
const paddingBottom = ref(defaultPadding.paddingBottom)
const paddingLeft = ref(defaultPadding.paddingLeft)

// 初始化赋值（空值重置默认 + 字段缺失兜底）
const initValue = (val?: PaddingStyle) => {
  if (!val) {
    paddingTop.value = defaultPadding.paddingTop
    paddingRight.value = defaultPadding.paddingRight
    paddingBottom.value = defaultPadding.paddingBottom
    paddingLeft.value = defaultPadding.paddingLeft
    return
  }
  paddingTop.value = val.paddingTop ?? defaultPadding.paddingTop
  paddingRight.value = val.paddingRight ?? defaultPadding.paddingRight
  paddingBottom.value = val.paddingBottom ?? defaultPadding.paddingBottom
  paddingLeft.value = val.paddingLeft ?? defaultPadding.paddingLeft
}

initValue(props.modelValue)

// 同步父组件 v-model
const handleChange = () => {
  const data: PaddingStyle = {
    paddingTop: paddingTop.value,
    paddingRight: paddingRight.value,
    paddingBottom: paddingBottom.value,
    paddingLeft: paddingLeft.value
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
