<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">属性</el-text>
    {{ activeComponent }}
  </div>
</template>
<script lang="ts" setup>
import {getLangText} from "@/locales/common.ts";
import {VueDraggable} from "vue-draggable-plus";

const props = defineProps<{
  activeComponent?: object
}>()
</script>
