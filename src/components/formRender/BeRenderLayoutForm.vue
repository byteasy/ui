<template>
  <div class="w-full">
    <div :style="props.formDefine.properties.marginStyle">
      <el-form
        ref="refForm"
        :style="renderCss(props.formDefine.properties)"
        :model="formValue"
        :label-position="props.formDefine.properties.labelPosition"
        :label-width="props.formDefine.properties.labelWidth"
        :label-suffix="props.formDefine.properties.labelSuffix"
        :hide-required-asterisk="props.formDefine.properties.hideRequiredAsterisk"
        :require-asterisk-position="props.formDefine.properties.requireAsteriskPosition"
        :inline-message="props.formDefine.properties.inlineMessage"
        :scroll-to-error="props.formDefine.properties.scrollToError"
      >
        <template v-for="root in children" :key="root.id">
          <be-render-component
            class="w-full"
            :form-define="root"
            v-model="formValue"
            :cascade-model="cascadeModel"
          />
        </template>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineExpose, defineModel, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';
import BeRenderComponent from './BeRenderComponent.vue';
import { doHttpPost, executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  formDefine: {
    id: string;
    name: string;
    path: string;
    render: string;
    icon: string;
    propsForm: Array<object>;
    properties: object;
    children: any[];
  };
}>();

const refForm = ref(null);
const formValue = defineModel<any>('modelValue', { default: () => {} });
const cascadeModel = defineModel<any>('cascadeModel', { default: () => {} });
const validError = ref({});

const children = ref([...(props.formDefine.children || [])]);
const emit = defineEmits(['close']);
const { t, locale } = useI18n();

// 表单联动
let timer: any = null;
let lastJsonStr = ''; // 记录上一次真正请求时的内容快照

watch(
  formValue.value,
  (newVal, oldVal) => {
    if (props.formDefine.properties.apiCascade) {
      // 🔥 核心关键：将当前值与上次请求时的参数进行深层比对
      // 如果属性值实际上没有变（或者是浅拷贝无意义触发），直接忽略！
      const currentJsonStr = JSON.stringify(newVal);
      if (currentJsonStr === lastJsonStr) {
        return; // 内容完全一致，直接终止，掐断死循环！
      }

      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('触发级联联动请求:', newVal);
        lastJsonStr = currentJsonStr; // 更新快照
        loadCascade(newVal);
      }, 300);
    }
  },
  { deep: true },
);

const loadCascade = (newVal) => {
  return new Promise((resolve, reject) => {
    executeOpenApi(props.formDefine.properties.apiCascade, {}, newVal)
      .then((rsp) => {
        Object.assign(cascadeModel.value, rsp.data.cascadeModel || {});
        Object.assign(formValue.value, rsp.data.formModel || {});
        validError.value = {};
        Object.assign(validError.value, rsp.data.validError || {});
        setFieldsErrors(validError.value);
        console.log('cascadeModel', cascadeModel.value);
        resolve({});
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * 手动设置某个字段的错误提示
 * @param prop 字段名（即 el-form-item 上绑定的 prop 属性，如 'userCode'）
 * @param errorMessage 需要显示的错误文案
 */
function setFieldError(prop: string, errorMessage: string) {
  if (!refForm.value) return;

  // 1. 从 refForm 的 fields 内部集合中找到对应字段的 FormItem 实例
  // @ts-ignore fields 是 Element Plus FormInstance 内部维护的子项数组
  const fieldItem = refForm.value.fields?.find((f: any) => f.prop === prop);

  if (fieldItem) {
    // 2. 标记状态为 error（输入框变红）
    if (errorMessage === '' || errorMessage === undefined) {
      fieldItem.validateState = undefined;
    } else {
      fieldItem.validateState = 'error';
    }
    // 3. 填充错误提示文本（下方出现红色文字）
    fieldItem.validateMessage = errorMessage;
  } else {
    console.warn(`未找到 prop 为 ${prop} 的表单项`);
  }
}

/**
 * 批量设置后端返回的多个错误字段
 * 例如传入：{ userCode: '编码重复', phone: '手机号格式不正确' }
 */
function setFieldsErrors(errorMap: Record<string, string>) {
  if (!refForm.value) return;

  Object.keys(errorMap).forEach((prop) => {
    setFieldError(prop, errorMap[prop]);
  });
}

const onOkClick = () => {
  if (Object.keys(validError.value).length > 0) {
    setFieldsErrors(validError.value);
    console.log('validError.value length > 0');
    return Promise.reject(validError.value)
  }

  return new Promise((resolve, reject) => {
    refForm.value?.validate((valid, fields) => {
      if (!valid) {
        console.log('validate error:', fields);
        // 将表单验证失败的错误信息返回出去
        return reject(fields);
      }

      // 3. 校验通过，执行保存逻辑
      if (props.formDefine.properties.apiSave) {
        executeOpenApi(props.formDefine.properties.apiSave, {}, formValue.value)
          .then((res) => {
            ElMessage.success(t('operationSuccess'));
            emit('close', 'ok');
            resolve(res); // 成功时 resolve
          })
          .catch((err) => {
            ElMessage.error(err.message);
            reject(err); // API 报错时 reject
          });
      } else {
        emit('close', 'ok');
        resolve(true);
      }
    });
  });
};

defineExpose({ onOkClick });
</script>
<style scoped></style>
