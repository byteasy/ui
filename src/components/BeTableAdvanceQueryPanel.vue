<template>
  <div class="be-advance-query-panel" v-if="visible">
    <!-- 1. 顶部逻辑关系选择 -->
    <div class="panel-top-bar">
      <div class="logic-selector-box">
        <span class="label-text">{{ $t('table.matchBelow') || '满足以下' }}</span>
        <el-select v-model="matchLogic" size="small" class="logic-select">
          <el-option label="所有 (AND)" value="AND" />
          <el-option label="任一 (OR)" value="OR" />
        </el-select>
        <span class="label-text">{{ $t('table.conditions') || '条件' }}</span>
      </div>
    </div>

    <!-- 2. 主体条件区域 -->
    <div class="panel-main-content">
      <div class="section-header">
        <div class="section-title">
          <span>{{ $t('table.commonConditions') || '常用条件' }}</span>
        </div>
        <div class="section-actions">
          <el-icon class="action-icon" :title="$t('table.customConditions') || '自定义条件配置'" @click="handleOpenCustomConfig">
            <Setting />
          </el-icon>
          <el-icon class="action-icon" :title="$t('common.collapse') || '收起'" @click="handleClose">
            <ArrowUp />
          </el-icon>
        </div>
      </div>

      <!-- 动态栅格表单（2列响应式布局） -->
      <el-form label-position="right" class="advance-filter-form">
        <el-row :gutter="24">
          <template v-for="col in searchFields" :key="col.name">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="filter-col-item">
              <el-form-item :label="`${getLangText(col.displayName, locale)} :`" class="filter-form-item">
                <div class="filter-control-group">
                  <!-- 操作符下拉框 -->
                  <el-select
                    v-model="queryParams[col.name + 'QueryType']"
                    class="operator-select"
                    size="default"
                    :placeholder="$t('table.operator') || '操作符'"
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
                      :is="getComponent(parseComponent(col.fieldComponent || '/components/BeTableQueryField.vue'))"
                      :param="parseComponentParam(col.fieldComponent || '/components/BeTableQueryField.vue')"
                      v-model="queryParams[col.name]"
                      :column="col"
                      :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
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
      <div class="bottom-left">
        <el-button plain size="default" class="btn-save-filter" @click="handleSaveCommonFilter">
          {{ $t('table.saveAsCommonFilter') || '保存常用筛选' }}
        </el-button>
      </div>

      <div class="bottom-center-right">
        <el-button type="primary" class="btn-search" @click="handleSearch">
          {{ $t('search') || '搜索' }}
        </el-button>
        <el-button plain class="btn-reset" @click="handleReset">
          {{ $t('reset') || '重置' }}
        </el-button>
        <el-button plain class="btn-collapse" @click="handleClose">
          {{ $t('common.collapse') || '收起' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineModel, onMounted } from 'vue';
import { Setting, ArrowUp } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getLangText } from '@/locales/common.ts';
import { parseComponent, parseComponentParam } from '@/util/common.ts';
import { getComponent } from '@/util/componentLoader.ts';
import { type BeColumn, type BeTableProps } from '@/components/BeTable.ts';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  tableProps: BeTableProps;
  fields: Array<BeColumn>;
}>();

const emit = defineEmits<{
  (e: 'search', query: Record<string, any>): void;
  (e: 'reset'): void;
  (e: 'close'): void;
  (e: 'save-filter', currentQuery: Record<string, any>): void;
}>();

const { t, locale } = useI18n();

// 双向绑定的可见性开关与查询条件
const visible = defineModel<boolean>('visible', { default: false });
const queryParams = defineModel<Record<string, any>>('queryParams', { default: () => ({}) });
const matchLogic = defineModel<string>('matchLogic', { default: 'AND' });

// 筛选所有允许查询的字段
const searchFields = computed(() => {
  return props.fields?.filter((f) => f.isSearch === 'YES') || [];
});

/**
 * 根据列字段类型动态获取可用的查询操作符
 */
function getOperatorsByFieldType(type: string) {
  if (type === 'STRING') {
    return [
      { label: t('table.opLike') || '包含', value: 'like' },
      { label: t('table.opEq') || '等于', value: 'eq' },
      { label: t('table.opNe') || '不等于', value: 'ne' },
      { label: t('table.opLikeLeft') || '开头为', value: 'likeLeft' },
      { label: t('table.opLikeRight') || '结尾为', value: 'likeRight' },
      { label: t('table.opNull') || '为空', value: 'isNull' },
      { label: t('table.opNotNull') || '不为空', value: 'isNotNull' },
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
      { label: t('table.opEq') || '等于', value: 'eq' },
      { label: t('table.opGt') || '大于', value: 'gt' },
      { label: t('table.opGe') || '大于等于', value: 'ge' },
      { label: t('table.opLt') || '小于', value: 'lt' },
      { label: t('table.opLe') || '小于等于', value: 'le' },
      { label: t('table.opBetween') || '介于', value: 'between' },
    ];
  }
  if (type === 'LOCAL_DATE' || type === 'LOCAL_DATE_TIME') {
    return [
      { label: t('table.opBetween') || '范围', value: 'between' },
      { label: t('table.opEq') || '等于', value: 'eq' },
      { label: t('table.opGe') || '之后', value: 'ge' },
      { label: t('table.opLe') || '之前', value: 'le' },
    ];
  }
  // ENUM / 参照 等默认使用包含或相等
  return [
    { label: t('table.opIn') || '包含', value: 'in' },
    { label: t('table.opEq') || '等于', value: 'eq' },
    { label: t('table.opNe') || '不等于', value: 'ne' },
  ];
}

/**
 * 初始化默认查询操作符
 */
onMounted(() => {
  searchFields.value.forEach((col) => {
    const key = col.name + 'QueryType';
    if (!queryParams.value[key]) {
      // 默认 STRING 赋 'like'，其余赋 'eq' 或 'between'
      if (col.type === 'STRING') {
        queryParams.value[key] = 'like';
      } else if (col.type.includes('DATE')) {
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
    _matchLogic: matchLogic.value,
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

/**
 * 保存常用筛选方案
 */
function handleSaveCommonFilter() {
  ElMessage.success(t('table.saveFilterSuccess') || '常用筛选方案已保存');
  emit('save-filter', queryParams.value);
}

function handleOpenCustomConfig() {
  ElMessage.info(t('table.openCustomConfig') || '打开筛选字段配置');
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
  width: 100px;
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

/* 搜索主按钮（支持墨绿/主题色） */
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
