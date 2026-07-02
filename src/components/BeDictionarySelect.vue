<template>
  <el-select :loading="loading" filterable :placeholder="dictionary.name">
    <el-option v-for="item in dictionary.items" :key="item.value" :label="item.label"
               :value="item.value" />
  </el-select>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getDictionaryValues } from '@/api/common/platform'

const props = defineProps<{
  code: string
}>()
const dictionary = ref({})
const loading = ref(false)

onMounted(() => {
  getDictionaryValues(props.code).then(rsp => {
    dictionary.value = rsp.data
  })
})
</script>
