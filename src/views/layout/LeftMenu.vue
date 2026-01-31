<template>
  <div>
    <el-menu default-active="/frame/favoriteSettings/appearanceSettings" class="el-menu-border" :router="true">
      <el-sub-menu index="/frame/favoriteSettings">
        <template #title>
          <el-icon><operation /></el-icon>
          <span>{{ t('favoriteSettings') }}</span>
        </template>
        <el-menu-item index="/frame/favoriteSettings/appearanceSettings">{{ t('appearanceSettings') }}</el-menu-item>
        <el-menu-item index="/frame/favoriteSettings/languageSettings">{{ t('languageSettings') }}</el-menu-item>
        <el-menu-item index="/frame/favoriteSettings/personalSettings">{{ t('personalSettings') }}</el-menu-item>
        <el-menu-item index="/frame/favoriteSettings/passwordSettings">{{ t('passwordSettings') }}</el-menu-item>
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
