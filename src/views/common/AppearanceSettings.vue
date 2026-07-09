<template>
  <el-tabs default-value="first" style="width: 100%;">
    <el-tab-pane :label="$t('appearanceSettingsTheme')" name="first">
      <theme-settings />
    </el-tab-pane>
    <el-tab-pane :label="$t('appearanceSettingsFont')" name="second">
      <component-size-settings />
    </el-tab-pane>
    <el-tab-pane :label="$t('appearanceSettingsLayout')" name="third">
      <layout-settings />
    </el-tab-pane>
    <el-tab-pane :label="$t('appearanceSettingsFavorite')" name="forth">
      <favorite-settings />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import ThemeSettings from '@/views/common/appearanceSettings/ThemeSettings.vue'
import ComponentSizeSettings from '@/views/common/appearanceSettings/ComponentSizeSettings.vue'
import LayoutSettings from '@/views/common/appearanceSettings/LayoutSettings.vue'
import FavoriteSettings from '@/views/common/appearanceSettings/FavoriteSettings.vue'

</script>

<style scoped></style>
