<template>
  <be-std-page-layout :class-name="metaData.className" :query-params="metaData.queryParams" class="h-full" />
</template>

<script lang="ts" setup>
import BeStdPageLayout from "@/views/template/BeStdPageLayout.vue";
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
    resourceId: undefined,
  }
})

watch(
  () => [props.resource],
  ([newResource]) => {
    metaData.value.queryParams.resourceId = newResource?.id
  }
)
</script>
