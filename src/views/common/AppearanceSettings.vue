<template>
  <el-tabs default-value="first">
    <el-tab-pane :label="$t('appearanceSettingsTheme')" name="first">
      <theme-settings />
    </el-tab-pane>
    <el-tab-pane :label="$t('appearanceSettingsFont')" name="second">
      <component-size-settings />
    </el-tab-pane>
    <el-tab-pane :label="$t('appearanceSettingsLayout')" name="third">
      <layout-settings />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import ThemeSettings from '@/views/common/ThemeSettings.vue'
import ComponentSizeSettings from '@/views/common/ComponentSizeSettings.vue'
import LayoutSettings from '@/views/common/LayoutSettings.vue'

</script>

<style scoped></style>
