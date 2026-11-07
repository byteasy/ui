<template>
  <el-radio-group>
    <el-radio :value="op.value" :label="getLangText(op.label, locale)" v-for="op in localOptions"
              :key="op.value"/>
  </el-radio-group>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  options: []
}>()

const {t, locale} = useI18n()
const localOptions = ref(props.options)
</script>
