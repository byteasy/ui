<template>
  <div class="w-full flex-column" style="height: 85vh !important;">
    <el-upload
      class="w-full"
      drag
      with-credentials
      :on-success="onUploadSuccess"
      :before-upload="
        () => {
          loading = true
        }
      "
      :action="props.url + '/excel/importPreview?lang=' + locale"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        {{ $t('table.importByExcelTip') }}
      </div>
    </el-upload>
    <div class="w-full flex-grow">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table
            :height="height"
            :data="tableData.records"
            fix
            scrollbar-always-on
            v-loading="loading"
            highlight-current-row
          >
            <template v-for="col in props.columns" :key="col.name">
              <slot :name="'columnsSlot_' + col.name" :column="col">
                <el-table-column
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                  :fixed="col.isFixed === 'YES'"
                  :label="getLangText(col.displayName, locale)"
                  :prop="col.name"
                  stripe
                  highlight-current-row
                  v-if="col.isForm === 'YES' && col.type !== 'ENUM'"
                  :min-width="col.width === 0 ? undefined : col.width"
                  :show-overflow-tooltip="col.isOverflow === 'YES'"
                >
                  <template #default="scope">
                    <slot :name="'table_column_' + col.name" :row="scope.row">
                      <tuna-i18n-value :model-value="scope.row[col.name]" />
                    </slot>
                  </template>
                </el-table-column>
                <enum-column
                  :align="
                    col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'
                  "
                  :code="col.typeClassName"
                  :context="props.context"
                  :fixed="col.isFixed === 'YES'"
                  :label="getLangText(col.displayName, locale)"
                  :prop="col.name"
                  v-if="col.isForm === 'YES' && col.type === 'ENUM'"
                  :min-width="col.width === 0 ? undefined : col.width"
                  :show-overflow-tooltip="col.isOverflow === 'YES'"
                />
              </slot>
            </template>
            <el-table-column
              fixed="right"
              :label="$t('table.columnWarningMessage')"
              :min-width="160"
            >
              <template #default="scope">
                <el-icon color="var(--el-color-success)" v-if="!scope.row.validateResult">
                  <SuccessFilled />
                </el-icon>
                <div v-else>
                  <el-icon color="var(--el-color-error)">
                    <WarningFilled />
                  </el-icon>
                  <el-text type="danger">{{ scope.row.validateResult }}</el-text>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-auto-resizer>
    </div>
    <div class="w-full flex-column">
      <el-affix position="bottom" class="w-full">
        <div class="flex-row w-full justify-content-center pb-2 pt-1">
          <slot name="footerButton" :props="props">
            <el-button type="primary" icon="Check" @click="doSubmit"
              >{{ $t('table.importByExcelSubmitButton') }}
            </el-button>
            <el-button @click="closeForm" icon="Close">{{ $t('close') }}</el-button>
          </slot>
        </div>
      </el-affix>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, defineExpose, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { doHttpPost } from '@/api/common/platform'
import {getLangText} from "@/locales/common.ts";

const props = defineProps<{
  url: string
  context: string
  columns: Array<any>
}>()

const tableData = ref({ total: '0', records: [] })
const loading = ref<boolean>(false)
const emit = defineEmits(['close'])
const validSuccess = ref(false)
const { t, locale } = useI18n() // 表单引用

const closeForm = () => {
  emit('close')
}

function onUploadSuccess(response: any) {
  loading.value = false
  tableData.value.records = response.data
  tableData.value.total = response.data.length
  if (response.status !== 200) {
    ElMessage.error(response.description)
    validSuccess.value = false
  } else {
    validSuccess.value = true
  }
}

function doSubmit() {
  if (validSuccess.value === false) {
    ElMessage.error(t('table.importByExcelValidFailedTip'))
    return
  }
  saveBatch()
}

function saveBatch() {
  doHttpPost(props.url + '/batch', {}, tableData.value.records).then((response) => {
    ElMessage.success(t('operationSuccess'))
    closeForm()
  })
}

defineExpose({
  props,
  validSuccess,
  doSubmit,
  saveBatch,
  closeForm,
})
</script>
