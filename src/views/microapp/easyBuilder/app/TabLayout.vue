<template>
  <el-scrollbar height="100%" class="pl-3 pr-3" always>
    <div style="height: 400px">
      <be-std-page-layout :class-name="metaData.className" :query-params="metaData.queryParams" class="h-full"/>
    </div>
  </el-scrollbar>
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
  className: 'com.byteasy.platform.entity.PlatformResourceLayout',
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
