<template>
  <be-form>
    <template v-slot:formItem="scope">
      <el-form-item
        label="code"
        prop="code">
        <el-input v-model="scope.row.code"></el-input>
      </el-form-item>
    </template>
  </be-form>
</template>
<script lang="ts" setup>
</script>
