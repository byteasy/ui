<template>
  <el-link @click="onLayoutParamsEdit" underline="never" type="primary">
    {{ $t('platform.ebApp.params') + (props.row.stdLayoutParamsId ? '(1)' : '(0)') }}
  </el-link>
</template>
<script lang="ts" setup>

import {executeOpenApi, getEntityDefine} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
import {useModal} from "@/components/dialog/useModal.ts";
import {useI18n} from "vue-i18n";
import BeForm from "@/components/BeForm.vue";

const {open} = useModal()
const {t, locale} = useI18n()
const emit = defineEmits(['refresh'])

const props = defineProps<{
  row: object
}>()

function onLayoutParamsEdit() {
  executeOpenApi('getOrCreateLayoutParams', {id: props.row.stdLayoutParamsId}, props.row).then(res => {
    openEditForm(res.data)
  })
}

function openEditForm(row) {
  executeOpenApi(
    'listLayoutParams',
    {
      className: 'com.byteasy.platform.entity.PlatformStdLayoutParams',
      classNameQueryType: 'eq',
    },
    {},
  ).then((rsp) => {
    const layoutParams = rsp.data[0];
    getEntityDefine('com.byteasy.platform.entity.PlatformStdLayoutParams').then(entityDefine => {
      open(
        BeForm, // 要显示的组件
        {
          formModel: row,
          className: 'com.byteasy.platform.entity.PlatformStdLayoutParams',
          apiSave: 'saveLayoutParams',
          apiCascade: layoutParams?.apiCascade
        }, // 传给组件的 props
        {
          title: t('table.edit') + getLangText(entityDefine.name, locale.value),
          width: '60%',
          onClose: (data) => {
            emit('refresh')
          },
        },
      )
    })
  });
}
</script>
