<template>
  <div :style="props.formDefine.properties.marginStyle">
    <el-form-item :prop="props.formDefine.properties.fieldName"
                  :rules="[
                    { required: props.formDefine.properties.required === true, message: getLangText(props.formDefine.properties.fieldTitle, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => callback(), trigger: 'blur' }
                  ]"
                  :style="renderCss(props.formDefine.properties)">
      <template v-slot:label="scope">
        <span :style="props.modelValue.properties.fontStyle">{{ getLangText(props.modelValue.properties.fieldTitle, locale) + scope.label }}</span>
      </template>
      <el-slider v-if="props.formDefine.properties.component === 'slider'"
                 v-model="formValue[props.formDefine.properties.fieldName]"
                 :min="props.formDefine.properties.min"
                 :max="props.formDefine.properties.max"
                 :show-input="props.formDefine.properties.showInput"
                 :step="props.formDefine.properties.step"/>
      <el-input-number v-else-if="props.formDefine.properties.component === 'number'"
                       v-model="formValue[props.formDefine.properties.fieldName]"
                       :controls="props.formDefine.properties.controls"
                       :controls-position="props.formDefine.properties.controlsPosition === true ? 'right' : ''"
                       :min="props.formDefine.properties.min"
                       :max="props.formDefine.properties.max"
                       :step="props.formDefine.properties.step"/>
      <el-input v-model="formValue[props.formDefine.properties.fieldName]" v-else-if="props.formDefine.properties.component === 'text'"
                       :type="props.formDefine.properties.type"
                       :minlength="props.formDefine.properties.minlength"
                       :maxlength="props.formDefine.properties.maxlength"
                       :show-word-limit="props.formDefine.properties.showWordLimit"
                       :placeholder="getLangText(props.formDefine.properties.placeholder, locale)"
                       :clearable="props.formDefine.properties.clearable"
                       :show-password="props.formDefine.properties.showPassword"
                       :rows="props.formDefine.properties.rows"
                       :autosize="props.formDefine.properties.autosize"
                       :tabindex="props.formDefine.properties.tabindex"
                       :word-limit-position="props.formDefine.properties.wordLimitPosition" />
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";
import {getLangText} from "@/locales/common.ts";

const props = defineProps<{
  formDefine: {
    id: string
    name: string
    path: string
    icon: string
    propsForm: Array<object>
    properties: object
    children: any[]
  },
  modelValue: Record<string, any>
}>()

const formValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])
const {t, locale} = useI18n()

onMounted(() => {
  if (formValue.value[props.formDefine.properties.fieldName] === undefined) {
    if (props.formDefine.properties.defaultValue !== undefined) {
      let defaultValue
      if (props.formDefine.properties.component === 'slider'
        || props.formDefine.properties.component === 'number') {
        defaultValue = Number.parseInt(props.formDefine.properties.defaultValue)
      } else {
        defaultValue = props.formDefine.properties.defaultValue
      }
      formValue.value[props.formDefine.properties.fieldName] = defaultValue
    }
  }
})

</script>
<style scoped>
</style>


