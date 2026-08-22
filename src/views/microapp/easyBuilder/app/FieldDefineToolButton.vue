<template>
  <el-button :title="$t('platform.ebApp.moveFieldGroup')" type="primary"
             v-debounce="batchMoveFieldGroup">
    <IconLocalGroup style="width: 1rem; height: 1rem; color: var(--my-text-color)"/>
  </el-button>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {getEntityDefine} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
import {useModal} from "@/components/dialog/useModal.ts";
import {ElMessage} from "element-plus";
import FieldDefineGroupBatchEdit
  from "@/views/microapp/easyBuilder/app/FieldDefineGroupBatchEdit.vue";

const {t, locale} = useI18n() // 表单引用
const {open} = useModal()

const props = defineProps<{
  refTable: any
  // 前端配置参数
  param: any
  // 表格查询参数
  queryParams: any
}>()

function batchMoveFieldGroup() {
  const rows = props.refTable.getSelectionRows()
  if (rows.length < 1) {
    ElMessage.error(t('platform.ebApp.selectFieldFirst'))
    return;
  }
  getEntityDefine('com.byteasy.platform.entity.FieldGroup').then(entityDefine => {
    open(
      FieldDefineGroupBatchEdit,
      {
        fields: rows
      },
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: '60%',
        footer: true
      },
    )
  })
}
</script>

<style>
</style>
