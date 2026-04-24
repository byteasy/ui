<template>
  <el-descriptions border :column="props.columns">
    <template #extra>
      <slot name="extra">
        <el-button type="primary" @click="onClick">{{ $t('table.edit') }}</el-button>
      </slot>
    </template>
    <template v-for="col in columns" :key="col.name">
      <el-descriptions-item :label="getLangText(col.displayName, locale)" v-if="col.isShow === 'YES'">
        <slot :name="'view_' + col.name" :value="props.entity[col.name]">
          <enum-viewer
            v-if="col.type === 'ENUM'"
            :prop="props.entity[col.name]"
            :context="props.context"
            :code="col.typeClassName"
          />
          <span v-else>{{ props.entity[col.name] }}</span>
        </slot>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script setup lang="ts">

import { defineEmits, ref } from 'vue'
import { getEntitySchema } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";

const { t, locale } = useI18n() // 表单引用

const props = defineProps<{
  className: string
  context: string
  entity: any
  onEditClick?: (data?: unknown) => void
  columns?: number
}>()
const emit = defineEmits(['editClick'])

const columns = ref([])

getEntitySchema(props.context, props.className)
  .then((response) => {
    columns.value = response.data
  })
  .catch((error) => {
    console.log(error)
    ElMessage.error(t('table.loadingTableColumnsError'))
  })

function onClick() {
  emit('editClick', props.entity)
}
</script>

<style scoped></style>
