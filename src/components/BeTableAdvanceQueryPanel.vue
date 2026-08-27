<template>
  <div class="be-advance-query-panel" v-if="visible">
    <!-- 1. 顶部逻辑关系选择 -->
    <div class="panel-top-bar">
      <div class="logic-selector-box">
        <span class="label-text">{{ $t('platform.ebApp.matchBelow') }}</span>
        <el-select v-model="queryParams.matchLogic" size="small" class="logic-select">
          <el-option :label="$t('platform.ebApp.matchLogicAnd')" value="AND" />
          <el-option :label="$t('platform.ebApp.matchLogicOr')" value="OR" />
        </el-select>
        <span class="label-text">{{ $t('platform.ebApp.conditions') }}</span>
      </div>
    </div>

    <!-- 2. 主体条件区域 -->
    <div class="panel-main-content">
      <div class="section-header">
        <div class="section-title">
          <span>{{ $t('platform.ebApp.commonConditions') }}</span>
        </div>
        <div class="section-actions">
          <el-icon
            class="action-icon"
            :title="$t('platform.ebApp.customConditions')"
            @click="handleOpenCustomConfig"
          >
            <Setting />
          </el-icon>
          <el-icon class="action-icon" :title="$t('platform.ebApp.collapse')" @click="handleClose">
            <ArrowUp />
          </el-icon>
        </div>
      </div>

      <!-- 动态栅格表单（2列响应式布局） -->
      <el-form label-position="right" class="advance-filter-form">
        <el-row :gutter="24">
          <template v-for="col in searchFields" :key="col.name">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="filter-col-item">
              <el-form-item
                :label="`${getLangText(col.displayName, locale)} :`"
                class="filter-form-item"
              >
                <div class="filter-control-group">
                  <!-- 操作符下拉框 -->
                  <el-select
                    v-model="queryParams[col.name + 'QueryType']"
                    class="operator-select"
                    size="default"
                    :placeholder="$t('platform.ebApp.operatorPlaceholder')"
                  >
                    <el-option
                      v-for="op in getOperatorsByFieldType(col.type)"
                      :key="op.value"
                      :label="op.label"
                      :value="op.value"
                    />
                  </el-select>

                  <!-- 具体的输入控件（复用 BeTableQueryField） -->
                  <div class="field-input-box">
                    <component
                      :is="
                        getComponent(
                          parseComponent(col.fieldComponent || '/components/BeTableQueryField.vue'),
                        )
                      "
                      :param="
                        parseComponentParam(
                          col.fieldComponent || '/components/BeTableQueryField.vue',
                        )
                      "
                      v-model="queryParams[col.name]"
                      :column="col"
                      :placeholder="
                        getLangText(col.description || col.displayName || col.name, locale)
                      "
                      :disabled="queryParams[col.name + 'Readonly'] === true"
                      :formModel="queryParams"
                      clearable
                      class="w-full"
                    />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </template>

          <!-- 供外部扩展自定义表单项 -->
          <slot name="query-form-extra" :queryParams="queryParams" />
        </el-row>
      </el-form>
    </div>

    <!-- 3. 底部操作栏 -->
    <div class="panel-bottom-bar">
      <div class="bottom-left"></div>

      <div class="bottom-center-right">
        <el-button type="primary" class="btn-search" @click="handleSearch">
          {{ $t('platform.ebApp.search') }}
        </el-button>
        <el-button plain class="btn-reset" @click="handleReset">
          {{ $t('platform.ebApp.reset') }}
        </el-button>
        <el-button plain class="btn-collapse" @click="handleClose">
          {{ $t('platform.ebApp.collapse') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineModel, onMounted } from 'vue';
import { ArrowUp, Setting } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getLangText } from '@/locales/common.ts';
import { parseComponent, parseComponentParam } from '@/util/common.ts';
import { getComponent } from '@/util/componentLoader.ts';
import { type BeColumn, type BeTableProps, TableToolbarActionEnum } from '@/components/BeTable.ts';

const props = defineProps<{
  tableProps: BeTableProps;
  fields: Array<BeColumn>;
}>();

const emit = defineEmits<{
  (e: 'search', query: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'close'): void;
  (e: 'columnDefine'): void;
}>();

const { t, locale } = useI18n();

// 双向绑定的可见性开关与查询条件
const visible = defineModel<boolean>('visible', { default: false });
const queryParams = defineModel<Record<string, any>>('queryParams', { default: () => ({}) });

// 筛选所有允许查询的字段
const searchFields = computed(() => {
  return props.fields?.filter((f) => f.isSearch === 'YES') || [];
});

/**
 * 根据列字段类型动态获取可用的查询操作符（全量使用国际化词条）
 */
function getOperatorsByFieldType(type: string) {
  if (type === 'STRING') {
    return [
      { label: t('platform.ebApp.opLike'), value: 'like' },
      { label: t('platform.ebApp.opEq'), value: 'eq' },
      { label: t('platform.ebApp.opNe'), value: 'ne' },
      { label: t('platform.ebApp.opLikeLeft'), value: 'likeLeft' },
      { label: t('platform.ebApp.opLikeRight'), value: 'likeRight' },
      { label: t('platform.ebApp.opNull'), value: 'isNull' },
      { label: t('platform.ebApp.opNotNull'), value: 'isNotNull' },
    ];
  }
  if (
    type === 'INT' ||
    type === 'LONG' ||
    type === 'FLOAT' ||
    type === 'DOUBLE' ||
    type === 'SHORT' ||
    type === 'BYTE'
  ) {
    return [
      { label: t('platform.ebApp.opEq'), value: 'eq' },
      { label: t('platform.ebApp.opGt'), value: 'gt' },
      { label: t('platform.ebApp.opGe'), value: 'ge' },
      { label: t('platform.ebApp.opLt'), value: 'lt' },
      { label: t('platform.ebApp.opLe'), value: 'le' },
      { label: t('platform.ebApp.opBetween'), value: 'between' },
    ];
  }
  if (type === 'LOCAL_DATE' || type === 'LOCAL_DATE_TIME') {
    return [
      { label: t('platform.ebApp.opBetween'), value: 'between' },
      { label: t('platform.ebApp.opEq'), value: 'eq' },
      { label: t('platform.ebApp.opAfter'), value: 'ge' },
      { label: t('platform.ebApp.opBefore'), value: 'le' },
    ];
  }
  // ENUM / 参照 等默认使用包含或相等
  return [
    { label: t('platform.ebApp.opIn'), value: 'in' },
    { label: t('platform.ebApp.opEq'), value: 'eq' },
    { label: t('platform.ebApp.opNe'), value: 'ne' },
  ];
}

/**
 * 初始化默认查询操作符
 */
onMounted(() => {
  if (!queryParams.value.matchLogic) {
    queryParams.value.matchLogic = 'AND';
  }
  searchFields.value.forEach((col) => {
    const key = col.name + 'QueryType';
    if (!queryParams.value[key]) {
      if (col.type === 'STRING') {
        queryParams.value[key] = 'like';
      } else if (col.type?.includes('DATE')) {
        queryParams.value[key] = 'between';
      } else if (col.type === 'ENUM' || col.multiple === 'YES') {
        queryParams.value[key] = 'in';
      } else {
        queryParams.value[key] = 'eq';
      }
    }
  });
});

/**
 * 触发搜索
 */
function handleSearch() {
  const finalParams = {
    ...queryParams.value,
  };
  emit('search', finalParams);
}

/**
 * 重置条件
 */
function handleReset() {
  searchFields.value.forEach((col) => {
    delete queryParams.value[col.name];
  });
  emit('reset');
  handleSearch();
}

/**
 * 关闭 / 收起面板
 */
function handleClose() {
  visible.value = false;
  emit('close');
}

function handleOpenCustomConfig() {
  emit(TableToolbarActionEnum.COLUMN_DEFINE);
}
</script>

<style scoped>
/* 外层容器：纯净白底，精致顶部内阴影与轻描边 */
.be-advance-query-panel {
  width: 100%;
  background-color: var(--el-bg-color, #ffffff);
  border: 1px solid var(--el-border-color-lighter, #ebeef5);
  border-radius: 6px;
  padding: 14px 20px 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

/* 顶部逻辑选择栏 */
.panel-top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.logic-selector-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
}

.logic-select {
  width: 108px;
}

/* 分隔与标题栏 */
.panel-main-content {
  border-top: 1px solid var(--el-border-color-extra-light, #f2f3f5);
  padding-top: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon {
  font-size: 15px;
  color: var(--el-text-color-secondary, #909399);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: var(--el-color-primary, #409eff);
}

/* 栅格项与表单样式 */
.filter-col-item {
  margin-bottom: 6px;
}

.filter-form-item {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
}

.filter-form-item :deep(.el-form-item__label) {
  min-width: 100px;
  padding-right: 12px;
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
}

.filter-form-item :deep(.el-form-item__content) {
  flex: 1;
}

/* 操作符下拉 + 输入框组合容器 */
.filter-control-group {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

/* 操作符下拉框 */
.operator-select {
  width: 96px !important;
  min-width: 96px !important;
  flex-shrink: 0;
}

.field-input-box {
  flex: 1;
  min-width: 0;
}

.field-input-box :deep(.el-input),
.field-input-box :deep(.el-select),
.field-input-box :deep(.el-date-editor) {
  width: 100% !important;
}

/* 底部操作栏 */
.panel-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--el-border-color-extra-light, #f2f3f5);
}

.bottom-left .btn-save-filter {
  font-size: 13px;
  color: var(--el-text-color-regular, #606266);
  border-color: var(--el-border-color, #dcdfe6);
}

.bottom-center-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 搜索主按钮 */
.btn-search {
  background-color: #0b8235 !important;
  border-color: #0b8235 !important;
  color: #fff !important;
  padding: 8px 18px;
}

.btn-search:hover {
  background-color: #0d963e !important;
  border-color: #0d963e !important;
}

.btn-reset,
.btn-collapse {
  padding: 8px 16px;
}
</style>
