<template>
  <el-input>
    <template #append>
      <el-button circle icon="Baseball" @click="onI18nClick"></el-button>
    </template>
  </el-input>
</template>
<script setup lang="ts">
import { useModal } from '@/components/dialog/useModal.ts'
import I18nForm from '@/views/platform/i18n/I18nForm.vue'

const { open } = useModal()
const props = defineProps<{
  code: string
}>()

const onI18nClick = () => {
  open(
    I18nForm,
    {
      code: props.code,
    },
    {
      title: '18n',
      width: '60%',
      dialogModel: true,
      onClose: (data) => {},
    },
  )
}
</script>
