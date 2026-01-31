<template>
  <el-card>
    <el-tabs
    >
      <el-tab-pane :label="t('appearanceSettingsTheme')" name="first">{{ t('appearanceSettingsTheme')}}</el-tab-pane>
      <el-tab-pane :label="t('appearanceSettingsFont')" name="second">{{ t('appearanceSettingsFont')}}</el-tab-pane>
      <el-tab-pane :label="t('appearanceSettingsLayout')" name="third">{{ t('appearanceSettingsLayout')}}</el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="flex-row">
        <el-button type="warning" icon="close">{{ t('cancel')}}</el-button>
        <el-button type="success" icon="check" @click="doLogout">{{ t('save')}}</el-button>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function doLogout() {
  closeModal()
}
</script>

<style scoped>
</style>
