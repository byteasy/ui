<template>
  <div class="form-container" :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }" style="container-type: inline-size;">
    <div class="form-scroll-wrap">
      <el-form ref="refForm" label-width="auto" label-position="right" class="form-root"
               :model="formValue">
        <div class="form-grid w-full">
          <template v-for="col in tableColumns" :key="col.name">
            <slot :name="'formItem_' + col.name" :column="col" :props="props" :row="formValue">
              <el-form-item
                :label="getLangText(col.displayName, locale)"
                v-if="col.isForm === 'YES'"
                :prop="col.name"
                :rules="[
                    { required: col.isRequire === 'YES', message: getLangText(col.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(col, rule, value, locale, callback), trigger: 'blur' }
                  ]"
              >
                <slot :name="'formItemField_' + col.name" :row="formValue" :column="col"
                      :props="props">
                  <tuna-form-field
                    :column="col"
                    :context="props.context"
                    :placeholder="getLangText(col.displayName, locale)"
                    clearable
                    :disabled="props.readonly"
                    v-model="formValue[col.name]"
                  >
                    <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
                      <slot :name="name" v-bind="slotProps"></slot>
                    </template>
                  </tuna-form-field>
                </slot>
              </el-form-item>
            </slot>
          </template>

          <slot name="formExtra" :props="props" :row="formValue"/>
        </div>
      </el-form>
    </div>

    <!-- 底部按钮固定 -->
    <el-affix position="bottom" :offset="12" class="w-full">
    <div class="form-footer">
      <el-divider class="m-0"/>
      <div class="footer-buttons">
        <slot name="footerButton" :props="props">
          <el-button type="primary" @click="onSaveClick" icon="Check" v-if="!props.readonly">
            {{ t('save') }}
          </el-button>
          <el-button @click="onClearForm" icon="Close">{{ t('close') }}</el-button>
        </slot>
      </div>
    </div>
    </el-affix>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, defineExpose, onMounted, ref} from 'vue'
import TunaFormField from '@/components/TunaFormField.vue'
import {useI18n} from 'vue-i18n'
import {doHttpPost, getEntitySchema} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {validateColumnRule} from '@/util/validateUtils.ts'
import {putValueIfValid} from '@/util/common.ts'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {getLangText} from '@/locales/common.ts'

const {t, locale} = useI18n()
const emit = defineEmits(['close'])
const refForm = ref(null)
const appSettingsStore = useAppSettingsStore()

const props = defineProps<{
  url: string
  context: string
  columns?: Array<any>
  className?: string
  row?: any
  readonly?: boolean
  direction?: string
  fullscreen?: boolean
  isDrawer?: boolean
}>()

const formValue = ref({...props.row})
const tableColumns = ref(props.columns ?? [])
const queryParam = ref({})

onMounted(() => {
  if (!props.columns) loadTableColumns()
})

function loadTableColumns() {
  getEntitySchema(props.context, props.className)
    .then((response) => {
      const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data))
      tableColumns.value = arrs
    })
    .catch(() => ElMessage.error(t('table.loadingTableColumnsError')))
}

function sortColumnsByShowOrder(columns) {
  return [...columns].sort((a, b) => a.showOrder - b.showOrder)
}

function mergeLocalStorage(data) {
  const fields = appSettingsStore.getStorageObject(props.className + '.fields')
  if (!fields) return data

  data.forEach(col => {
    const custom = fields[col.name]
    if (custom) {
      putValueIfValid(col, 'width', custom.width)
      putValueIfValid(col, 'showOrder', custom.showOrder)
      putValueIfValid(col, 'isShow', custom.isShow)
      putValueIfValid(col, 'isSort', custom.isSort)
      putValueIfValid(col, 'isOverflow', custom.isOverflow)
      putValueIfValid(col, 'isSearch', custom.isSearch)
      putValueIfValid(col, 'align', custom.align)
    }
  })
  return data
}

function onSaveClick() {
  refForm.value?.validate(valid => {
    if (!valid) return
    doHttpPost(props.url, queryParam.value, formValue.value)
      .then(() => {
        ElMessage.success(t('operationSuccess'))
        emit('close')
      })
  })
}

const validate = () => {
  return new Promise(resolve => {
    refForm.value?.validate(valid => resolve(valid))
  })
}

function onClearForm() {
  refForm.value?.resetFields()
  emit('close')
}

defineExpose({props, validate, queryParam, formValue, onSaveClick, onClearForm})
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

.form-footer {
  flex-shrink: 0;
}

.footer-buttons {
  padding-bottom: 12px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
