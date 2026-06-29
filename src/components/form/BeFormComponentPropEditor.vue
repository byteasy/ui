<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">属性</el-text>
    <el-button @click="activeComponent.properties = { test: true}">Test</el-button>
  </div>
</template>
<script lang="ts" setup>
import {useFormEngine} from '@/stores/formEngine.ts'
import {storeToRefs} from "pinia";

const formEngine = useFormEngine()
const { activeComponent } = storeToRefs(formEngine)
</script>
