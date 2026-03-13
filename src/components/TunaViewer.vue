<template>
  <el-descriptions border>
    <template #extra>
      <el-button type="primary">{{ $t('table.edit') }}</el-button>
    </template>
    <el-descriptions-item v-for="col in columns" :key="col.name" :label="col.displayName">{{
      props.entity[col.name]
    }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getEntitySchema } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n() // 表单引用

const props = defineProps<{
  className: string
  context: string
  entity: any
  onEditClick?: (data?: unknown) => void
}>()

const columns = ref([])

getEntitySchema(props.context, props.className)
  .then((response) => {
    columns.value = response.data
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('table.loadingTableColumnsError'))
  })
</script>

<style scoped></style>
