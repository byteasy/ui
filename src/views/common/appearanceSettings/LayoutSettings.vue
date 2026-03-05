<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { tagView } = storeToRefs(appSettingsStore)
const tagViewValue = ref(tagView.value!)

function updateFontSize() {
  appSettingsStore.setTagView(tagViewValue.value!)
}
</script>

<template>
  <el-space direction="vertical" class="ml-5">
    <el-radio-group v-model="tagViewValue" @change="updateFontSize" >
      <div class="flex-column">
        <el-radio value="1">{{ $t('appearanceLayout.tagView') }}</el-radio>
        <el-radio value="0">{{ $t('appearanceLayout.breadCrumbView') }}</el-radio>
      </div>
    </el-radio-group>
  </el-space>
</template>

<style scoped></style>
