<template>
  <div :style="{ height: tableHeightCss }">
    <tuna-object-list :meta-data="props.metaData" />
  </div>
</template>
<script lang="ts" setup>
import TunaObjectList from "@/views/template/TunaObjectList.vue";
import {computed} from "vue";

const props = defineProps<{
  metaData: object | null | undefined
  dialogModel: boolean
  fullscreen?: boolean
}>()

const tableHeightCss = computed({
  get() {
    return props.dialogModel === true ? (props.fullscreen === true ? 'calc(100vh - 100px)' : 'calc(60vh - 100px)') : 'calc(100vh - 185px)'
  },
  set() {
  }
})
</script>
