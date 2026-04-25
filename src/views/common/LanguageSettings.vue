<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {langList} from "@/locales/common.ts";

const { t, locale } = useI18n()
const appSettingsStore = useAppSettingsStore()
const { lang } = storeToRefs(appSettingsStore)
const langValue = ref(lang.value!)

function updateFontSize() {
  appSettingsStore.setLang(langValue.value!)
  locale.value = langValue.value!
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
    <el-form label-width="auto" style="padding: 20px;">
      <el-form-item prop="delivery" :label="$t('appearanceLanguage.showLanguage')">
        <el-radio-group v-model="langValue" @change="updateFontSize" style="width: 240px;">
          <el-radio :value="lang.value" v-for="lang in langList" :key="lang.value">{{ lang.label }} -- {{ lang.description }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
</template>

<style scoped>
</style>
