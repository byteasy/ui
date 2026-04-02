<template>
  <tuna-table
    ref="refTable"
    base-url="/platformSvr/sapi/users"
    context="platformSvr"
    class-name="com.tuna.platform.entity.User"
    :query-params="{ descColumns: ['updatedTime', 'createdTime'] }"
  >
    <template v-slot:table_column_avatar="avatarScode">
      <el-image style="width: 80px; height: 80px" :src="avatarScode.row.avatar" fit="cover" :zoom-rate="1.2" />
    </template>
    <template v-slot:operationSlotExt="powerScope">
      <el-button link type="primary" @click="onPermissionEdit(powerScope.row)">
        {{ t('role.name') }}
      </el-button>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import { useModal } from '@/components/dialog/useModal.ts'
import UserRoleMgr from "@/views/microapp/systemManage/user/UserRoleMgr.vue";

const {t} = useI18n() // 表单引用
const {open} = useModal()
const refTable = ref(null)

function onPermissionEdit(row) {
  open(
    UserRoleMgr, // 要显示的组件
    {
      row: row
    },
    {
      title: t('user.roleAllocate'),
      width: '60%',
      onClose: (data) => {
      },
    },
  )
}
</script>
