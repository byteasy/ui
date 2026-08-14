<template>
  <be-stand-page-layout v-if="loading && layout?.type === '0'"/>
  <be-stand-page-layout v-else-if="loading && layout?.type === '2'"/>
  <el-skeleton :rows="5" animated v-else/>
</template>
<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {executeOpenApi} from "@/api/common/platform";
import BeStandPageLayout from "@/views/template/BeStandPageLayout.vue";

const props = defineProps<{
  layoutId?: object | null | undefined
}>()

const route = useRoute()

const layout = ref(undefined)
const loading = ref(true)

onMounted(() => {
  let layoutId = props.layoutId
  const params = {...route.query}
  if (params && params.layoutId) {
    layoutId = params.layoutId
  }

  loading.value = true
  executeOpenApi('queryResourceLayout', {id: layoutId, idQueryType: 'eq'}, {}).then((rsp) => {
    layout.value = rsp.data
    loading.value = false
  })
})
</script>
