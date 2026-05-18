<script setup lang="ts">
import { useAppSettingsStore } from '@/stores/appSettings.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const appSettingsStore = useAppSettingsStore()
const { dialogModel, closeOnClickModal, drawerDirection, componentCacheEnable } = storeToRefs(appSettingsStore)
const dialogModelValue = ref(dialogModel.value!)
const closeOnClickModalValue = ref(closeOnClickModal.value!)
const drawerDirectionValue = ref(drawerDirection.value!)
const componentCacheEnableValue = ref(componentCacheEnable.value!)

function updateDialogModel() {
  appSettingsStore.setDialogModel(dialogModelValue.value!)
}

function updateCloseOnClickModalValue() {
  appSettingsStore.setCloseOnClickModal(closeOnClickModalValue.value!)
}

function updateDrawerDirectionValue() {
  appSettingsStore.setDrawerDirection(drawerDirectionValue.value!)
}

function updateComponentCacheEnableValue() {
  appSettingsStore.setComponentCacheEnable(componentCacheEnableValue.value!)
}
</script>

<template>
  <el-space direction="vertical" class="ml-5">
    <el-form style="max-width: 600px">
      <el-form-item :label="$t('appearanceFavorite.popupMode')" prop="delivery">
        <el-radio-group v-model="dialogModelValue" @change="updateDialogModel">
          <el-radio value="1">{{ $t('appearanceFavorite.dialog') }}</el-radio>
          <el-radio value="0">{{ $t('appearanceFavorite.drawer') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('appearanceFavorite.closeOnClickModal')" prop="delivery">
        <el-radio-group v-model="closeOnClickModalValue" @change="updateCloseOnClickModalValue">
          <el-radio value="1">{{ $t('appearanceFavorite.closeOnClickModalEnable') }}</el-radio>
          <el-radio value="0">{{ $t('appearanceFavorite.closeOnClickModalDisabled') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('appearanceFavorite.drawerDirection')" prop="delivery" v-if="dialogModelValue === '0'">
        <el-radio-group v-model="drawerDirectionValue" @change="updateDrawerDirectionValue">
          <el-radio value="rtl">{{ $t('appearanceFavorite.drawerDirectionRtl') }}</el-radio>
          <el-radio value="ltr">{{ $t('appearanceFavorite.drawerDirectionLtr') }}</el-radio>
          <el-radio value="ttb">{{ $t('appearanceFavorite.drawerDirectionTtb') }}</el-radio>
          <el-radio value="btt">{{ $t('appearanceFavorite.drawerDirectionBtt') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('appearanceFavorite.componentCacheEnable')" prop="delivery">
        <el-radio-group v-model="componentCacheEnableValue" @change="updateComponentCacheEnableValue">
          <el-radio value="1">{{ $t('appearanceFavorite.componentCacheEnableOpen') }}</el-radio>
          <el-radio value="0">{{ $t('appearanceFavorite.componentCacheEnableClose') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-space>
</template>

<style scoped></style>
