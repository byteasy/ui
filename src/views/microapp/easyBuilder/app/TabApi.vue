<template>
  <be-stand-page-layout :meta-data="metaData" class="h-full" />
</template>

<script lang="ts" setup>
import BeStandPageLayout from "@/views/template/BeStandPageLayout.vue";
import {ref, watch} from "vue";

const props = withDefaults(
  defineProps<{
    resource: object | undefined
  }>(),
  {
    resource: undefined,
  }
)

const metaData = ref({
  className: 'com.byteasy.platform.entity.Openapi',
  formComponent: '/views/microapp/easyBuilder/app/OpenApiForm.vue',
  queryParams: {
    resourceId: undefined
  }
})

watch(
  () => [props.resource],
  ([newResource]) => {
    metaData.value.queryParams.resourceId = newResource?.id
  }
)

watch(metaData, (newValue) => {
  console.log('mm', newValue)
})
</script>
