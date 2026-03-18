<template>
  <tuna-table-form>
    <template v-slot:formItemField_name="scope">
      <el-input
        v-model="scope.row.name"
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <template #append>
          <el-button circle icon="Baseball" @click="onI18nClick(scope.row)"></el-button>
        </template>
      </el-input>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { useModal } from '@/components/dialog/useModal.ts'
import I18nForm from '@/views/platform/i18n/I18nForm.vue'

const { open } = useModal()

const onI18nClick = (row) => {
  open(
    I18nForm,
    {
      code: row.code,
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
