<template>
  <div>
    <el-menu
      default-active="/frame/favoriteSettings/appearanceSettings"
      class="el-menu-border"
      :router="true"
      ref="refMenu"
    >
      <el-sub-menu index="/frame/favoriteSettings">
        <template #title>
          <el-icon><operation /></el-icon>
          <span class="my-font-size-md">{{ $t('favoriteSettings') }}</span>
        </template>
        <el-menu-item index="/frame/favoriteSettings/appearanceSettings"
          ><span class="my-font-size">{{ $t('appearanceSettings') }}</span></el-menu-item
        >
        <el-menu-item index="/frame/favoriteSettings/languageSettings"
          ><span class="my-font-size">{{ $t('languageSettings') }}</span></el-menu-item
        >
        <el-menu-item index="/frame/favoriteSettings/personalSettings"
          ><span class="my-font-size">{{ $t('personalSettings') }}</span></el-menu-item
        >
        <el-menu-item index="/frame/favoriteSettings/passwordSettings"
          ><span class="my-font-size">{{ $t('passwordSettings') }}</span></el-menu-item
        >
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const refMenu = ref()

onMounted(() => {
  refMenu.value?.updateActiveIndex(route.fullPath)
})

watch(
  () => route.path,
  () => {
    console.log(route.fullPath)
    refMenu.value?.updateActiveIndex(route.fullPath)
  },
)
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
