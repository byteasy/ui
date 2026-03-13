<template>
  <el-descriptions :title="$t('user.basic')" border>
    <template #extra>
      <el-button type="primary">{{ $t('table.edit')}}</el-button>
    </template>
    <el-descriptions-item :label="$t('user.realName')">{{ props.user.realName }}</el-descriptions-item>
    <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  user: any
}>()
</script>

<style scoped></style>
