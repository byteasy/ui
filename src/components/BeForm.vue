<template>
  <div class="form-container"
       :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
       style="container-type: inline-size;">
    <div class="form-scroll-wrap">
      <el-form ref="refForm" label-width="auto" label-position="right" class="form-root"
               :model="formModel">
        <slot name="formItem" :props="props" :formModel="formModel" :queryParam="queryParam"
              :className="props.className">
          <component :is="getComponent(parseComponent(defaultFormItemComponent))"
                     :param="parseComponentParam(defaultFormItemComponent)"
                     :formModel="formModel"
                     :className="props.className"
                     :readonly="props.readonly"
                     :queryParam="queryParam">
            <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
              <slot :name="name" v-bind="slotProps"></slot>
            </template>
          </component>
        </slot>
        <slot name="formItemExtra" :props="props" :formModel="formModel" :queryParam="queryParam"
              :className="props.className"/>
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

const formModel = defineModel<any>('row', {default: () => ({})})
const queryParam = ref({})
const defaultFormItemComponent = ref(props.formItemComponent || '/components/BeFormItem.vue')

function onSaveClick() {
  refForm.value?.validate(valid => {
    if (!valid) return
    if (props.apiSave.startsWith('/')) {
      doHttpPost(props.apiSave, queryParam.value, formModel.value).then(() => {
        ElMessage.success(t('operationSuccess'))
        emit('close', 'ok')
      }).catch(err => {
        ElMessage.error(err.message)
      })
    } else {
      executeOpenApi(props.apiSave, queryParam.value, formModel.value).then(() => {
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

defineExpose({props, validate, queryParam, formModel, onSaveClick, onClearForm, onButtonClick})
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
