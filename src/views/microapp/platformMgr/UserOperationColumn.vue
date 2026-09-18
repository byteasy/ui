<template>
  <el-dropdown placement="bottom-start">
    <el-link type="primary" underline="never">{{ $t('platform.more') }}</el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="onPermissionEdit(props.row)" >
          {{ $t('platform.role.name') }}
        </el-dropdown-item>
        <el-dropdown-item @click="onEditUserStatusClick(props.row, 'NORMAL')" v-if="props.row.status !== 'NORMAL'">
          {{ $t('user.enable') }}
        </el-dropdown-item>
        <el-dropdown-item @click="onEditUserStatusClick(props.row, 'DISABLE')" v-if="props.row.status !== 'DISABLE'">
          {{ $t('user.disable') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { doHttpPut } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { useModal } from '@/components/dialog/useModal.ts';
import UserRoleMgr from '@/views/microapp/platformMgr/UserRoleMgr.vue';
const {open} = useModal()

const props = defineProps<{
  row: object
  refTable?: any
}>();
const emit = defineEmits(['refresh']);

const { t } = useI18n(); // 表单引用

function onEditUserStatusClick(row, status) {
  doHttpPut(
    '/platformSvr/sapi/users/status',
    {},
    {
      id: row.id,
      username: row.username,
      status: status,
    },
  ).then(() => {
    ElMessage.success(t('operationSuccess'));
    props.refTable.refresh();
  });
}

function onPermissionEdit(row) {
  open(
    UserRoleMgr, // 要显示的组件
    {
      row: row
    },
    {
      title: t('user.roleAllocate'),
      width: '60%',
      btnExtras: [
        { name: t('platform.selectAll'), key: 'selectAll' , icon: 'Select', type: 'primary' },
        { name: t('platform.clearAll'), key: 'clearAll' , icon: 'Failed', type: 'warning' }
      ],
      onClose: (data) => {
      },
    },
  )
}
</script>
