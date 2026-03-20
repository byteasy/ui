<template>
  <div class="el-card is-always-shadow ">
    <el-menu
      default-active="/platformCommon/favoriteSettings/appearanceSettings"
      class="el-menu-border m-1"
      :router="true"
      :collapse="collapse"
      unique-opened
      ref="refMenu"
    >
      <el-sub-menu index="/platformCommon/favoriteSettings">
        <template #title>
          <el-icon style="color: var(--my-menu-icon-color)"><User /></el-icon>
          <span class="my-font-size-md">{{ $t('platformCommon.favoriteSettings') }}</span>
        </template>
        <el-menu-item index="/platformCommon/favoriteSettings/appearanceSettings"
          ><span class="my-font-size">{{ $t('platformCommon.appearanceSettings') }}</span></el-menu-item
        >
        <el-menu-item index="/platformCommon/favoriteSettings/languageSettings"
          ><span class="my-font-size">{{ $t('platformCommon.languageSettings') }}</span></el-menu-item
        >
        <el-menu-item index="/platformCommon/favoriteSettings/personalInformation"
          ><span class="my-font-size">{{ $t('platformCommon.personalInformation') }}</span></el-menu-item
        >
        <el-menu-item index="/platformCommon/favoriteSettings/passwordSettings"
          ><span class="my-font-size">{{ $t('platformCommon.passwordSettings') }}</span></el-menu-item
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
const collapse = ref(false)

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
