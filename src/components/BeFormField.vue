<template>
  <be-object-select v-if="props.column.relationType === 'EXTERNAL_KEY'" :column="props.column"
                    :formModel="formModel"/>
  <be-i18n-dynamic-input v-else-if="props.column.isI18n === 'YES' && props.column.type === 'STRING'"
                         :type="props.column.textareaRows === 1 ? 'text' : 'textarea'"
                         :rows="props.column.textareaRows"
                         :maxlength="props.column.maxLength"
                         :minlength="props.column.minLength"
                         :formModel="formModel"
  />
  <el-input
    :type="props.column.textareaRows === 1 ? 'text' : 'textarea'"
    :rows="props.column.textareaRows"
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
  <be-enum-select :code="props.column.typeClassName"
                  v-else-if="props.column.type === 'ENUM'" filterable clearable reserve-keyword
                  :multiple="props.column.multiple === 'YES'"
  />
  <be-bean-input v-else-if="props.column.type === 'JSON'" :class-name="props.column.typeClassName"
                 v-bind="$attrs" :formModel="formModel">
    <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
      <slot :name="name" v-bind="slotProps"></slot>
    </template>
  </be-bean-input>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {defineModel} from "vue";
import type {BeColumn} from "@/components/BeTable.ts";

const {t} = useI18n()

const props = defineProps<{
  column: BeColumn
}>()
const formModel = defineModel<any>('formModel', {default: () => ({})})
</script>
