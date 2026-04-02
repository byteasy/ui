<template>
  <el-select ref="refSelect">
    <el-option
      v-for="item in parentResources"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {doHttpGet} from "@/api/common/platform";

const props = defineProps<{
  selectFirst?: boolean
}>()

const refSelect = ref(null)
const parentResources = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})
</script>
