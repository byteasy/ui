<template>
  <div>
    <el-menu default-active="1-1" class="el-menu-border">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><operation /></el-icon>
          <span>偏好设置</span>
        </template>
        <el-menu-item index="1-3">{{ t('appearanceSettings') }}</el-menu-item>
        <el-menu-item index="1-2">{{ t('languageSettings') }}</el-menu-item>
        <el-menu-item index="1-1">{{ t('personalSettings') }}</el-menu-item>
        <el-menu-item index="1-4">{{ t('passwordSettings') }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<style scoped>
.el-menu-border {
  border-right: 0;
}
.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-menu-active-color);
}
</style>
