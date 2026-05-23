<template>
  <div class="form-container"
       :class="{ fullscreen: props.fullscreen, 'drawer-mode': props.isDrawer === true }"
       style="container-type: inline-size;">
      <el-select v-model="selectedKey" v-bind="$attrs" class="w-full"
                 v-if="props.column.uiComponent === 'SELECT'">
        <el-option v-for="obj in tableData.records"
                   :key="obj[props.column.externalClassPrimaryField]"
                   :value="obj[props.column.externalClassPrimaryField]"
                   :label="getLangText(obj[props.column.externalClassDisplayField], locale)"/>
      </el-select>
      <el-radio-group v-model="selectedKey" v-bind="$attrs" class="w-full"
                      v-if="props.column.uiComponent === 'RADIO'">
        <el-radio v-for="obj in tableData.records"
                  :key="obj[props.column.externalClassPrimaryField]"
                  :value="obj[props.column.externalClassPrimaryField]"
                  :label="getLangText(obj[props.column.externalClassDisplayField], locale)"/>
      </el-radio-group>
    <!-- 底部按钮固定 -->
    <el-affix position="bottom" :offset="12" class="w-full">
      <div class="form-footer">
        <el-divider class="m-0"/>
        <div class="footer-buttons">
          <slot name="footerButton" :props="props">
            <el-button type="primary" @click="onSaveClick" icon="Check">
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
import {defineEmits, onMounted, ref} from "vue";
import {doHttpGet, getEntitySchema} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  modelValue: any
  column: {
    className: string
    name: string
    displayName: string
    type: string // 若值固定（如 STRING/Number），可改为 "STRING" | "NUMBER" 限定
    typeClassName: string
    isShow: 'YES' | 'NO' // 枚举值用联合类型限定
    isSort: 'YES' | 'NO'
    isOverflow: 'YES' | 'NO'
    isSearch: 'YES' | 'NO'
    isFixed: 'YES' | 'NO'
    isRequire: 'YES' | 'NO'
    isForm: 'YES' | 'NO'
    align: 'LEFT' | 'CENTER' | 'RIGHT' // 对齐方式限定
    width: number
    showOrder: number
    minLength: number
    maxLength: number
    min: number
    max: number
    precision: number
    multiple: 'YES' | 'NO'
    relationType: 'EXTERNAL_KEY' | 'DETAIL_TABLE' | null | undefined
    externalClass: any
    externalClassPrimaryField: any
    externalClassDisplayField: any
    uiComponent: 'SELECT' | 'RADIO' | 'TABLE'
  }
  entityDefine: object
  queryParams?: Record<string, any>
  fullscreen?: boolean
  isDrawer?: boolean
}>()
const emit = defineEmits(['close'])
const queryParams = ref({current: 1, size: 5000, ...props.queryParams})
const columns = ref([])
const tableData = ref({total: '0'})
const loading = ref(false)
const selectedKey = ref(props.modelValue)
const {t, locale} = useI18n()

onMounted(() => {
  console.log('selectedKey', selectedKey.value)
  if (props.column.uiComponent === 'TABLE') {
    getEntitySchema(props.entityDefine.serviceInstance.contextPath.substring(1), props.entityDefine.code).then(response => {
      columns.value = response.data
    })
  } else { // RADIO OR SELECT
    refresh()
  }
})

function refresh() {
  loading.value = true
  doHttpGet(props.entityDefine.serviceInstance.contextPath + props.entityDefine.url, queryParams.value).then((rsp) => {
    tableData.value = rsp.data
    loading.value = false
  })
}
function onSaveClick() {
  let selObj = {}
  for (let i = 0; i < tableData.value.records.length; i++) {
    if(tableData.value.records[i][props.column.externalClassPrimaryField] === selectedKey.value) {
      selObj = tableData.value.records[i]
    }
  }
  emit('close', selObj)
}

function onClearForm() {
  emit('close', {})
}
</script>


<style scoped>
/* 整体容器：高度100% 自适应 */
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  container-type: inline-size;
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
