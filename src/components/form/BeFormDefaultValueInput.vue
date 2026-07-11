<template>
  <div class="flex-column w-full gap-1-2">
    <el-input-number v-if="props.formModel.component === 'slider' || props.formModel.component === 'number'"
                     controls-position="right" controls v-model="defaultValue"
                     @change="value => emit('update:modelValue', value)" v-bind="$attrs" class="w-full"/>
    <el-select v-else-if="props.formModel.component === 'date'" v-model="defaultValue"
               @change="value => emit('update:modelValue', value)" v-bind="$attrs" class="w-full">
      <el-option value="now" :label="$t('component.nowDate')"/>
      <el-option value="script" :label="$t('component.script')"/>
    </el-select>
    <el-input v-else v-model="defaultValue" @change="value => emit('update:modelValue', value)" v-bind="$attrs" class="w-full"/>

    <el-input type="textarea" :rows="6" v-if="props.formModel.defaultValue === 'script'" v-model="formValue.defaultValueScript" class="w-full" clearable/>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{
  modelValue: any
  formModel: object
}>()

const defaultValue = ref(props.modelValue)
const formValue = ref(props.formModel)
const emit = defineEmits(['update:modelValue'])

</script>
