<template>
  <el-button :title="$t('platform.ebApp.moveFieldGroup')" type="primary" v-debounce="batchMoveFieldGroup">
    <IconLocalGroup style="width: 1rem; height: 1rem; color: var(--my-text-color)"/>
  </el-button>
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";

const {locale} = useI18n() // 表单引用

const props = defineProps<{
  refTable: any
}>()

function batchMoveFieldGroup() {
  const rows = props.refTable.getSelectionRows()
  console.log(rows)
}
</script>

<style>
</style>
