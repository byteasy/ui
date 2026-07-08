<template>
  <div :style="props.modelValue.properties.marginStyle">
    <el-form-item :prop="props.modelValue.properties.fieldName"
                  :required="props.modelValue.properties.required"
                  :label="getLangText(props.modelValue.properties.fieldTitle, locale)"
                  :style="renderCss(props.modelValue.properties)">
      <el-slider v-model="testValue" v-if="props.modelValue.properties.component === 'slider'"
                 :min="props.modelValue.properties.min"
                 :max="props.modelValue.properties.max"
                 :show-input="props.modelValue.properties.showInput"
                 :step="props.modelValue.properties.step"/>
      <el-input-number v-model="testValue"
                       v-else-if="props.modelValue.properties.component === 'number'"
                       :min="props.modelValue.properties.min"
                       :controls="props.modelValue.properties.controls"
                       :controls-position="props.modelValue.properties.controlsPosition === true ? 'right' : ''"
                       :max="props.modelValue.properties.max"
                       :step="props.modelValue.properties.step"/>
      <el-input v-model="testValue" v-else-if="props.modelValue.properties.component === 'text'"
                :type="props.modelValue.properties.type"
                :minlength="props.modelValue.properties.minlength"
                :maxlength="props.modelValue.properties.maxlength"
                :show-word-limit="props.modelValue.properties.showWordLimit"
                :placeholder="getLangText(props.modelValue.properties.placeholder, locale)"
                :clearable="props.modelValue.properties.clearable"
                :show-password="props.modelValue.properties.showPassword"
                :rows="props.modelValue.properties.rows"
                :autosize="props.modelValue.properties.autosize"
                :tabindex="props.modelValue.properties.tabindex"
                :word-limit-position="props.modelValue.properties.wordLimitPosition"/>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";
import {getLangText} from "@/locales/common.ts";

const props = defineProps<{
  modelValue: {
    id: string
    name: string
    path: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  }
}>()

const emit = defineEmits(['click', 'selected', 'update:modelValue'])
const {t, locale} = useI18n()
const testValue = ref(undefined)

</script>
<style scoped>
</style>


