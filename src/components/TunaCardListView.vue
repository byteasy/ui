<template>
  <!-- 外层容器：相对定位，用于右上角定位 -->
  <div class="card-grid-wrapper pl-2 pr-2 relative" :style="{ height: props.height + 'px', width: props.width + 'px' }">
    <!-- 卡片网格 -->
    <div class="card-grid" v-if="props.data?.length && props.data.length > 0">
      <div class="card-item" v-for="entity in props.data" :key="entity.id || entity.code || entity.name">
        <el-descriptions border :column="2" class="el-card w-full h-full">
          <template #extra>
            <div class="mt-3">
              <el-space direction="horizontal" :size="4" class="mt-1 mr-2">
                <slot name="table-operation" :row="entity">
                  <el-link underline="never" @click="handleRowAction('view', entity)" type="primary">
                    {{ t('table.view') }}
                  </el-link>
                  <el-link underline="never" @click="handleRowAction('edit', entity)" type="primary" v-permission="props.tableProps.className + '.Edit'">
                    {{ t('table.edit') }}
                  </el-link>
                  <slot name="table-operation-extra" :row="entity"></slot>
                  <el-popconfirm
                    :confirm-button-text="$t('ok')"
                    :cancel-button-text="$t('cancel')"
                    :title="$t('deleteWarn')"
                    :hide-after="10"
                    @confirm="handleRowAction('delete', entity)"
                  >
                    <template #reference>
                      <el-link underline="never" type="danger" v-permission="props.tableProps.className + '.Delete'">{{
                          t('table.delete')
                        }}
                      </el-link>
                    </template>
                  </el-popconfirm>
                  <slot name="table-operation-end-extra" :row="entity"></slot>
                </slot>
              </el-space>
            </div>
          </template>
          <template #title>
            <div class="mt-3">
              <slot name="table-column-title" :row="entity">
                <el-link type="primary" @click="handleRowAction('view', entity)" class="ml-3">
                  <el-text size="large" class="my-font-bold">
                    <tuna-i18n-value :model-value="entity[props.tableProps.titleColumnName || 'name' ]" class="text-truncate-36"></tuna-i18n-value>
                  </el-text>
                </el-link>
              </slot>
            </div>
          </template>
          <template v-for="col in props.fields" :key="col.name">
            <el-descriptions-item v-if="col.isShow === 'YES' && col.name !== props.tableProps.titleColumnName">
              <template #label>
                <span class="text-truncate-15" :title="getLangText(col.displayName, locale)">{{ getLangText(col.displayName, locale) }}</span>
              </template>
              <slot :name="'table-cell-' + col.name" :row="entity">
                <tuna-i18n-value v-if="col.isI18n === 'YES'" :model-value="entity[col.name]" :lang="props.tableProps.showLang" class="text-truncate-22" />
                <el-switch v-model="entity[col.name]" v-else-if="col.type === 'BOOL'" disabled>
                  <template #active-action>
                    <span>T</span>
                  </template>
                  <template #inactive-action>
                    <span>F</span>
                  </template>
                </el-switch>
                <enum-viewer
                  v-else-if="col.type === 'ENUM'"
                  :prop="entity[col.name] || ''"
                  :context="props.tableProps.context"
                  :code="col.typeClassName"
                />
                <span class="text-truncate-22" v-else :title="getLangText(entity[col.name], locale)">{{ getLangText(entity[col.name], locale) }}</span>
              </slot>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </div>
    </div>
    <div class="w-full flex-row justify-content-right" v-else>
      <el-empty class="w-full"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {type Component, defineExpose} from "vue";

const {t, locale} = useI18n()

const props = defineProps<{
  tableProps: {
    baseUrl: string
    context: string
    className: string
    titleColumnName?: string
    queryParams?: any
    formWidth?: string | number
    operationColumnWidth?: number
    paginationVisible?: number
    queryFormVisible?: number
    rowDbClick?: (row: any) => void
    excelImportEnable?: boolean
    formComponent?: Component
    excelImportComponent?: Component
    excelExportComponent?: Component
    dialogModel?: any
    rowKey?: string
    defaultExpandAll?: boolean
    treeProps?: object
    showLang?: string
    queryMode?: boolean
    multiple?: boolean
    showSummary?: boolean
    dataRenderFinish?: (tableData) => void
  },
  fields: Array<object>
  data: Array<object> | undefined
  height: number
  width: number
}>()

const emit = defineEmits(['rowAction'])

function handleRowAction(action, args) {
  emit('rowAction', action, args)
}

function getSelectionRows() {
}

function toggleRowSelection(row, sel) {
}

function setCurrentRow(row) {
}

defineExpose({
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
})
</script>

<style scoped>
/* 外层容器：用于定位右上角 */
.card-grid-wrapper {
  position: relative;
}

/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  padding-top: 12px; /* 给右上角文字留出空间 */
}

/* 响应式 */
/** 600 * 5 + 380 */
@media (max-width: 4600px) {
  .card-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/** 600 * 5 + 380 */
@media (max-width: 3800px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/** 600 * 4 + 380 */
@media (max-width: 3100px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
/** 600 * 3 + 380 */
@media (max-width: 2400px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/** 600 * 2 + 380 */
@media (max-width: 1600px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.card-item {
  width: 100%;
}

:deep(.el-descriptions) {
  width: 100% !important;
  table-layout: fixed;
  box-sizing: border-box;
}
</style>
