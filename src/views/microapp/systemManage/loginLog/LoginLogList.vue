<template>
  <tuna-table-v2
    ref="refTable"
    base-url="/platformSvr/sapi/loginLogs"
    context="platformSvr"
    title-column-name="username"
    class-name="com.tuna.platform.entity.LoginLog"
    :query-params="{ descColumns: ['createdTime'] }"
  >
  </tuna-table-v2>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useModal} from '@/components/dialog/useModal.ts'

const {t} = useI18n() // 表单引用
const {open} = useModal()
const refTable = ref(null)

</script>
