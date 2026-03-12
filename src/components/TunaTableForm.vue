<template>
  <div class="w-full">
    <el-form :inline="true">
      <template v-for="col in tableColumns" :key="col.name">
        <el-form-item :label="col.displayName" v-if="col.isSearch === 'YES'">
          <slot :name="'formItem_' + col.name" :column="col">
            <tuna-input-field
              :column="col"
              :placeholder="col.displayName"
              v-model="queryParam[col.name]"
              clearable
              @change="refresh"
              :align="col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'"
            />
          </slot>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="refresh">{{ $t('search') }}</el-button>
        <el-button type="success" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
        <slot name="formButton"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
</script>
