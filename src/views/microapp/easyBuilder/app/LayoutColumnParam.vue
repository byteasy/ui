<template>
  <el-link v-if="props.row.type === 'STAND'" @click="onLayoutParamsEdit">
    {{ $t('platform.ebApp.params') }}
  </el-link>
  <div v-else> -</div>
</template>
<script lang="ts" setup>

import {doHttpGet, executeOpenApi} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
import {useModal} from "@/components/dialog/useModal.ts";
import {useI18n} from "vue-i18n";
import BeTableForm from "@/components/BeTableForm.vue";

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
  doHttpGet('/platformSvr/sapi/entityDefines/entity/com.byteasy.platform.entity.PlatformStdLayoutParams', {}).then(entityDefine => {
    open(
      BeTableForm, // 要显示的组件
      {
        row: row,
        className: 'com.byteasy.platform.entity.PlatformStdLayoutParams'
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
}
</script>
