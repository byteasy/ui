<template>
  <be-std-page-layout :class-name="metaData.className" :query-params="metaData.queryParams" :form-component="metaData.formComponent" class="h-full" />
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
  queryParams: {
    resourceId: props.resource?.id,
  }
})

watch(
  () => [props.resource],
  ([newResource]) => {
    metaData.value.queryParams.resourceId = newResource?.id
  }
)
</script>
