<template>
  <tuna-viewer context="platform" class-name="com.tuna.platform.vo.PersonalSettingsVO" :entity="user" :title="$t('user.basic')" @edit-click="editEnable = !editEnable">
    <template v-slot:view_avatar="scope">
      <el-avatar shape="square" :size="100" fit="scale-down" :src="scope.value" v-if="!editEnable"/>
    </template>
  </tuna-viewer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { getLoginPersonalInfo } from '@/api/common/user'

const { t } = useI18n() // 表单引用
const user = ref({})
const editEnable = ref(false)

onMounted(() => {
  getLoginPersonalInfo().then(rsp => {
    user.value = rsp.data
  })
})
</script>

<style scoped></style>
