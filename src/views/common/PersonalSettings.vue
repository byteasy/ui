<template>
  <tuna-viewer
    context="platformSvr"
    class-name="com.tuna.platform.vo.PersonalSettingsVO"
    :entity="user"
    :title="$t('user.basic')"
  >
    <template v-slot:view_avatar="scope">
      <el-avatar shape="square" :size="100" fit="scale-down" :src="scope.value" />
      <el-upload
        action="/platformSvr/sapi/files"
        v-if="editEnable"
        with-credentials
        :on-success="onAvatarUploadSuccess"
      >
        <el-icon><Edit /></el-icon>
      </el-upload>
    </template>
    <template v-slot:view_realName="scope">
      <el-input v-model="user.realName" v-if="editEnable" clearable/>
    </template>
    <template v-slot:view_nickname="scope">
      <el-input v-model="user.nickname" v-if="editEnable" clearable/>
    </template>
    <template v-slot:view_mobile="scope">
      <el-input v-model="user.mobile" v-if="editEnable" clearable/>
    </template>
    <template v-slot:view_email="scope">
      <el-input v-model="user.email" v-if="editEnable" clearable />
    </template>
    <template v-slot:view_remark="scope">
      <el-input v-model="user.remark" v-if="editEnable" clearable />
    </template>
    <template v-slot:view_birthday="scope">
      <el-date-picker
        v-if="editEnable"
        type="date"
        value-format="YYYY-MM-DD"
        v-model="user.birthday"
        clearable
      />
    </template>
    <template v-slot:view_gender="scope">
      <enum-select v-if="editEnable" code="com.tuna.enums.Gender" context="platformSvr" v-model="user.gender" clearable/>
    </template>
    <template v-slot:extra>
      <el-button type="primary" @click="editEnable = !editEnable" v-if="!editEnable">{{
        $t('table.edit')
      }}</el-button>
      <el-button type="primary" @click="onSaveClick" v-if="editEnable">{{ $t('save') }}</el-button>
    </template>
  </tuna-viewer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { editPersonalInfo, getLoginPersonalInfo } from '@/api/common/user'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const user = ref({})
const editEnable = ref(false)
const { t } = useI18n()
onMounted(() => {
  getLoginPersonalInfo().then((rsp) => {
    user.value = rsp.data
  })
})

const onSaveClick = () => {
  editPersonalInfo({
    username: user.value.username,
    nickname: user.value.nickname,
    gender: user.value.gender,
    birthday: user.value.birthday,
    avatar: user.value.avatar,
    mobile: user.value.mobile,
    email: user.value.email,
    remark: user.value.remark
  }).then(() => {
    editEnable.value = !editEnable.value
    ElMessage.success(t('operationSuccess'))
  })
}

const onAvatarUploadSuccess = (response) => {
  user.value.avatar = response.data
}
</script>

<style scoped></style>
