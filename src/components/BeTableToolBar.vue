<template>
  <div class="w-full flex-column justify-content-start p-1" ref="queryBarRef">
    <div class="w-full flex-row justify-content-end">
      <be-table-one-key-search
        v-model="queryParams.oneKeySearch"
        @refresh="onToolbarActionClick(TableToolbarActionEnum.REFRESH, undefined)"
        v-model:isAdvanceSearchActive="advanceSearch"
      />

      <!-- BeTableView 工具栏 -->
      <el-button-group
        direction="horizontal"
        v-if="props.tableProps.queryMode !== true && batchEditModel !== true"
      >
        <el-button
          :title="$t('add')"
          v-if="hasPermission(tableProps.apiSave)"
          @click="
            onToolbarActionClick(
              TableToolbarActionEnum.ADD,
              JSON.parse(JSON.stringify(queryParams)),
            )
          "
          type="primary"
        >
          <IconLocalAddOne style="width: 1rem; height: 1rem; color: var(--my-text-color)" />
        </el-button>

        <el-button
          :title="$t('batchAdd')"
          v-if="hasPermission(tableProps.apiImportBatchSave)"
          @click="
            onToolbarActionClick(
              TableToolbarActionEnum.BATCH_ADD,
              JSON.parse(JSON.stringify(queryParams)),
            )
          "
          type="primary"
        >
          <IconLocalBatchAdd style="width: 1rem; height: 1rem; color: var(--my-text-color)" />
        </el-button>

        <el-button
          :title="$t('batchEdit')"
          v-if="hasPermission(tableProps.apiImportBatchSave)"
          @click="
            onToolbarActionClick(TableToolbarActionEnum.TABLE_EDITOR_BATCH_EDIT, selectionRows)
          "
          type="primary"
        >
          <IconLocalBatchEditTable style="width: 1rem; height: 1rem; color: var(--my-text-color)" />
        </el-button>
        <el-popconfirm
          :confirm-button-text="$t('ok')"
          :cancel-button-text="$t('cancel')"
          :title="$t('batchDeleteWarn')"
          :hide-after="10"
          v-if="selectionRows.length > 0 && props.tableProps.apiBatchDelete"
          @confirm="onToolbarActionClick(TableToolbarActionEnum.BATCH_DELETE, selectionRows)"
        >
          <template #reference>
            <el-button
              :title="$t('batchDelete')"
              type="danger"
              v-if="hasPermission(tableProps.apiBatchDelete) && selectionRows.length > 0 && props.tableProps.apiBatchDelete"
            >
              <IconLocalBatchDelete
                style="width: 1rem; height: 1rem; color: var(--my-text-color)"
              />
            </el-button>
          </template>
        </el-popconfirm>
        <slot
          name="tool-buttons-extra"
          :queryParams="queryParams"
          :queryMode="props.tableProps.queryMode"
        ></slot>
      </el-button-group>

      <!-- BeTableEditor 工具栏 -->
      <el-button-group direction="horizontal" v-if="batchEditModel === true">
        <el-button
          :title="$t('add')"
          @click="
            onToolbarActionClick(
              TableToolbarActionEnum.TABLE_EDITOR_ADD_ROW,
              JSON.parse(JSON.stringify(queryParams)),
            )
          "
          type="primary"
        >
          <IconLocalAddOne style="width: 1rem; height: 1rem; color: var(--my-text-color)" />
        </el-button>
        <el-popconfirm
          :confirm-button-text="$t('ok')"
          :cancel-button-text="$t('cancel')"
          :title="$t('batchDeleteWarn')"
          :hide-after="10"
          v-if="selectionRows.length > 0"
          @confirm="
            onToolbarActionClick(TableToolbarActionEnum.TABLE_EDITOR_BATCH_REMOVE, selectionRows)
          "
        >
          <template #reference>
            <el-button :title="$t('batchDelete')" type="danger" v-if="selectionRows.length > 0">
              <IconLocalBatchDelete
                style="width: 1rem; height: 1rem; color: var(--my-text-color)"
              />
            </el-button>
          </template>
        </el-popconfirm>
        <el-button
          :title="$t('save')"
          @click="onToolbarActionClick(TableToolbarActionEnum.TABLE_EDITOR_BATCH_SAVE, undefined)"
          icon="Check"
          v-if="hasPermission(tableProps.apiImportBatchSave)"
          type="primary"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          :title="$t('cancel')"
          @click="onToolbarActionClick(TableToolbarActionEnum.TABLE_EDITOR_CANCEL, undefined)"
          icon="Check"
          type="danger"
        >
          {{ $t('cancel') }}
        </el-button>
      </el-button-group>

      <template v-if="batchEditModel !== true">
        <el-dropdown placement="bottom-start">
          <el-button text icon="MoreFilled" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="onToolbarActionClick(TableToolbarActionEnum.SWITCH_VIEW, undefined)"
              >
                <el-icon>
                  <List />
                </el-icon>
                {{ $t('table.viewModel') }}
              </el-dropdown-item>
              <el-dropdown-item
                @click="onToolbarActionClick(TableToolbarActionEnum.COLUMN_DEFINE, undefined)"
              >
                <el-icon>
                  <SetUp />
                </el-icon>
                {{ $t('table.customColumn') }}
              </el-dropdown-item>
              <el-dropdown-item
                divided
                v-if="hasPermission(tableProps.apiImportBatchSave)"
                @click="
                  onToolbarActionClick(TableToolbarActionEnum.DOWNLOAD_EXCEL_TEMPLATE, undefined)
                "
              >
                <el-icon>
                  <Download />
                </el-icon>
                {{ $t('table.downLoadExcelTemplate') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission(tableProps.apiImportBatchSave)"
                @click="onToolbarActionClick(TableToolbarActionEnum.EXCEL_IMPORT, undefined)"
              >
                <el-icon>
                  <IconLocalExcel />
                </el-icon>
                {{ $t('table.importByExcel') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission(tableProps.apiExport)"
                @click="onToolbarActionClick(TableToolbarActionEnum.EXCEL_EXPORT, undefined)"
              >
                <el-icon>
                  <IconLocalExcelExport />
                </el-icon>
                {{ $t('table.exportToExcel') }}
              </el-dropdown-item>
              <slot
                name="more-action-extra"
                :queryParams="queryParams"
                :queryMode="props.tableProps.queryMode"
                @actionClick="(action) => onToolbarActionClick(action, undefined)"
              ></slot>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>

    <!-- 更多搜索条件，默认关闭 -->
    <div class="w-full flex-row mt-2" v-if="advanceSearch">
      <BeTableAdvanceQueryPanel
        v-if="advanceSearch"
        v-model:visible="advanceSearch"
        v-model:queryParams="queryParams"
        :tableProps="props.tableProps"
        :fields="props.fields"
        @search="onToolbarActionClick(TableToolbarActionEnum.REFRESH, undefined)"
        @columnDefine="onToolbarActionClick(TableToolbarActionEnum.COLUMN_DEFINE, undefined)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineModel,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { ElIcon } from 'element-plus';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
import { useSessionStore } from '@/stores/session.ts';
import { type BeColumn, type BeTableProps, TableToolbarActionEnum } from '@/components/BeTable.ts';

const props = defineProps<{
  tableProps: BeTableProps;
  fields: Array<BeColumn>;
}>();

const { t, locale } = useI18n();
const emit = defineEmits(['toolbarAction']);
const queryParams = defineModel<any>('queryParams', { default: () => ({}) });
const selectionRows = defineModel<any>('selectionRows', { default: () => ({}) });
const batchEditModel = defineModel<any>('batchEditModel', { default: () => ({}) });

const queryBarRef = ref(null);
const isCollapsed = ref(true);
const showCollapseBtn = ref(true);
const advanceSearch = ref(false);
const containerWidth = ref(600);
const visibleFields = ref<BeColumn[]>([]);
const { hasPermission } = useSessionStore();

onMounted(() => {
  containerWidth.value = queryBarRef.value?.offsetWidth;
  updateVisibleFields();
});

function getVisibleCount() {
  const searchFields = props.fields?.filter((s) => s.isSearch === 'YES');
  let count = 0;
  let w = containerWidth.value;
  w = w - 300;
  for (let i = 0; i < searchFields.length; i++) {
    const fieldWidth = searchFields[i]?.width;
    const lang = getLangText(searchFields[i]?.displayName, locale);
    if (fieldWidth === 0) {
      w = w - 200 - 20 * lang.length;
    } else {
      w = w - fieldWidth - 20 * (lang?.length || 0);
    }
    if (w > 0) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

const updateVisibleFields = () => {
  const num = getVisibleCount();
  const searchFields = props.fields?.filter((s) => s.isSearch === 'YES');
  const actualNum = isCollapsed.value === true ? num : searchFields.length;
  if (searchFields.length > num) {
    showCollapseBtn.value = true;
  } else {
    showCollapseBtn.value = false;
  }
  if (visibleFields.value.length < actualNum) {
    for (let i = visibleFields.value.length; i < actualNum && i < searchFields.length; i++) {
      visibleFields.value.push(searchFields[i]);
    }
  }
  if (visibleFields.value.length > actualNum) {
    while (visibleFields.value.length > actualNum) {
      visibleFields.value.splice(visibleFields.value.length - 1, 1);
    }
  }
};

let resizeTimer = null;
const onResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    containerWidth.value = queryBarRef.value?.offsetWidth || 0;
    updateVisibleFields();
  }, 100);
};

onMounted(() => {
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});

onActivated(() => {
  nextTick(() => {
    setTimeout(() => {
      containerWidth.value = queryBarRef.value?.offsetWidth || 0;
      updateVisibleFields();
      window.addEventListener('resize', onResize);
    }, 100);
  });
});

onDeactivated(() => {
  window.removeEventListener('resize', onResize);
});

const onToolbarActionClick = (action, args) => {
  emit('toolbarAction', action, args);
};
</script>
