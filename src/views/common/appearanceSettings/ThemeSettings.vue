<template>
  <el-form >
    <el-form-item prop="delivery">
      <el-radio-group v-model="theme">
        <div class="flex-column align-items-center">
          <IconLocalThemeGreen />
          <el-radio value="green">{{ $t('appearanceTheme.themeGreen') }}</el-radio>
        </div>
        <div class="flex-column align-items-center">
          <IconLocalThemeBlue />
          <el-radio value="blue">{{ $t('appearanceTheme.themeBlue') }}</el-radio>
        </div>
        <div class="flex-column align-items-center">
          <IconLocalThemeDark />
          <el-radio value="dark">{{ $t('appearanceTheme.themeDark') }}</el-radio>
        </div>
        <div class="flex-column align-items-center">
          <IconLocalThemeLight />
          <el-radio value="light">{{ $t('appearanceTheme.themeLight') }}</el-radio>
        </div>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { theme: storeTheme } = storeToRefs(appSettingsStore)

// 创建一个中转计算属性
const theme = computed({
  get: () => storeTheme.value ?? 'light', // 读取时：如果 store 里是 null，返回 'light'
  set: (val) => {
    appSettingsStore.setTheme(val) // 写入时：调用 store 的方法更新
  },
})
</script>
