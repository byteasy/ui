<template>
  <be-tree
    api-query="4GJc62jqs"
    :query-params="props.queryParams"
    show-check-box
    default-expand-all
  />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

const props = defineProps<{
  role: object;
  queryParams: Record<string, unknown>;
}>();

onMounted(() => {

})
</script>
