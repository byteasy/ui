<template>
  <tuna-table
    ref="refTable"
    base-url="/platformSvr/sapi/roles"
    context="platformSvr"
    class-name="com.tuna.platform.entity.Role"
    :query-params="{ ascColumns: ['code'] }"
  >
    <template v-slot:operationSlotExt="powerScope">
      <el-button link type="primary" @click="onPermissionEdit(powerScope.row)">
        {{ t('role.permission') }}
      </el-button>
    </template>
  </tuna-table>
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
      title: t('role.permissionAllocate'),
      width: '60%',
      onClose: (data) => {
      },
    },
  )
}
</script>
