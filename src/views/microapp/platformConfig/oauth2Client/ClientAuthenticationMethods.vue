<template>
  <el-select :multiple="props.column.multiple === 'YES'">
    <el-option label="CLIENT_SECRET_BASIC" value="client_secret_basic" />
    <el-option label="CLIENT_SECRET_POST" value="client_secret_post" />
    <el-option label="CLIENT_SECRET_JWT" value="client_secret_jwt" />
    <el-option label="PRIVATE_KEY_JWT" value="private_key_jwt" />
    <el-option label="NONE" value="none" />
    <el-option label="TLS_CLIENT_AUTH" value="tls_client_auth" />
    <el-option label="SELF_SIGNED_TLS_CLIENT_AUTH" value="self_signed_tls_client_auth" />
  </el-select>
</template>
<script lang="ts" setup>
import type { BeColumn } from '@/components/BeTable.ts';

const props = defineProps<{
  column: BeColumn;
}>();
</script>
