<template>
  <el-select :multiple="props.column.multiple === 'YES'">
    <!-- MacAlgorithm -->
    <el-option label="HS256" value="HS256" />
    <el-option label="HS384" value="HS384" />
    <el-option label="HS512" value="HS512" />
    <!-- SignatureAlgorithm -->
    <el-option label="RS256" value="RS256" />
    <el-option label="RS384" value="RS384" />
    <el-option label="RS512" value="RS512" />
    <el-option label="ES256" value="ES256" />
    <el-option label="ES384" value="ES384" />
    <el-option label="ES512" value="ES512" />
    <el-option label="PS256" value="PS256" />
    <el-option label="PS384" value="PS384" />
    <el-option label="PS512" value="PS512" />
  </el-select>
</template>
<script lang="ts" setup>
import type { BeColumn } from '@/components/BeTable.ts';

const props = defineProps<{
  column: BeColumn;
}>();
</script>
