<template>
  <div class="h-full w-full flex-row align-items-center">
    <div class="w-full flex-row justify-content-center">
      <div class="flex-column align-items-center">
        <div class="font-bold-900 my-font-size-4xl my-font-color-error">{{ $t('authenticationEmptyTitle') }}</div>
        <div class="font-bold-900 my-font-size-4xl my-font-color-primary">{{ $t('authenticationEmptyTips') }}</div>
        <div class="mt-8">
          <el-button text @click="$router.push('/')">{{ $t('goBackHome') }}</el-button>
          <el-button text @click="$router.go(-1)">{{ $t('goBackLastPage') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
