<template>
  <tuna-table-v2
    ref="refTable"
    base-url="/platformSvr/sapi/roles"
    context="platformSvr"
    class-name="com.tuna.platform.entity.Role"
    :query-params="{ descColumns: ['updatedTime', 'createdTime'] }"
    excel-import-enable
  >
    <template v-slot:table-operation-extra="powerScope">
      <el-link underline="never" type="primary" @click="onPermissionEdit(powerScope.row)" v-permission="'com.tuna.platform.entity.Role.Permission'">{{ t('platform.role.permission') }}</el-link>
    </template>
  </tuna-table-v2>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import RoleResourceMgr from "@/views/microapp/systemManage/role/RoleResourceMgr.vue";
import { useModal } from '@/components/dialog/useModal.ts'

const {t} = useI18n() // 表单引用
const {open} = useModal()
const refTable = ref(null)

function onPermissionEdit(row) {
  open(
    RoleResourceMgr, // 要显示的组件
    {
      row: row
    },
    {
      title: t('platform.role.permissionAllocate'),
      width: '60%',
      onClose: (data) => {
      },
    },
  )
}
</script>
