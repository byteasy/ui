<template>
  <el-skeleton :rows="5" animated v-if="loading" />
  <div
    class="form-container"
    v-else
    :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
    style="container-type: inline-size"
  >
    <div class="form-scroll-wrap">
      <el-form
        ref="refForm"
        label-width="auto"
        label-position="right"
        class="form-root"
        :model="formModel"
      >
        <slot
          name="formItem"
          :props="props"
          :formModel="formModel"
          :queryParam="queryParam"
          :className="props.className"
        >
          <component
            :is="getComponent(parseComponent(defaultFormItemComponent))"
            :param="parseComponentParam(defaultFormItemComponent)"
            :formModel="formModel"
            :cascadeModel="cascadeModel"
            :className="props.className"
            :readonly="props.readonly"
            :queryParam="queryParam"
          >
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </component>
        </slot>
        <slot
          name="formItemExtra"
          :props="props"
          :formModel="formModel"
          :queryParam="queryParam"
          :className="props.className"
        />
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineExpose, defineModel, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { doHttpPost, executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { parseComponent, parseComponentParam } from '@/util/common.ts';
import { getComponent } from '@/util/componentLoader.ts';

const { t, locale } = useI18n();
const emit = defineEmits(['close']);
const refForm = ref(null);
const loading = ref(true);

const props = defineProps<{
  apiSave?: string;
  apiCascade?: string;
  className: string;
  readonly?: boolean;
  direction?: string;
  fullscreen?: boolean;
  isDrawer?: boolean;
  formItemComponent?: string;
  beforeMount?: (formModel) => Promise<void>;
}>();

const formModel = defineModel<any>('formModel', { default: () => ({}) });
// 表单联动 visible/disable/require
const cascadeModel = ref({});
const validError = ref({});

const queryParam = ref({});
const defaultFormItemComponent = ref(props.formItemComponent || '/components/BeFormItem.vue');

onMounted(() => {
  if (props.beforeMount) {
    props
      .beforeMount(formModel.value)
      .then(() => {
        if (props.apiCascade) {
          loadCascade(formModel.value).then(() => {
            loading.value = false;
          });
        } else {
          loading.value = false;
        }
      })
      .catch((err) => {
        ElMessage.error(t(err));
        emit('close', 'cancel');
      });
  } else {
    if (props.apiCascade) {
      loadCascade(formModel.value).then(() => {
        loading.value = false;
      });
    } else {
      loading.value = false;
    }
  }
});

async function onSaveClick() {
  // 自定义校验错误拦截
  if (Object.keys(validError.value).length > 0) {
    setFieldsErrors(validError.value);
    console.log('validError.value length > 0');
    return Promise.reject(new Error('Form validError > 0'));
  }

  // Element Plus 的 validate() 在不传回调时原生返回 Promise
  try {
    const valid = await refForm.value?.validate();
    if (!valid) return;

    // 统一根据 apiSave 路径调用保存接口
    const requestPromise = props.apiSave.startsWith('/')
      ? doHttpPost(props.apiSave, queryParam.value, formModel.value)
      : executeOpenApi(props.apiSave, queryParam.value, formModel.value);

    // 等待接口保存请求完成
    await requestPromise;

    ElMessage.success(t('operationSuccess'));
    emit('close', 'ok');
  } catch (err) {
    // 捕获表单校验不通过（Element 会返回校验错误对象）或接口报错
    if (err && err.message) {
      ElMessage.error(err.message);
    }
    // 抛出异常供上层捕获，确保即使失败也能正常结束父组件的 loading
    throw err;
  }
}

const validate = () => {
  return new Promise((resolve) => {
    refForm.value?.validate((valid) => resolve(valid));
  });
};

function onClearForm() {
  refForm.value?.resetFields();
  emit('close', 'cancel');
}

// 2. onButtonClick 返回对应的异步 Promise
const onButtonClick = (btnName) => {
  if (btnName === 'ok') {
    return onSaveClick();
  } else if (btnName === 'cancel') {
    onClearForm();
  }
};

// 表单联动
let timer: any = null;
let lastJsonStr = ''; // 记录上一次真正请求时的内容快照

watch(
  () => formModel.value,
  (newVal) => {
    if (!props.apiCascade) return;

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
  },
  { deep: true },
);

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
    fieldItem.validateState = 'error';
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

/**
 * 清除某个字段的手动错误标记
 */
function clearFieldError(prop: string) {
  if (!refForm.value) return;
  // @ts-ignore
  const fieldItem = refForm.value.fields?.find((f: any) => f.prop === prop);
  if (fieldItem) {
    fieldItem.validateState = '';
    fieldItem.validateMessage = '';
  }
}

const loadCascade = (newVal) => {
  return new Promise((resolve, reject) => {
    executeOpenApi(props.apiCascade, {}, newVal)
      .then((rsp) => {
        Object.assign(cascadeModel.value, rsp.data.cascadeModel || {});
        Object.assign(formModel.value, rsp.data.formModel || {});
        validError.value = {}
        Object.assign(validError.value, rsp.data.validError || {});
        setFieldsErrors(validError.value);
        resolve({});
      })
      .catch((err) => {
        reject(err);
      });
  });
};

defineExpose({ props, validate, queryParam, formModel, onSaveClick, onClearForm, onButtonClick });
</script>

<style scoped>
/* 整体容器：高度100% 自适应 */
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  container-type: inline-size; /* ✅ 容器查询必须写在这里才生效 */
}

/* 全屏模式内边距 */
.form-container.fullscreen {
  padding: 12px;
}

/* 滚动区域：自动填充高度 */
.form-scroll-wrap {
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

/* 表单根容器 */
.form-root {
  width: 100%;
  padding: 16px;
}
</style>
