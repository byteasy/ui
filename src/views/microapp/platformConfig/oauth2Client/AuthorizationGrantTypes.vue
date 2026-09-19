<template>
  <el-select :multiple="props.column.multiple === 'YES'">
    <el-option label="AUTHORIZATION_CODE" value="authorization_code"/>
    <el-option label="REFRESH_TOKEN" value="refresh_token"/>
    <el-option label="CLIENT_CREDENTIALS" value="client_credentials"/>
    <el-option label="PASSWORD" value="password"/>
    <el-option label="JWT_BEARER" value="urn:ietf:params:oauth:grant-type:jwt-bearer"/>
    <el-option label="DEVICE_CODE" value="urn:ietf:params:oauth:grant-type:device_code"/>
    <el-option label="TOKEN_EXCHANGE" value="urn:ietf:params:oauth:grant-type:token-exchange"/>
  </el-select>
</template>
<script lang="ts" setup>
import type { BeColumn } from '@/components/BeTable.ts';

const props = defineProps<{
  column: BeColumn;
}>();
</script>
