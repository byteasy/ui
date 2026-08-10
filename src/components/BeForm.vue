<template>
  <div class="form-container"
       :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
       style="container-type: inline-size;">
    <div class="form-scroll-wrap">
      <el-form ref="refForm" label-width="auto" label-position="right" class="form-root"
               :model="formValue">
        <div class="form-grid w-full">
          <slot name="formItem" :props="props" :row="formValue" :queryParam="queryParam"
                :className="props.className">
            <component :is="getComponent(parseComponent(defaultFormItemComponent))"
                       :param="parseComponentParam(defaultFormItemComponent)"
                       :row="formValue"
                       :className="props.className"
                       :readonly="props.readonly"
                       :queryParam="queryParam">
              <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
                <slot :name="name" v-bind="slotProps"></slot>
              </template>
            </component>
          </slot>
          <slot name="formItemExtra" :props="props" :row="formValue" :queryParam="queryParam"
                :className="props.className"/>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, defineModel, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {doHttpPost, executeOpenApi} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";

const {modules} = getRouteComponents()

const {t, locale} = useI18n()
const emit = defineEmits(['close'])
const refForm = ref(null)

const props = defineProps<{
  apiSave?: string
  className: string
  readonly?: boolean
  direction?: string
  fullscreen?: boolean
  isDrawer?: boolean
  row?: any
  formItemComponent?: string
}>()

const formValue = defineModel<any>('row', {default: () => ({})})
const queryParam = ref({})
const defaultFormItemComponent = ref(props.formItemComponent || '/components/BeFormItem.vue')

function onSaveClick() {
  refForm.value?.validate(valid => {
    if (!valid) return
    if (props.apiSave.startsWith('/')) {
      doHttpPost(props.apiSave, queryParam.value, formValue.value).then(() => {
        ElMessage.success(t('operationSuccess'))
        emit('close', 'ok')
      }).catch(err => {
        ElMessage.error(err.message)
      })
    } else {
      executeOpenApi(props.apiSave, queryParam.value, formValue.value).then(() => {
        ElMessage.success(t('operationSuccess'))
        emit('close', 'ok')
      }).catch(err => {
        ElMessage.error(err.message)
      })
    }
  })
}

const validate = () => {
  return new Promise(resolve => {
    refForm.value?.validate(valid => resolve(valid))
  })
}

function onClearForm() {
  refForm.value?.resetFields()
  emit('close', 'cancel')
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    onSaveClick()
  } else if (btnName === 'cancel') {
    onClearForm()
  }
}

function getComponent(path) {
  return modules['..' + path]
}

defineExpose({props, validate, queryParam, formValue, onSaveClick, onClearForm, onButtonClick})
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

/* ===================================== */
/* 基础网格 */
/* ===================================== */
.form-grid {
  display: grid;
  gap: 1rem 1rem;
  align-items: flex-start;
}

/* ===================================== */
/* 【弹窗模式】普通/全屏 → 按屏幕宽度 */
/* ===================================== */
.form-container:not(.drawer-mode) .form-grid {
  /* 普通弹窗 */

  .form-container:not(.fullscreen) & {
    @media (max-width: 820px) {
      grid-template-columns: repeat(1, 1fr);
    }
    @media (min-width: 821px) and (max-width: 1499px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1500px) and (max-width: 2499px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 2500px) and (max-width: 3839px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 3840px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  /* 弹窗全屏 */

  .form-container.fullscreen & {
    @media (max-width: 520px) {
      grid-template-columns: repeat(1, 1fr);
    }
    @media (min-width: 521px) and (max-width: 820px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 821px) and (max-width: 1499px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1500px) and (max-width: 2499px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 2500px) and (max-width: 3839px) {
      grid-template-columns: repeat(5, 1fr);
    }
    @media (min-width: 3840px) {
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

/* ===================================== */
/* ✅ 【抽屉模式】按自身宽度响应（100%生效） */
/* ===================================== */
.form-container.drawer-mode .form-grid {
  @container (max-width: 620px) {
    grid-template-columns: repeat(1, 1fr) !important;
  }
  @container (min-width: 621px) and (max-width: 920px) {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  @container (min-width: 921px) and (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  @container (min-width: 1301px) and (max-width: 1800px) {
    grid-template-columns: repeat(4, 1fr) !important;
  }
  @container (min-width: 1801px) {
    grid-template-columns: repeat(5, 1fr) !important;
  }
}

/* 表单项自动充满网格，不挤压 */
:deep(.el-form-item) {
  width: 100% !important;
  margin: 0 !important;
}
</style>
