<template>
  <div class="el-card is-always-shadow">
    <el-menu
      class="el-menu-border m-1"
      :router="false"
      :collapse="collapse"
      unique-opened
      ref="refMenu"
    >
      <el-sub-menu :index="getUrl(root.routerUrl)" v-for="root in menuTree" :key="root.code">
        <template #title>
          <be-svg-icon :svg="root.icon" :style-var="'var(--my-menu-icon-color)'"/>
          <be-i18n-value :model-value="root.name" class="my-font-size-md"/>
        </template>
        <el-menu-item :index="getUrl(root.routerUrl)"
                      v-if="root.type === 'MENU' && root.visible === 'YES'"
                      @click="openResource(root.routerUrl, root)">
          <el-icon style="color: var(--my-menu-icon-color)">
            <component :is="'IconLocalHome'" />
          </el-icon>
          <be-i18n-value :model-value="root.name" class="pl-3"/>
        </el-menu-item>

        <template v-else v-for="subMenu in root.childrenList" :key="subMenu.code">
          <el-sub-menu :index="getUrl(root.routerUrl) + '/' + getUrl(subMenu.routerUrl)"
                       v-if="subMenu.hasOwnProperty('childrenList') && subMenu.childrenList !== null && subMenu.type === 'DIRECTORY' && subMenu.visible === 'YES'">
            <template #title>
              <be-i18n-value :model-value="subMenu.name" class="pl-3"/>
            </template>
            <template v-for="subsubMenu in subMenu.childrenList" :key="subsubMenu.code">
              <el-menu-item
                :index="getUrl(root.routerUrl) + '/' + getUrl(subMenu.routerUrl) + '/' + getUrl(subsubMenu.routerUrl)"
                @click="openResource(root.routerUrl + '/' + subMenu.routerUrl + '/' + subsubMenu.routerUrl, subsubMenu)">
                <be-i18n-value :model-value="subsubMenu.name" class="pl-3"/>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item :index="getUrl(root.routerUrl) + '/' + getUrl(subMenu.routerUrl)"
                        @click="openResource(root.routerUrl + '/' + subMenu.routerUrl, subMenu)"
                        v-if="subMenu.type === 'MENU' && subMenu.visible === 'YES'">
            <be-i18n-value :model-value="subMenu.name" class="pl-3"/>
          </el-menu-item>
        </template>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {doHttpGet} from '@/api/common/platform'
import BeSvgIcon from '@/components/BeSvgIcon.vue'
import router from "@/router";

const route = useRoute()
const refMenu = ref()
const collapse = ref(false)

const menuTree = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resources/leftMenu', {
    fullPath: route.fullPath,
  }).then((response) => {
    menuTree.value = response.data
    refMenu.value?.updateActiveIndex(getUrl(route.fullPath))
  })
})

watch(
  () => route.path,
  () => {
    refMenu.value?.updateActiveIndex(getUrl(route.fullPath))
  },
)

function getUrl(path) {
  if (path.indexOf('?') >= 0) {
    return path.split('?')[0]
  }
  return path
}

function closeOrOpenMenu(size) {
  if (size < 150) {
    collapse.value = true
  } else {
    collapse.value = false
  }
}

function openResource(fullPath, resource) {
  if (resource.openTab === 'YES') {
    if (resource.routerUrl.startsWith('http')) {
      window.open(resource.routerUrl, '_blank');
    } else {
      const baseUrl = window.location.origin + window.location.pathname
      window.open(baseUrl + '#' + resource.routerUrl, '_blank');
    }
  } else {
    router.push(fullPath)
  }
}

defineExpose({closeOrOpenMenu})

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
