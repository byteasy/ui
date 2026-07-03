<template>
  <el-input>
    <template #append>
      <el-icon @click="onI18nClick" class="my-icon-color-primary cursor-pointer"><IconLocalLanguage  /></el-icon>
    </template>
  </el-input>
</template>
<script setup lang="ts">
import { useModal } from '@/components/dialog/useModal.ts'
import TunaI18NForm from "@/components/TunaI18nForm.vue";

const { open } = useModal()
const props = defineProps<{
  code?: string
}>()

const onI18nClick = () => {
  open(
    TunaI18NForm,
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
