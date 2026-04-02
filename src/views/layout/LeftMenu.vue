<template>
  <div class="el-card is-always-shadow">
    <el-menu
      class="el-menu-border m-1"
      :router="true"
      :collapse="collapse"
      unique-opened
      ref="refMenu"
    >
      <el-sub-menu :index="root.routerUrl" v-for="root in menuTree" :key="root.code">
        <template #title>
          <tuna-svg-icon :svg="root.icon" />
          <span class="my-font-size-md">{{ root.name }}</span>
        </template>
        <el-menu-item :index="root.routerUrl" v-if="root.type === 'MENU' && root.visible === 'YES'">
          <el-icon style="color: var(--my-menu-icon-color)"
          ><component :is="'IconLocalHome'"
          /></el-icon>
          <span class="pl-3">{{ root.name }}</span>
        </el-menu-item>

        <template v-else v-for="subMenu in root.childrenList" :key="subMenu.code">
          <el-sub-menu :index="root.routerUrl + '/' + subMenu.routerUrl" v-if="subMenu.hasOwnProperty('childrenList') && subMenu.childrenList !== null && subMenu.type === 'DIRECTORY' && subMenu.visible === 'YES'">
            <template #title>
              <span class="pl-3">{{ subMenu.name }}</span>
            </template>
            <template v-for="subsubMenu in subMenu.childrenList" :key="subsubMenu.code">
              <el-menu-item :index="root.routerUrl + '/' + subMenu.routerUrl + '/' + subsubMenu.routerUrl">
                <span class="pl-3">{{ subsubMenu.name }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item :index="root.routerUrl + '/' + subMenu.routerUrl" v-if="subMenu.type === 'MENU' && subMenu.visible === 'YES'">
            <span class="pl-3">{{ subMenu.name }}</span>
          </el-menu-item>
        </template>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { doHttpGet } from '@/api/common/platform'
import TunaSvgIcon from '@/components/TunaSvgIcon.vue'

const route = useRoute()
const refMenu = ref()
const collapse = ref(false)

const menuTree = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resources/leftMenu', {
    fullPath: route.fullPath,
  }).then((response) => {
    menuTree.value = response.data
    refMenu.value?.updateActiveIndex(route.fullPath)
  })
})

watch(
  () => route.path,
  () => {
    console.log(route.fullPath)
    refMenu.value?.updateActiveIndex(route.fullPath)
  },
)

function closeOrOpenMenu(size) {
  if (size < 150) {
    collapse.value = true
  } else {
    collapse.value = false
  }
}

defineExpose({ closeOrOpenMenu })

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
