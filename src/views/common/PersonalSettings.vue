<template>
  <div><el-button @click="showForm">打开表单</el-button></div>
</template>

<script lang="ts" setup>
import { useModal } from '@/components/useModal'
import PasswordSettings from './PasswordSettings.vue'

const { open } = useModal()
const showForm = () => {
  open(
    PasswordSettings, // 要显示的组件
    { userId: 123 }, // 传给组件的 props
    {
      title: '编辑用户',
      dialogModel: false,
      onClose: (data) => {
        console.log('弹窗关闭', data)
      },
    },
  )
}
</script>

<style scoped></style>
