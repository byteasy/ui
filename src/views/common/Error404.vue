<template>
  <div class="flex grow place-content-center h-5/6">
    <div class="content-center place-self-center">
      <div class="text-9xl font-black">4<span class="text-rose-900">0</span>4</div>
      <div class="text-5xl">{{ $t('error404') }}</div>
      <div class="mt-8">
        <el-button text @click="$router.push('/')">{{ $t('goBackHome') }}</el-button>
        <el-button text @click="$router.go(-1)">{{ $t('goBackLastPage') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
