<template>
  <el-dropdown>
    <el-link type="primary">{{ $t('platform.more') }}</el-link>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <layout-column-param :row="props.row" @refresh="refreshTable"/>
        </el-dropdown-item>
        <el-dropdown-item @click="onOpenTableDetail(props.row)">{{ $t('platform.ebApp.field') }}</el-dropdown-item>
        <el-dropdown-item @click="onOpenFieldGropTable(props.row)">{{ $t('platform.ebApp.fieldGroup') }}</el-dropdown-item>
        <el-dropdown-item @click="onOpenApiTable(props.row)">{{ $t('platform.ebApp.api') }}
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
import {getEntityDefine} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";

const {t, locale} = useI18n()
const {open} = useModal()

const props = defineProps<{
  row: object
  refTable: any
}>()

const refreshTable = () => {
  props.refTable.refresh()
}

function onOpenTableDetail(row) {
  getEntityDefine('com.byteasy.platform.entity.FieldDefine').then(entityDefine => {
    const queryParams = {row: row}
    queryParams.classNameQueryType = 'eq'
    queryParams.className = row.code
    const metaData = {
      queryParams: queryParams,
      className: 'com.byteasy.platform.entity.FieldDefine',
      multiple: true
    }
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: '60%',
        footer: false
      },
    )
  })
}

function onOpenFieldGropTable(row) {
  getEntityDefine('com.byteasy.platform.entity.FieldGroup').then(entityDefine => {
    const queryParams = {row: row}
    queryParams.classNameQueryType = 'eq'
    queryParams.className = row.code
    const metaData = {
      queryParams: queryParams,
      className: 'com.byteasy.platform.entity.FieldGroup',
      multiple: true
    }
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: '60%',
        footer: false
      },
    )
  })
}

function onOpenApiTable(row) {
  getEntityDefine('com.byteasy.platform.entity.Openapi').then(entityDefine => {
    const queryParams = {row: row}
    queryParams.classNameQueryType = 'eq'
    queryParams.className = row.code
    queryParams.serviceCode = row.serviceCode
    const metaData = {
      queryParams: queryParams,
      className: 'com.byteasy.platform.entity.Openapi',
    }
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: t('table.edit') + getLangText(entityDefine.name, locale.value),
        width: '60%',
        footer: false
      },
    )
  })
}
</script>
