<template>
  <be-stand-page-layout :meta-data="metaData" class="h-full"/>
</template>

<script lang="ts" setup>

import {defineAsyncComponent, ref, watch} from "vue";

const BeStandPageLayout = defineAsyncComponent(() =>
  import('@/views/template/BeStandPageLayout.vue')
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
