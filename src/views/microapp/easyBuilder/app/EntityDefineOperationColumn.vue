<template>
  <el-dropdown>
    <el-link type="primary">{{ $t('platform.more') }}</el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <layout-column-param :row="props.row"/>
        </el-dropdown-item>
        <el-dropdown-item @click="onOpenTableDetail(props.row)">{{ $t('platform.ebApp.field') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import LayoutColumnParam from "@/views/microapp/easyBuilder/app/LayoutColumnParam.vue";
import BeTableContainer from "@/components/BeTableContainer.vue";
import {useI18n} from "vue-i18n";
import {useModal} from "@/components/dialog/useModal.ts";

const {t, locale} = useI18n()
const {open} = useModal()

const props = defineProps<{
  row: object
}>()

function onOpenTableDetail(row) {
  const queryParams = {row: row}
  queryParams.classNameQueryType = 'eq'
  queryParams.className = 'com.byteasy.platform.entity.EntityDefine'
  const metaData = {queryParams: queryParams, className: 'com.byteasy.platform.entity.FieldDefine'}
  open(
    BeTableContainer,
    {
      metaData: metaData,
    },
    {
      title: t('platform.ebApp.field'),
      width: '60%',
    },
  )
}
</script>
