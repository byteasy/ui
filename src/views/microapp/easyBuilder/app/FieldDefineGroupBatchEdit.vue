<template>
  <be-table-container :meta-data="metaData" ref="refTable"/>
</template>
<script setup lang="ts">

import {defineEmits, ref} from "vue";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {executeOpenApi} from "@/api/common/platform";
const emit = defineEmits(['close'])

const props = defineProps<{
  fields: Array<any>
}>()
const refTable = ref(null)
const {t, locale} = useI18n() // 表单引用

const rowDbClick = (row) => {
  batchSaveFieldGroup(row)
}

const metaData = ref({
  className: 'com.byteasy.platform.entity.FieldGroup',
  queryParams: {
    className: props.fields[0].className,
    classNameQueryType: 'eq',
    ascColumns: ['id'],
  },
  multiple: false,
  rowDbClick: rowDbClick
})

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    const rows = refTable.value.getSelectionRows()
    if (rows.length < 1) {
      ElMessage.error(t('platform.ebApp.selectFieldFirst'))
      return;
    }
    batchSaveFieldGroup(rows[0])
  } else if (btnName === 'cancel') {
    emit('close', 'cancel')
  }
}

function batchSaveFieldGroup(group) {
  executeOpenApi('batchUpdateFieldGroup', {
    fieldGroupId: group.id,
    fieldIds: props.fields.map(field => field.id)
  }, {}).then(() => {
    ElMessage.success(t('operationSuccess'))
    emit('close', 'ok')
  })
}

defineExpose({
  onButtonClick
})
</script>
