<template>
  <el-radio-group v-model="theme">
    <el-space wrap>
      <div class="flex-column align-items-center">
        <IconLocalThemeGreen />
        <el-radio value="green">{{ $t('appearanceTheme.themeGreen')}}</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeBlue />
        <el-radio value="blue">{{ $t('appearanceTheme.themeBlue')}}</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeDark />
        <el-radio value="dark">{{ $t('appearanceTheme.themeDark')}}</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeLight />
        <el-radio value="light">{{ $t('appearanceTheme.themeLight')}}</el-radio>
      </div>
    </el-space>
  </el-radio-group>
</template>
<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { theme } = storeToRefs(appSettingsStore)

watch(
  () => theme.value,
  (newTheme, oldTheme) => {
    appSettingsStore.setTheme(newTheme === null ? 'light' : newTheme)
  },
  { immediate: true }, // 是否立即执行一次
)
</script>
