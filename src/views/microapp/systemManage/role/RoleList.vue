<template>
  <tuna-table
    ref="refTable"
    base-url="/platformSvr/sapi/roles"
    context="platformSvr"
    class-name="com.tuna.platform.entity.Role"
    :query-params="{ ascColumns: ['code'] }"
  >
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // 表单引用

const refTable = ref(null)
</script>
