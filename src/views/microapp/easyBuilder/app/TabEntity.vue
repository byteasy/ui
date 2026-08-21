<template>
  <be-std-page-layout  :class-name="metaData.className" :query-params="metaData.queryParams" class="h-full"/>
</template>

<script lang="ts" setup>

import {defineAsyncComponent, ref, watch} from "vue";

const BeStdPageLayout = defineAsyncComponent(() =>
  import('@/views/template/BeStdPageLayout.vue')
)

const props = withDefaults(
  defineProps<{
    resource: object | undefined
  }>(),
  {
    resource: undefined,
  }
)

const metaData = ref({
  className: 'com.byteasy.platform.entity.EntityDefine',
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

</script>
