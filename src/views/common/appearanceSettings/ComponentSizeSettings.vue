<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { componentSize } = storeToRefs(appSettingsStore)
const fontSize = ref(componentSize.value!)

function updateFontSize() {
  appSettingsStore.setComponentSize(fontSize.value!)
}
</script>

<template>
  <el-space direction="vertical" class="ml-5">
    <el-radio-group v-model="fontSize" @change="updateFontSize">
      <div class="flex-column">
        <el-radio value="small">{{ $t('appearanceFontSize.small') }}</el-radio>
        <div class="flex-row">
          <el-radio value="default">{{ $t('appearanceFontSize.default') }}</el-radio
          ><el-text type="info">{{ $t('appearanceFontSize.defaultWarn') }}</el-text>
        </div>
        <div class="flex-row">
          <el-radio value="large">{{ $t('appearanceFontSize.large') }}</el-radio
          ><el-text type="info">{{ $t('appearanceFontSize.largeWarn') }}</el-text>
        </div>
      </div>
    </el-radio-group>
  </el-space>
</template>

<style scoped></style>
