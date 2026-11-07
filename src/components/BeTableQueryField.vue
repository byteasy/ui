<template>
  <be-object-select v-if="props.column.relationType === 'EXTERNAL_KEY'" :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }" :column="props.column" />
  <el-input
    v-else-if="props.column.type === 'STRING'"
    type="text"
    :maxlength="props.column.maxLength"
    :minlength="props.column.minLength"
    :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }"
  />
  <el-input
    v-else-if="
      props.column.type === 'BYTE' ||
      props.column.type === 'SHORT' ||
      props.column.type === 'INT' ||
      props.column.type === 'LONG'
    "
    :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }"
    type="number"
    :min="props.column.min"
    :max="props.column.max"
  />
  <el-input
    v-else-if="props.column.type === 'FLOAT' || props.column.type === 'DOUBLE'"
    :precision="props.column.precision" :min="props.column.min"
    :max="props.column.max"
    type="number"
    :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }"
  />
  <el-switch v-else-if="props.column.type === 'BOOL'">
    <template #active-action>
      <span>T</span>
    </template>
    <template #inactive-action>
      <span>F</span>
    </template>
  </el-switch>
  <el-date-picker
    v-else-if="props.column.type === 'LOCAL_DATE'"
    type="daterange"
    :range-separator="$t('table.rangeSeparator')"
    :start-placeholder="$t('table.startDate')"
    :end-placeholder="$t('table.endDate')"
    value-format="YYYY-MM-DD"
    :style="{ width: (props.column.width === 0 ? 240 : props.column.width) + 'px' }"
  />
  <el-date-picker
    v-else-if="props.column.type === 'LOCAL_DATE_TIME'"
    type="datetimerange"
    :range-separator="$t('table.rangeSeparator')"
    :start-placeholder="$t('table.startDate')"
    :end-placeholder="$t('table.endDate')"
    value-format="YYYY-MM-DD HH:mm:ss"
    :style="{ width: (props.column.width === 0 ? 240 : props.column.width) + 'px' }"
  />
  <be-enum-select :code="props.column.typeClassName"
               v-else-if="props.column.type === 'ENUM'" filterable clearable reserve-keyword
               :multiple="props.column.multiple === 'YES'"
               :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }"/>
</template>

<script lang="ts" setup>

import type {BeColumn} from "@/components/BeTable.ts";

const props = defineProps<{
  column: BeColumn
}>()
</script>
