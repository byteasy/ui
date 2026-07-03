<template>
  <tuna-i18n-dynamic-input v-if="props.column.isI18n === 'YES' && props.column.type === 'STRING'"
                           :maxlength="props.column.maxLength"
                           :minlength="props.column.minLength"/>
  <el-input
    type="text"
    :maxlength="props.column.maxLength"
    :minlength="props.column.minLength"
    v-else-if="(props.column.isI18n === 'NO' || !props.column.isI18n) && props.column.type === 'STRING'"
  />
  <el-input
    v-else-if="
      props.column.type === 'BYTE' ||
      props.column.type === 'SHORT' ||
      props.column.type === 'INT' ||
      props.column.type === 'LONG'
    "
    type="number"
    :min="props.column.min"
    :max="props.column.max"
  />
  <el-switch v-else-if="props.column.type === 'BOOL'">
    <template #active-action>
      <span>T</span>
    </template>
    <template #inactive-action>
      <span>F</span>
    </template>
  </el-switch>
  <el-input
    v-else-if="props.column.type === 'FLOAT' || props.column.type === 'DOUBLE'"
    :precision="props.column.precision" :min="props.column.min"
    :max="props.column.max"
    type="number"
  />
  <el-date-picker
    v-else-if="props.column.type === 'LOCAL_DATE'"
    type="date"
    value-format="YYYY-MM-DD"
    class="w-full"
  />
  <el-date-picker
    v-else-if="props.column.type === 'LOCAL_DATE_TIME'"
    type="datetime"
    value-format="YYYY-MM-DD HH:mm:ss"
    class="w-full"
  />
  <enum-select :code="props.column.typeClassName" :context="props.context"
               v-else-if="props.column.type === 'ENUM'" filterable clearable reserve-keyword
               :multiple="props.column.multiple === 'YES'"
  />
  <tuna-bean-input v-else-if="props.column.type === 'JSON'" :class-name="props.column.typeClassName" :context="props.context" v-bind="$attrs">
    <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </tuna-bean-input>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

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
