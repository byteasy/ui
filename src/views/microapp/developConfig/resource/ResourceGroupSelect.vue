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
  firsRowTrigger?: (row: any) => void
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
    if (props.firsRowTrigger) {
      if (parentResources.value.length > 0) {
        props.firsRowTrigger(parentResources.value[0])
      }
    }
  })
})
</script>
