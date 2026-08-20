<template>
  <div :style="{ height: tableHeightCss }">
    <be-std-page-layout :class-name="metaData.className" :layout-prams-id="metaData.layoutPramsId"
                        :query-params="metaData.queryParams"/>
  </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import BeStdPageLayout from "@/views/template/BeStdPageLayout.vue";

const props = defineProps<{
  metaData: object | null | undefined
  dialogModel?: boolean
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
