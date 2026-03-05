<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const appSettingsStore = useAppSettingsStore()
const { lang } = storeToRefs(appSettingsStore)
const langValue = ref(lang.value!)

function updateFontSize() {
  appSettingsStore.setLang(langValue.value!)
  ElMessageBox.confirm(t('appearanceLanguage.changeWarn'), t('warning'), {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  })
    .then(() => {
      window.location.reload()
    })
    .catch(() => {})
}
</script>

<template>
  <el-space direction="vertical" style="width: 20vw">
    <el-radio-group v-model="langValue" @change="updateFontSize">
      <div class="flex-column">
        <el-radio value="zh-cn">{{ $t('appearanceLanguage.zh') }}</el-radio>
        <el-radio value="en">{{ $t('appearanceLanguage.en') }}</el-radio>
      </div>
    </el-radio-group>
  </el-space>
</template>

<style scoped></style>
