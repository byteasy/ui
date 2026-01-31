<template>
  <el-radio-group v-model="theme">
    <el-space wrap>
      <div class="flex-column align-items-center">
        <IconLocalThemeGreen />
        <el-radio value="green">粒子绿</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeBlue />
        <el-radio value="blue">科技蓝</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeDark />
        <el-radio value="dark">炫酷黑</el-radio>
      </div>
      <div class="flex-column align-items-center">
        <IconLocalThemeLight />
        <el-radio value="light">明亮风</el-radio>
      </div>
    </el-space>
  </el-radio-group>
</template>
<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'

const appSettingsStore = useAppSettingsStore()
const { theme } = storeToRefs(appSettingsStore)

</script>
