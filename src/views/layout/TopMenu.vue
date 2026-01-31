<script setup lang="ts">

</script>

<template>
  <el-popover placement="bottom" width="500" >
    <template #reference>
      <div class="flex-row ml-5 app-text-color my-font-size-lg" type="text" >系统设置<el-icon class="ml-2"><ArrowDown /></el-icon></div>
    </template>
    <el-space wrap style="max-height: 50vh; overflow-y: auto;">
      <el-card v-for="i in 10" :key="i" class="box-card" style="width: 250px">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <el-button class="button" text>Operation button</el-button>
          </div>
        </template>
        <div v-for="o in 5" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
  </el-popover>
</template>

<style scoped>
.app-text-color {
  color: var(--my-text-color);
}
</style>
