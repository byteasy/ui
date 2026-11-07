<template>
  <el-dropdown
    placement="bottom-start"
    v-if="hasPermission('4J9QRnSDS') || hasPermission('4J9LvDnwa')"
  >
    <el-link type="primary" underline="never">{{ $t('platform.more') }}</el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="onPermissionEdit(props.row)" v-if="hasPermission('4J9QRnSDS')">
          {{ $t('platform.role.name') }}
        </el-dropdown-item>
        <el-dropdown-item
          @click="onEditUserStatusClick(props.row, 'NORMAL')"
          v-if="props.row.status !== 'NORMAL' && hasPermission('4J9LvDnwa')"
        >
          {{ $t('user.enable') }}
        </el-dropdown-item>
        <el-dropdown-item
          @click="onEditUserStatusClick(props.row, 'DISABLE')"
          v-if="props.row.status !== 'DISABLE' && hasPermission('4J9LvDnwa')"
        >
          {{ $t('user.disable') }}
        </el-dropdown-item>
        <el-dropdown-item @click="resetUserPassword(props.row)" v-if="hasPermission('4J9LvDnwa')">
          {{ $t('platform.platformMgr.resetUserPassword') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { doHttpDelete, doHttpPut } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { useModal } from '@/components/dialog/useModal.ts';
import UserRoleMgr from '@/views/microapp/platformConfig/user/UserRoleMgr.vue';
import { useSessionStore } from '@/stores/session.ts';
const { open } = useModal();
const { hasPermission } = useSessionStore();

const props = defineProps<{
  row: object;
  refTable?: any;
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
      row: row,
    },
    {
      title: t('user.roleAllocate'),
      width: '60%',
      btnExtras: [
        { name: t('platform.selectAll'), key: 'selectAll', icon: 'Select', type: 'primary' },
        { name: t('platform.clearAll'), key: 'clearAll', icon: 'Failed', type: 'warning' },
      ],
      onClose: (data) => {},
    },
  );
}

function resetUserPassword(row) {
  doHttpDelete(
    '/platformSvr/sapi/users/password',
    {},
    {
      id: row.id,
      username: row.username,
    },
  ).then(() => {
    ElMessage.success(t('operationSuccess'));
    props.refTable.refresh();
  });
}
</script>
