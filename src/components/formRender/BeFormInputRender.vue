<template>
  <div :style="props.formDefine.properties.marginStyle">
    <el-form-item :prop="props.formDefine.properties.fieldName"
                  :rules="[
                    { required: props.formDefine.properties.required === true, message: getLangText(props.formDefine.properties.fieldTitle, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => callback(), trigger: 'blur' }
                  ]"
                  :label="getLangText(props.formDefine.properties.fieldTitle, locale)"
                  :style="renderCss(props.formDefine.properties)">
      <el-slider v-if="props.formDefine.properties.component === 'slider'"
                 v-model="formValue[props.formDefine.properties.fieldName]"
                 :min="props.formDefine.properties.min"
                 :max="props.formDefine.properties.max"
                 :show-input="props.formDefine.properties.showInput"
                 :step="props.formDefine.properties.step"
      />
      <el-input-number v-else-if="props.formDefine.properties.component === 'number'"
                       v-model="formValue[props.formDefine.properties.fieldName]"
                       :min="props.formDefine.properties.min"
                       :max="props.formDefine.properties.max"
                       :step="props.formDefine.properties.step"
      />
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


