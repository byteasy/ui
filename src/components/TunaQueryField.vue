<template>
  <el-input
    v-if="props.column.type === 'STRING'"
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
  <enum-select :code="props.column.typeClassName" :context="props.context"
               v-else-if="props.column.type === 'ENUM'" filterable clearable reserve-keyword
               :multiple="props.column.multiple === 'YES'"
               :style="{ width: (props.column.width === 0 ? 160 : props.column.width) + 'px' }"/>
</template>

<script lang="ts" setup>

const props = defineProps<{
  context: string
  column: {
    className: string
    name: string
    cnName: string
    displayName: string
    type: string // 若值固定（如 STRING/Number），可改为 "STRING" | "NUMBER" 限定
    typeClassName: string
    isShow: 'YES' | 'NO' // 枚举值用联合类型限定
    isSort: 'YES' | 'NO'
    isOverflow: 'YES' | 'NO'
    isSearch: 'YES' | 'NO'
    isFixed: 'YES' | 'NO'
    isRequire: 'YES' | 'NO'
    isForm: 'YES' | 'NO'
    align: 'LEFT' | 'CENTER' | 'RIGHT' // 对齐方式限定
    width: number
    showOrder: number
  }
}>()
</script>
