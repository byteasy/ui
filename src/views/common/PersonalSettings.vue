<template>
  <personal-settings-view :user="user" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { getLoginPersonalInfo } from '@/api/common/user'
import PersonalSettingsView from '@/views/common/PersonalSettingsView.vue'

const { t } = useI18n() // 表单引用
const user = ref({})

onMounted(() => {
  getLoginPersonalInfo().then(rsp => {
    user.value = rsp.data
  })
})
</script>

<style scoped></style>
