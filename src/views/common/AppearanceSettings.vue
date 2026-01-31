<template>
  <el-tabs default-value="first">
    <el-tab-pane :label="t('appearanceSettingsTheme')" name="first">
      <theme-settings />
    </el-tab-pane>
    <el-tab-pane :label="t('appearanceSettingsFont')" name="second">{{
      t('appearanceSettingsFont')
    }}</el-tab-pane>
    <el-tab-pane :label="t('appearanceSettingsLayout')" name="third">{{
      t('appearanceSettingsLayout')
    }}</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { useI18n } from 'vue-i18n'
import ThemeSettings from '@/views/common/ThemeSettings.vue'

const { t } = useI18n()

function doLogout() {
  closeModal()
}
</script>

<style scoped></style>
