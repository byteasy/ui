<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal'
import whiteLogo from '@/assets/img/black-logo.png'
import defaultAvatar from '@/assets/img/defaultAvatar.png'
import { useI18n } from 'vue-i18n'
import AppearanceSettings from '@/views/common/AppearanceSettings.vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

function onpersonalSettingsClick() {
  openModal(AppearanceSettings, {}, { backgroundClose: true, draggable: true })
}

function onAppearanceSettingsClick() {
  router.push('/frame/favoriteSettings/appearanceSettings')
}
</script>

<template>
  <div class="navbar-layout bg-color-page">
    <div class="flex-row">
      <img :src="whiteLogo" class="system_logo" alt="" />
      <span class="system-title">-{{ t('title') }}</span>
    </div>
    <div>
      <el-dropdown :placement="'bottom-start'">
        <div class="el-dropdown-link">
          <div class="flex-row">
            <el-avatar
              :size="35"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            >
              <img :src="defaultAvatar" />
            </el-avatar>
            <div class="flex-column ml-2">
              <span style="color: var(--el-text-color-primary)" class="font-bold-700">王手和</span>
              <span style="color: var(--el-color-info)" class="mt-1">信息化管理部</span>
            </div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onpersonalSettingsClick">
              <div class="flex-row">
                <IconLocalAccount style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('personalSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="onpersonalSettingsClick">
              <div class="flex-row">
                <IconLocalPassword style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('passwordSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="onAppearanceSettingsClick">
              <div class="flex-row">
                <IconLocalShowSettings style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('appearanceSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="flex-row">
                <IconLocalLanguage style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('languageSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <div class="flex-row">
                <IconLocalExit style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('exit') }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.navbar-layout {
  height: 55px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 16px; /* 添加左右内边距 */
}

.system_logo {
  display: inline-block;
  margin-left: 0;
  height: 55px;
}

.system-title {
  font-size: 1.1rem;
  font-weight: bold; /* 加粗 */
  color: var(--el-text-color-primary);

  /* 完美垂直居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 55px; /* 与 navbar 同高 */
  line-height: 1;
  /* 可选字体增强 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}
</style>
