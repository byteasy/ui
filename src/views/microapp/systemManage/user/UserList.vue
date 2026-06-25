<template>
  <tuna-table-v2
    ref="refTable"
    base-url="/platformSvr/sapi/users"
    context="platformSvr"
    class-name="com.byteasy.platform.vo.PersonalSettingsVO"
    :form-component="UserEditForm"
    :excel-import-enable="true"
    :title-column-name="'realName'"
    :query-params="{ descColumns: ['createdTime', 'updatedTime'] }"
  >
    <template v-slot:table-cell-avatar="avatarScode">
      <el-image style="width: 80px; height: 80px" :src="avatarScode.row.avatar" fit="cover"
                :zoom-rate="1.0"/>
    </template>
    <template v-slot:table-operation-extra="powerScope">
      <el-link underline="never" type="primary" v-permission="'com.byteasy.platform.vo.PersonalSettingsVO.RoleAssign'"
               @click="onPermissionEdit(powerScope.row)">{{ t('platform.role.name') }}
      </el-link>
    </template>
    <template v-slot:table-operation-end-extra="scope">
      <el-dropdown placement="bottom-start">
        <el-link type="primary" underline="never" v-permission="'com.byteasy.platform.vo.PersonalSettingsVO.Enable'">{{ $t('platform.more') }}</el-link>
        <template #dropdown>
          <el-dropdown-menu>
              <el-dropdown-item v-if="scope.row.status === 'DISABLE' && sessionStore.authorize('com.byteasy.platform.vo.PersonalSettingsVO.Enable')"
                                @click="onEditUserStatusClick(scope.row, 'NORMAL')" >
                {{ $t('user.enable') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 'NORMAL' && sessionStore.authorize('com.byteasy.platform.vo.PersonalSettingsVO.Enable')"
                                @click="onEditUserStatusClick(scope.row, 'DISABLE')" >
                {{ $t('user.disable') }}
              </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </tuna-table-v2>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useModal} from '@/components/dialog/useModal.ts'
import UserRoleMgr from "@/views/microapp/systemManage/user/UserRoleMgr.vue";
import UserEditForm from "@/views/microapp/systemManage/user/UserEditForm.vue";
import {doHttpPut} from "@/api/common/platform";
import {ElMessage} from "element-plus";
import {useSessionStore} from "@/stores/session.ts";

const {t} = useI18n() // 表单引用
const {open} = useModal()
const refTable = ref(null)
const sessionStore = useSessionStore()

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

function onEditUserStatusClick(row, status) {
  doHttpPut('/platformSvr/sapi/users/status', {}, {
    id: row.id,
    username: row.username,
    status: status
  }).then(() => {
    ElMessage.success(t('operationSuccess'))
    refTable.value?.refresh()
  })
}
</script>
