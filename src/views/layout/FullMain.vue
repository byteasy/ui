<template>
  <el-config-provider :locale="locale" :size="componentSize as any">
    <div class="pl-1 pt-1 pr-1 w-full h-full my-bg-color-blank">
      <div class="flex-column h-full w-full">
        <div class="el-card is-always-shadow p-2 mt-1 flex-grow" style="width: 100%">
          <div class="h-full">
            <router-view v-slot="{ Component, route }">
              <transition name="fade" mode="out-in">
                <keep-alive>
                  <component
                    :is="Component"
                    :key="route.name"
                    v-if="permissionLoaded && !route.meta.noCache && componentCacheEnable === '1'"
                  />
                </keep-alive>
              </transition>
              <transition name="fade" mode="out-in">
                <component
                  :is="Component"
                  :key="route.name"
                  v-if="
                    permissionLoaded &&
                    (route.meta.noCache === true || componentCacheEnable === '0')
                  "
                />
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useAppSettingsStore } from '@/stores/appSettings.ts';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref } from 'vue';
import { elementLocales } from '@/locales/common.ts';
import { useRoute } from 'vue-router';
import { executeOpenApi } from '@/api/common/platform';
import { useSessionStore } from '@/stores/session.ts';

const sessionStore = useSessionStore();
const route = useRoute();
const permissionLoaded = ref(false);

const appSettingsStore = useAppSettingsStore();
const { componentSize, lang, componentCacheEnable } = storeToRefs(appSettingsStore);
const locale = computed(() => elementLocales[lang.value]);

onBeforeMount(() => {
  executeOpenApi('4GeKVReTA', { fullPath: route.fullPath }, {}).then((response) => {
    response.data.forEach((item) => {
      sessionStore.addAuthorizedCode(item);
    });
    permissionLoaded.value = true;
  });
});
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 保持页面切换时的滚动位置 */
.router-view-container {
  min-height: 100%;
}
</style>
