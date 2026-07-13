<template>
  <div :style="props.modelValue.properties.marginStyle" class="w-full">
    <el-form-item :prop="props.modelValue.properties.fieldName"
                  :rules="[
                    { required: props.modelValue.properties.required === true, message: getLangText(props.modelValue.properties.fieldTitle, locale) + ' ' + t('validate.required') },
                  ]"
                  :style="renderCss(props.modelValue.properties)">
      <template v-slot:label="scope">
        <span :style="props.modelValue.properties.fontStyle">{{
            getLangText(props.modelValue.properties.fieldTitle, locale) + scope.label
          }}</span>
      </template>
      <el-slider v-model="testValue" v-if="props.modelValue.properties.component === 'slider'"
                 class="w-full"
                 :min="props.modelValue.properties.min"
                 :max="props.modelValue.properties.max"
                 :show-input="props.modelValue.properties.showInput"
                 :step="props.modelValue.properties.step"/>
      <el-input-number v-model="testValue"
                       class="w-full"
                       v-else-if="props.modelValue.properties.component === 'number'"
                       :min="props.modelValue.properties.min"
                       :controls="props.modelValue.properties.controls"
                       :controls-position="props.modelValue.properties.controlsPosition === true ? 'right' : ''"
                       :tabindex="props.modelValue.properties.tabindex"
                       :precision="props.modelValue.properties.precision"
                       :max="props.modelValue.properties.max"
                       :step="props.modelValue.properties.step"/>
      <el-input v-model="testValue" v-else-if="props.modelValue.properties.component === 'text'"
                class="w-full"
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
      <el-date-picker
        v-model="testValue"
        class="w-full"
        v-else-if="props.modelValue.properties.component === 'date'"
        :editable="props.modelValue.properties.editable"
        :clearable="props.modelValue.properties.clearable"
        :type="props.modelValue.properties.type"
        :format="props.modelValue.properties.format"
        :value-format="props.modelValue.properties.valueFormat"
        :placeholder="getLangText(props.modelValue.properties.placeholder, locale)"
      />
      <be-tag-input
        v-model="testValue"
        class="w-full"
        v-else-if="props.modelValue.properties.component === 'tagInput'"
        :max="props.modelValue.properties.max"
        :tag-type="props.modelValue.properties.tagType"
        :tag-effect="props.modelValue.properties.tagEffect"
        :effect="props.modelValue.properties.effect"
        :trigger="props.modelValue.properties.trigger"
        :draggable="props.modelValue.properties.draggable"
        :delimiter ="props.modelValue.properties.delimiter"
        :clearable="props.modelValue.properties.clearable"
        :tabindex="props.modelValue.properties.tabindex"
        :placeholder="getLangText(props.modelValue.properties.placeholder, locale)"
      />

      <el-radio-group
        v-model="testValue"
        class="w-full"
        v-else-if="props.modelValue.properties.component === 'radioInput'"
        :clearable="props.modelValue.properties.clearable"
        :tabindex="props.modelValue.properties.tabindex"
        :placeholder="getLangText(props.modelValue.properties.placeholder, locale)"
      >
        <el-radio v-for="op in props.modelValue.properties.options" :key="op.id" :label="getLangText(op.label, locale)" :value="op.value" />
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from "vue-i18n";
import {renderCss} from "@/util/formUtil.ts";
import {getLangText } from "@/locales/common.ts";

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


