<template>
  <el-switch v-model="row.isDefault" @change="handleChange" />
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {executeOpenApi} from "@/api/common/platform";
import {defineModel} from "vue";

const {t, locale} = useI18n()
const emit = defineEmits(['refresh'])

const row = defineModel<any>('row', {default: () => ({})})

function handleChange(e: any) {
  executeOpenApi('saveResourceLayout', {}, row.value).then(() => {
    emit('refresh')
  })
}
</script>
