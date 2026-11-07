<template>
  <div class="el-card is-always-shadow">
    <el-menu
      class="el-menu-border m-1"
      :router="false"
      :collapse="collapse"
      unique-opened
      ref="refMenu"
    >
      <!-- 🔥 循环根节点，直接交给递归组件处理 -->
      <template v-for="root in menuTree" :key="root.code">
        <sub-menu-item
          :item="root"
          :parent-path="''"
          :depth="0"
          @open="openResource"
        />
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doHttpGet } from '@/api/common/platform';
import router from '@/router';
import SubMenuItem from './SubMenuItem.vue'; // 引入刚才创建的递归项

const route = useRoute();
const refMenu = ref();
const collapse = ref(false);
const menuTree = ref<any[]>([]);

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resources/leftMenu', {
    fullPath: route.fullPath,
  }).then((response) => {
    menuTree.value = response.data || [];
    nextTick(() => {
      refMenu.value?.updateActiveIndex(getUrl(route.fullPath));
    });
  });
});

watch(
  () => route.path,
  () => {
    refMenu.value?.updateActiveIndex(getUrl(route.fullPath));
  }
);

function getUrl(path: string) {
  if (!path) return '';
  return path.includes('?') ? path.split('?')[0] : path;
}

function closeOrOpenMenu(size: number) {
  collapse.value = size < 150;
}

/**
 * 统一处理打开/跳转资源
 */
function openResource(fullPath: string, resource: any) {
  if (resource.openTab === 'YES') {
    if (resource.routerUrl?.startsWith('http')) {
      window.open(resource.routerUrl, '_blank');
    } else {
      const baseUrl = window.location.origin + window.location.pathname;
      window.open(baseUrl + '#' + fullPath, '_blank');
    }
  } else {
    router.push(fullPath);
  }
}

defineExpose({ closeOrOpenMenu });
</script>

<style scoped>
.el-menu-border {
  border-right: 0;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--my-bg-menu-item-active-color);
}
</style>
