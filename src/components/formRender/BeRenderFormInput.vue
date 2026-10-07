<template>
  <div :style="props.formDefine.properties.marginStyle" v-if="cascadeModel[props.formDefine.properties.fieldName + 'Visible'] !== false">
    <el-form-item
      :prop="props.formDefine.properties.fieldName"
      :rules="[
        {
          required: props.formDefine.properties.required === true,
          message:
            getLangText(props.formDefine.properties.fieldTitle, locale) +
            ' ' +
            t('validate.required'),
        },
        { validator: (rule, value, callback) => callback(), trigger: 'blur' },
      ]"
      :style="renderCss(props.formDefine.properties)"
    >
      <template v-slot:label="scope">
        <span :style="props.formDefine.properties.fontStyle">{{
          getLangText(props.formDefine.properties.fieldTitle, locale) + scope.label
        }}</span>
      </template>
      <el-slider
        v-if="props.formDefine.properties.component === 'slider'"
        class="w-full"
        v-model="formValue[props.formDefine.properties.fieldName]"
        :min="props.formDefine.properties.min"
        :max="props.formDefine.properties.max"
        :show-input="props.formDefine.properties.showInput"
        :step="props.formDefine.properties.step"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      />
      <el-input-number
        v-else-if="props.formDefine.properties.component === 'number'"
        class="w-full"
        v-model="formValue[props.formDefine.properties.fieldName]"
        :controls="props.formDefine.properties.controls"
        :controls-position="props.formDefine.properties.controlsPosition === true ? 'right' : ''"
        :tabindex="props.formDefine.properties.tabindex"
        :precision="props.formDefine.properties.precision"
        :min="props.formDefine.properties.min"
        :max="props.formDefine.properties.max"
        :step="props.formDefine.properties.step"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      />
      <el-input
        v-model="formValue[props.formDefine.properties.fieldName]"
        v-else-if="props.formDefine.properties.component === 'text'"
        class="w-full"
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
        :word-limit-position="props.formDefine.properties.wordLimitPosition"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      />
      <el-date-picker
        v-model="formValue[props.formDefine.properties.fieldName]"
        class="w-full"
        v-else-if="props.formDefine.properties.component === 'date'"
        :editable="props.formDefine.properties.editable"
        :clearable="props.formDefine.properties.clearable"
        :type="props.formDefine.properties.type"
        :format="props.formDefine.properties.format"
        :value-format="props.formDefine.properties.valueFormat"
        :placeholder="getLangText(props.formDefine.properties.placeholder, locale)"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      />
      <be-tag-input
        v-model="formValue[props.formDefine.properties.fieldName]"
        class="w-full"
        v-else-if="props.formDefine.properties.component === 'tagInput'"
        :editable="props.formDefine.properties.editable"
        :max="props.formDefine.properties.max"
        :tag-type="props.formDefine.properties.tagType"
        :tag-effect="props.formDefine.properties.tagEffect"
        :effect="props.formDefine.properties.effect"
        :trigger="props.formDefine.properties.trigger"
        :draggable="props.formDefine.properties.draggable"
        :delimiter="props.formDefine.properties.delimiter"
        :clearable="props.formDefine.properties.clearable"
        :tabindex="props.formDefine.properties.tabindex"
        :placeholder="getLangText(props.formDefine.properties.placeholder, locale)"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      />
      <el-radio-group
        v-model="formValue[props.formDefine.properties.fieldName]"
        class="w-full"
        v-else-if="props.formDefine.properties.component === 'radioInput'"
        :clearable="props.formDefine.properties.clearable"
        :tabindex="props.formDefine.properties.tabindex"
        :placeholder="getLangText(props.formDefine.properties.placeholder, locale)"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      >
        <el-radio
          v-for="op in props.formDefine.properties.options"
          :key="op.id"
          :label="getLangText(op.label, locale)"
          :value="op.value"
        />
      </el-radio-group>
      <be-check-box-group
        v-model="formValue[props.formDefine.properties.fieldName]"
        class="w-full"
        v-else-if="props.formDefine.properties.component === 'checkboxInput'"
        :clearable="props.formDefine.properties.clearable"
        :tabindex="props.formDefine.properties.tabindex"
        :placeholder="getLangText(props.formDefine.properties.placeholder, locale)"
        :disabled="cascadeModel[props.formDefine.properties.fieldName + 'Disabled'] === true"
      >
        <template #default>
          <el-checkbox
            v-for="op in props.formDefine.properties.options"
            :key="op.id"
            :label="getLangText(op.label, locale)"
            :value="op.value"
          />
        </template>
      </be-check-box-group>
    </el-form-item>
  </div>
</template>
<script lang="ts" setup>
import { defineModel, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import { getLangText } from '@/locales/common.ts';
import dayjs from 'dayjs';
import { runDefaultValueScript } from '@/api/common/platform';

const props = defineProps<{
  formDefine: {
    id: string;
    name: string;
    path: string;
    icon: string;
    propsForm: Array<object>;
    properties: object;
    children: any[];
  };
}>();

const formValue = defineModel<any>('modelValue', { default: () => {} });
const cascadeModel = defineModel<any>('cascadeModel', { default: () => {} });
const emit = defineEmits(['update:modelValue']);
const { t, locale } = useI18n();

onMounted(() => {
  if (formValue.value[props.formDefine.properties.fieldName] === undefined) {
    if (props.formDefine.properties.defaultValue !== undefined) {
      let defaultValue;
      if (
        props.formDefine.properties.component === 'slider' ||
        props.formDefine.properties.component === 'number'
      ) {
        defaultValue = props.formDefine.properties.defaultValue;
      } else if (props.formDefine.properties.component === 'date') {
        if (props.formDefine.properties.defaultValue === 'now') {
          defaultValue = dayjs(new Date()).format(props.formDefine.properties.valueFormat);
        }
      } else {
        defaultValue = props.formDefine.properties.defaultValue;
      }
      if (props.formDefine.properties.defaultValueScript !== undefined) {
        runDefaultValueScript(
          props.formDefine.properties,
          props.formDefine.properties.defaultValueScript,
        ).then((rsp) => {
          formValue.value[props.formDefine.properties.fieldName] = dayjs(
            new Date(Number.parseInt(rsp.data.output)),
          ).format(props.formDefine.properties.valueFormat);
        });
      } else {
        formValue.value[props.formDefine.properties.fieldName] = defaultValue;
      }
    }
  }
});
</script>
<style scoped></style>
