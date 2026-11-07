<template>
  <el-input-number
    style="width: 70px;"
    v-model="row.showOrder"
    :min="1"
    size="small"
    controls-position="right"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
import {useI18n} from "vue-i18n";
import {executeOpenApi} from "@/api/common/platform";
import {defineModel} from "vue";

const {t, locale} = useI18n()
const emit = defineEmits(['refresh'])

const row = defineModel<any>('row', {default: () => ({})})

function handleChange(e: any) {
  executeOpenApi('saveFieldDefine', {}, row.value).then(() => {
    emit('refresh')
  })
}
</script>
