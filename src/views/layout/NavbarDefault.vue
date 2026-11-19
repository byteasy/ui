<script setup lang="ts">
import TopMenu from '@/views/layout/TopMenu.vue'
import defaultAvatar from '@/assets/img/defaultAvatar.png'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { getLoginPersonalInfo } from '@/api/common/user'
import { doHttpGet } from '@/api/common/platform'

const appSettingsStore = useAppSettingsStore()
const { theme: storeTheme } = storeToRefs(appSettingsStore)

const loginUser = ref({})

// 创建一个中转计算属性
const theme = computed({
  get: () => storeTheme.value ?? 'light',
  set: (val) => {
    appSettingsStore.setTheme(val)
  },
})

const searchValue = ref('')
const { t } = useI18n()
const router = useRouter()

// 回车或点击搜索图标触发跳转
function onSearch() {
  const keyword = searchValue.value?.trim()

  doHttpGet('/platformSvr/sapi/platformSettings/searchRoute', {}).then(rsp => {
    router.push({
      path: rsp.data,
      // 如果有输入则携带 query 参数 keyword，如果没有输入则直接跳转
      query: keyword ? { keyword } : {},
    })
  })
}

function onSettingsClick(name: string) {
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
        <img
          :src="
            theme === 'light'
              ? '/platformSvr/papi/theme/img/logoImg'
              : '/platformSvr/papi/theme/img/logoImgWhite'
          "
          class="system_logo"
          alt=""
        />
      </div>
      <div class="flex-row flex-grow align-items-center justify-content-start">
        <top-menu />
      </div>
    </div>
    <div class="flex-row align-items-center flex-grow justify-content-end">
      <div class="flex-row align-items-center">
        <!-- 核心改动：监听 @keyup.enter 回车事件，点击放大镜图标也可以触发搜索 -->
        <el-input
          v-model="searchValue"
          :placeholder="$t('searchByKeyword')"
          suffix-icon="Search"
          class="custom-search-input mr-3"
          clearable
          @keyup.enter="onSearch"
          @click:suffix="onSearch"
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
              <div class="flex-column ml-2">
                <el-text
                  style="color: var(--my-text-color); font-size: var(--my-font-size)"
                  class="font-bold-700"
                  truncated
                >
                  {{ loginUser.realName }}
                </el-text>
                <el-text
                  style="color: var(--my-text-gray); font-size: var(--my-font-size)"
                  class="mt-1"
                  truncated
                >
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
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.system_logo {
  display: inline-block;
  margin-left: 0;
  height: 55px;
}

.system-title {
  font-size: var(--my-font-size-2xl);
  font-weight: bold;
  color: var(--my-text-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.custom-search-input :deep(.el-input__wrapper) {
  width: 220px;
  border-radius: 20px;
  background-color: var(--el-fill-color-lighter);
  box-shadow: none;
  border: 1px solid var(--el-border-color);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.custom-search-input :deep(.el-input__wrapper):hover {
  border-color: var(--el-color-primary-light-3);
  background-color: var(--el-bg-color);
}

.custom-search-input :deep(.el-input__wrapper.is-focus) {
  width: 260px;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-8) !important;
  background-color: var(--el-bg-color);
}

.custom-search-input :deep(.el-input__icon) {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
  cursor: pointer;
}
</style>
