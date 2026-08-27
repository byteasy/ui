<template>
  <div :style="{ height: tableHeightCss }">
    <be-container>
      <template v-slot:topBar>
        <div class="w-full flex-column justify-content-start p-1" ref="queryBarRef">
          <div class="w-full flex-row">
            <div class="flex-grow flex-row justify-content-start">
            </div>
            <div class="flex-none">
              <el-button-group direction="horizontal">
                <el-button :title="$t('add')" @click="onToolbarActionClick(TableToolbarActionEnum.ADD, JSON.parse(JSON.stringify(props.formModel)))" type="primary">
                  <IconLocalAddOne style="width: 1rem; height: 1rem; color: var(--my-text-color)"/>
                </el-button>
                <el-popconfirm
                  :confirm-button-text="$t('ok')"
                  :cancel-button-text="$t('cancel')"
                  :title="$t('batchDeleteWarn')"
                  :hide-after="10"
                  v-if="selectionRows.length > 0 && props.tableProps.apiBatchDelete"
                  @confirm="onToolbarActionClick(TableToolbarActionEnum.BATCH_DELETE, selectionRows)">
                  <template #reference>
                    <el-button :title="$t('batchDelete')" type="danger" v-if="selectionRows.length > 0 && props.tableProps.apiBatchDelete">
                      <IconLocalBatchDelete style="width: 1rem; height: 1rem; color: var(--my-text-color)"/>
                    </el-button>
                  </template>
                </el-popconfirm>
              </el-button-group>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:mainContent>
        <el-auto-resizer>
          <template #default="{ height, width }">
            <be-table-editor
              ref="refBeTableView"
              :table-props="props.tableProps"
              :fields="props.fields"
              :show-summary="props.tableProps.showSummary"
              :height="height"
              :tableData="batchEditData"
              @row-click="onTableRowClick"
              @row-action="onRowActionHandle"
              @selection-change="(rows) => selectionRows = rows"
              v-loading="loading"
              :row-key="props.tableProps.rowKey">
              <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
                <slot :name="name" v-bind="slotProps"></slot>
              </template>
            </be-table-editor>
          </template>
        </el-auto-resizer>
      </template>
    </be-container>
  </div>
</template>

<script lang="ts" setup>
import {computed, defineEmits, defineExpose, ref,} from 'vue'
import BeContainer from '@/components/BeContainer.vue'
import {useI18n} from 'vue-i18n'
import {useModal} from "@/components/dialog/useModal.ts";
import {
  type BeColumn,
  type BeTableProps,
  TableRowActionEnum,
  TableToolbarActionEnum
} from "@/components/BeTable.ts";

const {t, locale} = useI18n()

const props = defineProps<{
  formModel: any
  tableProps: BeTableProps,
  fields: Array<BeColumn>,
}>()

const emit = defineEmits(['rowClick'])

const tableColumns = ref([])
const tableData = ref({total: '0'})
const selectionRows = ref([])
const loading = ref(false)
const batchEditData = ref([])
const refBeTableView = ref(null)
const {open} = useModal()

function onTableRowClick(row) {
  emit('rowClick', row)
}

function getSelectionRows() {
  return refBeTableView.value?.getSelectionRows()
}

function toggleRowSelection(row, sel) {
  refBeTableView.value?.toggleRowSelection(row, sel)
}

function setCurrentRow(row) {
  refBeTableView.value?.setCurrentRow(row)
}


function onToolbarActionClick(action: TableToolbarActionEnum, args) {
  if (action === TableToolbarActionEnum.SWITCH_VIEW) {
  } else if (action === TableToolbarActionEnum.ADD) {
    refBeTableView.value?.addNewRow(args)
  } else if (action === TableToolbarActionEnum.BATCH_ADD) {
  } else if (action === TableToolbarActionEnum.REFRESH) {
  } else if (action === TableToolbarActionEnum.BATCH_DELETE) {
  } else if (action === TableToolbarActionEnum.TABLE_EDITOR_BATCH_EDIT) {
  } else if (action === TableToolbarActionEnum.TABLE_EDITOR_BATCH_SAVE) {
  } else if (action === TableToolbarActionEnum.TABLE_EDITOR_CANCEL) {
  } else if (action === TableToolbarActionEnum.TABLE_EDITOR_BATCH_REMOVE) {
  }
}

function onRowActionHandle(action, args) {
  if (action === TableRowActionEnum.DELETE) {
  }
}

const tableHeightCss = computed({
  get() {
    return props.dialogModel === true ? (props.fullscreen === true ? 'calc(100vh - 100px)' : 'calc(60vh - 100px)') : 'calc(100vh - 185px)'
  },
  set() {
  }
})

defineExpose({
  props,
  tableColumns,
  tableData,
  loading,
  getSelectionRows,
  toggleRowSelection,
  setCurrentRow
})
</script>
