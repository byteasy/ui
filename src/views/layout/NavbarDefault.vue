<script setup lang="ts">
import TopMenu from '@/views/layout/TopMenu.vue'
import blackLogo from '@/assets/img/black-logo.png'
import whiteLogo from '@/assets/img/white-logo.png'
import defaultAvatar from '@/assets/img/defaultAvatar.png'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
const appSettingsStore = useAppSettingsStore()
const { theme: storeTheme } = storeToRefs(appSettingsStore)
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { getLoginPersonalInfo } from '@/api/common/user'

const loginUser = ref({})
// 创建一个中转计算属性
const theme = computed({
  get: () => storeTheme.value ?? 'light', // 读取时：如果 store 里是 null，返回 'light'
  set: (val) => {
    appSettingsStore.setTheme(val) // 写入时：调用 store 的方法更新
  },
})

const searchValue = ref('')
const { t } = useI18n()
const router = useRouter()

function onSettingsClick(name) {
  router.push('/platformCommon/favoriteSettings/' + name)
}

function onLogoutClick() {
  window.location.href = '/platformSvr/logout'
}

onMounted(() => {
  getLoginPersonalInfo().then((rsp) => {
    loginUser.value = rsp.data
  })
})
</script>

<template>
  <div class="navbar-layout my-bg-color-page">
    <div class="flex-row align-items-center flex-grow-2">
      <div class="flex-row flex-grow align-items-center justify-content-start">
        <img :src="theme === 'light' ? blackLogo : whiteLogo" class="system_logo" alt="" />
        <!--      <span class="system-title">-{{ t('title') }}</span>-->
      </div>
      <div class="flex-row flex-grow align-items-center justify-content-start">
        <top-menu />
      </div>
    </div>
    <div class="flex-row align-items-center flex-grow justify-content-end">
      <div class="flex-row align-items-center">

      <el-input
        v-model="searchValue"
        placeholder="Please Input"
        suffix-icon="Search"
        class="custom-search-input mr-3"
      />
      <el-icon class="mr-3" size="30" style="color: var(--my-text-color)" :title="$t('help')"
        ><QuestionFilled
      /></el-icon>
      <el-dropdown :placement="'bottom-start'">
        <div class="el-dropdown-link">
          <div class="flex-row align-items-center">
            <el-avatar :size="45" :src="loginUser.avatar">
              <img :src="defaultAvatar" />
            </el-avatar>
            <div class="flex-column ml-2" >
              <el-text style="color: var(--my-text-color); font-size: var(--my-font-size)" class="font-bold-700" truncated>
                {{ loginUser.realName }}
              </el-text>
              <el-text style="color: var(--my-text-gray); font-size: var(--my-font-size)" class="mt-1" truncated>
                {{ loginUser.orgName }}
              </el-text>
            </div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onSettingsClick('personalInformation')">
              <div class="flex-row align-items-center">
                <IconLocalAccount style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('platformCommon.personalInformation') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="onSettingsClick('passwordSettings')">
              <div class="flex-row align-items-center">
                <IconLocalPassword style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('platformCommon.passwordSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="onSettingsClick('appearanceSettings')">
              <div class="flex-row align-items-center">
                <IconLocalShowSettings style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('platformCommon.appearanceSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="onSettingsClick('languageSettings')">
              <div class="flex-row align-items-center">
                <IconLocalLanguage style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('platformCommon.languageSettings') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided @click="onLogoutClick()">
              <div class="flex-row align-items-center">
                <IconLocalExit style="width: 0.8rem; height: 0.8rem" />
                <span class="ml-2">{{ t('exit') }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      </div>
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
  font-size: var(--my-font-size-2xl);
  font-weight: bold; /* 加粗 */
  color: var(--my-text-color);

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

/* 深度选择器修改 Element Plus 内部样式 */
.custom-search-input :deep(.el-input__wrapper) {
  width: 220px; /* 稍微加宽一点，视觉更舒展 */
  border-radius: 20px; /* 胶囊形状圆角 */
  background-color: var(--el-fill-color-lighter); /* 浅色背景 */
  box-shadow: none; /* 去除默认投影 */
  border: 1px solid var(--el-border-color);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 悬停样式 */
.custom-search-input :deep(.el-input__wrapper):hover {
  border-color: var(--el-color-primary-light-3);
  background-color: var(--el-bg-color);
}

/* 聚焦样式：增加呼吸感阴影 */
.custom-search-input :deep(.el-input__wrapper.is-focus) {
  width: 260px; /* 聚焦时轻轻展开，增加交互动效 */
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-8) !important;
  background-color: var(--el-bg-color);
}

/* 图标颜色优化 */
.custom-search-input :deep(.el-input__icon) {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
}
</style>
