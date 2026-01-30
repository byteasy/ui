<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ t('settingsVisible') }}</span>
      </div>
    </template>
    <el-tabs
    >
      <el-tab-pane :label="t('settingsVisibleTheme')" name="first">{{ t('settingsVisibleTheme')}}</el-tab-pane>
      <el-tab-pane :label="t('settingsVisibleFont')" name="second">{{ t('settingsVisibleFont')}}</el-tab-pane>
      <el-tab-pane :label="t('settingsVisibleLayout')" name="third">{{ t('settingsVisibleLayout')}}</el-tab-pane>
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
