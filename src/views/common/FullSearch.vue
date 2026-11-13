<template>
  <div class="full-search-container">
    <!-- 右上角辅助按钮 -->
    <!--    <div class="header-action">-->
    <!--      <el-link type="primary" :underline="false" class="setting-link">设置</el-link>-->
    <!--    </div>-->

    <!-- ================= 模式一：初始搜索大主页（无搜索关键词时居中展示） ================= -->
    <div v-if="!hasSearched" class="initial-hero-wrapper">
      <div class="hero-bg-lines"></div>

      <div class="hero-content">
        <h1 class="main-title">{{ $t('platform.fullTextSearch') }}</h1>

        <!-- 顶部业务分类 Tabs -->
        <div class="category-tabs-center">
          <span
            v-for="cat in categories"
            :key="cat.key"
            :class="['category-tab-item', { active: currentCategory === cat.key }]"
            @click="handleCategoryChange(cat.key)"
          >
            {{ cat.label }}
          </span>
        </div>

        <!-- 居中主搜索胶囊输入框 -->
        <div class="hero-search-box">
          <el-dropdown trigger="click" @command="handleSearchTypeChange">
            <span class="search-type-select">
              {{ currentSearchTypeLabel }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="all">全文</el-dropdown-item>
                <el-dropdown-item command="title">按标题</el-dropdown-item>
                <el-dropdown-item command="person">按人员</el-dropdown-item>
                <el-dropdown-item command="doc">按文档</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <input
            v-model="searchKeyword"
            type="text"
            class="hero-search-input"
            placeholder="请输入搜索内容关键字"
            @keyup.enter="handleSearch(true)"
          />

          <button class="hero-search-btn" @click="handleSearch(true)">搜 索</button>
        </div>

        <!-- 下方热点推荐卡片（双列布局） -->
        <div class="hot-cards-row">
          <!-- 系统热点 -->
          <div class="hot-card">
            <div class="hot-card-title">系统热点</div>
            <div class="hot-grid">
              <div
                v-for="(item, idx) in systemHotList"
                :key="`${item.text}-${idx}`"
                class="hot-item"
                @click="quickSearch(item.text)"
              >
                <span
                  :class="[
                    'rank-num',
                    { top3: idx < 3, top1: idx === 0, top2: idx === 1, top3rd: idx === 2 },
                  ]"
                >
                  {{ idx + 1 }}
                </span>
                <span class="rank-text" :title="item.text">{{ item.text }}</span>
              </div>
            </div>
          </div>

          <!-- 个人热点 -->
          <div class="hot-card">
            <div class="hot-card-title">个人热点</div>
            <div class="hot-grid">
              <div
                v-for="(item, idx) in personalHotList"
                :key="`${item.text}-${idx}`"
                class="hot-item"
                @click="quickSearch(item.text)"
              >
                <span
                  :class="[
                    'rank-num',
                    { top3: idx < 3, top1: idx === 0, top2: idx === 1, top3rd: idx === 2 },
                  ]"
                >
                  {{ idx + 1 }}
                </span>
                <span class="rank-text" :title="item.text">{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= 模式二：搜索结果页 ================= -->
    <div v-else class="results-page-wrapper">
      <!-- 顶部搜索栏条目 -->
      <div class="top-search-bar">
        <div class="search-input-capsule">
          <el-dropdown trigger="click" @command="handleSearchTypeChange">
            <span class="search-type-select">
              {{ currentSearchTypeLabel }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="all">全文</el-dropdown-item>
                <el-dropdown-item command="title">按标题</el-dropdown-item>
                <el-dropdown-item command="person">按人员</el-dropdown-item>
                <el-dropdown-item command="doc">按文档</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <input
            v-model="searchKeyword"
            type="text"
            class="top-input"
            placeholder="请输入搜索内容关键字"
            @keyup.enter="handleSearch(true)"
          />

          <el-icon v-if="searchKeyword" class="clear-icon" @click="handleClear">
            <CircleClose />
          </el-icon>

          <button class="top-search-btn" @click="handleSearch(true)">
            {{ $t('platform.ebApp.search') }}
          </button>
        </div>

        <el-tooltip :content="$t('platform.ebApp.searchHelpTip')" placement="top">
          <el-icon class="help-question-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>

      <!-- 分类 Tabs 栏 -->
      <div class="result-categories-bar">
        <span
          v-for="cat in categories"
          :key="cat.key"
          :class="['result-category-item', { active: currentCategory === cat.key }]"
          @click="handleCategoryChange(cat.key)"
        >
          {{ cat.label }}
        </span>
      </div>

      <!-- 排序过滤器与耗时统计行 -->
      <div class="filter-sort-row">
        <div class="sort-pills">
          <span
            v-for="sort in sortOptions"
            :key="sort.key"
            :class="['sort-pill', { active: currentSort === sort.key }]"
            @click="handleSortChange(sort.key)"
          >
            {{ sort.label }}
          </span>
        </div>

        <div class="meta-stats">
          <span class="search-tool-btn">
            <el-icon><Operation /></el-icon> 搜索工具
          </span>
          <span class="stats-text"> {{ total }} 条结果，耗时 {{ costTime }} 秒 </span>
        </div>
      </div>

      <!-- 主体结果左右分栏布局 -->
      <div class="results-layout-grid">
        <!-- 左侧：搜索主结果列表 -->
        <div v-loading="loading" class="main-results-column">
          <template v-if="resultList.length > 0">
            <div class="doc-results-list">
              <div
                v-for="item in resultList"
                :key="`${item.className}-${item.entityId}`"
                class="doc-result-card"
                @click="handleResultClick(item)"
              >
                <div class="doc-header-line">
                  <span class="doc-type-badge"
                    >[{{ getCategoryLabel(item.categoryId, item.className) }}]</span
                  >
                  <span
                    class="doc-title-link"
                    v-html="highlight(item.title || item.entityCode || item.entityId)"
                  ></span>
                  <span v-if="item.entityCode && item.title" class="doc-code-tag">
                    {{ item.entityCode }}
                  </span>
                </div>

                <!-- 摘要展示（带关键词高亮） -->
                <div
                  v-if="item.summary"
                  class="doc-summary-line"
                  v-html="highlight(item.summary)"
                ></div>

                <div class="doc-meta-line">
                  <span v-if="item.createdBy" class="meta-text">创建者：{{ item.createdBy }}</span>
                  <span v-if="item.createdTime" class="meta-text">
                    创建时间：{{ formatTime(item.createdTime) }}
                  </span>
                  <span v-if="item.updatedTime" class="meta-text">
                    更新时间：{{ formatTime(item.updatedTime) }}
                  </span>

                  <div class="doc-actions" @click.stop>
                    <el-icon class="action-icon" title="有帮助"><Pointer /></el-icon>
                    <el-icon class="action-icon" title="没用"><Bottom /></el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部标准分页组件 -->
            <div class="pagination-wrapper">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </template>

          <el-empty v-else-if="!loading" description="暂无匹配的搜索结果" :image-size="120" />
        </div>

        <!-- 右侧：侧边推荐栏 -->
        <div class="side-recommend-column">
          <!-- 相关反馈卡片 -->
          <div class="side-card feedback-card">
            <div class="side-card-header">
              <span class="side-title">相关反馈</span>
              <div class="side-pager">
                <el-icon class="pager-btn"><ArrowLeft /></el-icon>
                <span class="pager-num">1/1</span>
                <el-icon class="pager-btn"><ArrowRight /></el-icon>
              </div>
            </div>
            <div class="feedback-item">
              <el-avatar
                :size="40"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <div class="feedback-info">
                <div class="feedback-user">系统管理员 [流程]</div>
                <div class="feedback-desc" v-html="highlight(searchKeyword || '系统通知')"></div>
                <div class="feedback-date">2026-10-12 09:28:12</div>
              </div>
            </div>
          </div>

          <!-- 侧边热点卡片 -->
          <div class="side-card side-hot-card">
            <div class="side-tabs-header">
              <span
                :class="['side-tab', { active: sideHotTab === 'system' }]"
                @click="sideHotTab = 'system'"
              >
                系统热点
              </span>
              <span
                :class="['side-tab', { active: sideHotTab === 'personal' }]"
                @click="sideHotTab = 'personal'"
              >
                个人热点
              </span>
            </div>
            <div class="side-hot-list">
              <div
                v-for="(item, idx) in currentSideHotList"
                :key="`${item.text}-${idx}`"
                class="side-hot-item"
                @click="quickSearch(item.text)"
              >
                <span
                  :class="[
                    'rank-num',
                    { top3: idx < 3, top1: idx === 0, top2: idx === 1, top3rd: idx === 2 },
                  ]"
                >
                  {{ idx + 1 }}
                </span>
                <span class="hot-name">{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bottom,
  CircleClose,
  Operation,
  Pointer,
  QuestionFilled,
} from '@element-plus/icons-vue';
import { executeOpenApi, getEntityDefine } from '@/api/common/platform';
import BeTableContainer from '@/components/BeTableContainer.vue';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
import { useModal } from '@/components/dialog/useModal.ts';

// ================= 类型定义（与后端 SearchQueryDTO / SearchResultVO 严格对齐） =================
interface CategoryItem {
  key: string;
  label: string;
  categoryId: number | null;
}

interface HotItem {
  text: string;
}

interface SearchQueryPayload {
  rawKeyword: string;
  segmentedKeyword: string;
  searchType: string;
  categoryId: number | null;
  groupId?: number | null;
  className?: string;
  sortType: string;
  pageNum: number;
  pageSize: number;
}

interface SearchResultVO {
  categoryId?: number;
  groupId?: number;
  className: string;
  entityId: string;
  entityCode: string;
  title?: string;
  summary?: string;
  score?: number;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
}

const route = useRoute();

// ================= 响应式状态 =================
const searchKeyword = ref('');
const hasSearched = ref(false);
const loading = ref(false);
const currentSearchType = ref('all');
const currentCategory = ref('all');
const currentSort = ref('relevance');
const sideHotTab = ref<'system' | 'personal'>('system');
const { open } = useModal();

// 分页与结果状态
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const costTime = ref('0.000');
const resultList = ref<SearchResultVO[]>([]);
const { t, locale } = useI18n();

const searchTypeMap: Record<string, string> = {
  all: '全文',
  title: '按标题',
  person: '按人员',
  doc: '按文档',
};
const currentSearchTypeLabel = computed(() => searchTypeMap[currentSearchType.value] || '全文');

// TODO: 请将 categoryId 替换为实际数据库/字典中的分类 ID
const categories: CategoryItem[] = [
  { key: 'all', label: '全部', categoryId: null },
  { key: 'image', label: '图片', categoryId: 1 },
  { key: 'doc', label: '文档', categoryId: 2 },
  { key: 'flow', label: '流程', categoryId: 3 },
  { key: 'person', label: '人员', categoryId: 4 },
  { key: 'schedule', label: '日程', categoryId: 5 },
  { key: 'mail', label: '邮件', categoryId: 6 },
  { key: 'attachment', label: '附件', categoryId: 7 },
  { key: 'official', label: '公文', categoryId: 8 },
  { key: 'meeting', label: '会议', categoryId: 9 },
];

const sortOptions = [
  { key: 'relevance', label: '相关度优先' },
  { key: 'latest_update', label: '最近更新优先' },
  { key: 'latest_create', label: '最新创建优先' },
  { key: 'earliest_create', label: '最早创建优先' },
];

const systemHotList = ref<HotItem[]>([
  { text: 'MDM' },
  { text: '物料' },
  { text: '采购' },
  { text: '审批' },
  { text: '发票助手' },
  { text: '公文' },
]);

const personalHotList = ref<HotItem[]>([
  { text: 'MDM' },
  { text: '物料分类' },
  { text: '123' },
  { text: '配置' },
  { text: '日志' },
  { text: '接口' },
]);

const currentSideHotList = computed(() => {
  return sideHotTab.value === 'system' ? systemHotList.value : personalHotList.value;
});

const currentCategoryId = computed<number | null>(() => {
  const found = categories.find((c) => c.key === currentCategory.value);
  return found ? found.categoryId : null;
});

// ================= 核心接口调用 =================
async function fetchSearchResults() {
  loading.value = true;
  const startTime = performance.now();

  // 构建 SearchQueryDTO 请求体
  const kw = searchKeyword.value.trim();
  const payload: SearchQueryPayload = {
    rawKeyword: kw,
    segmentedKeyword: kw, // 后端 SearchIndexService 中对 rawKeyword 做 HanLP 分词
    searchType: currentSearchType.value,
    categoryId: currentCategoryId.value,
    sortType: currentSort.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  };

  executeOpenApi('4VAvzFmxi', {}, payload)
    .then((res) => {
      const pageData = res.data;
      resultList.value = pageData?.records || [];
      total.value = Number(pageData?.total || 0);

      costTime.value = ((performance.now() - startTime) / 1000).toFixed(3);
      loading.value = false;
    })
    .catch((err) => {
      console.error('全文检索接口异常:', err);
      ElMessage.error(err?.message || '搜索服务请求失败');
      resultList.value = [];
      total.value = 0;
    });
}

// ================= 交互处理 =================
function handleSearch(resetPage = false) {
  if (resetPage) {
    currentPage.value = 1;
  }
  hasSearched.value = true;
  fetchSearchResults();
}

function handleClear() {
  searchKeyword.value = '';
}

function quickSearch(text: string) {
  searchKeyword.value = text;
  handleSearch(true);
}

function handleCategoryChange(key: string) {
  currentCategory.value = key;
  if (hasSearched.value) {
    handleSearch(true);
  }
}

function handleSortChange(sortKey: string) {
  currentSort.value = sortKey;
  handleSearch(true);
}

function handleSearchTypeChange(type: string) {
  currentSearchType.value = type;
  // 如果选择按人员/按文档，也可以按需同步联动 categoryId，或由后端按 searchType 过滤
  if (hasSearched.value) {
    handleSearch(true);
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  handleSearch(false);
}

function handleSizeChange(size: number) {
  pageSize.value = size;
  handleSearch(true);
}

function handleResultClick(item: SearchResultVO) {
  getEntityDefine(item.className).then((entityDefine) => {
    const queryParams = {};
    queryParams['idQueryType'] = 'eq';
    queryParams['id'] = item.entityId;
    const metaData = {
      queryParams: queryParams,
      className: item.className,
    };
    open(
      BeTableContainer,
      {
        metaData: metaData,
      },
      {
        title: getLangText(entityDefine.name, locale.value),
        width: '60%',
        dialogModel: false,
        footer: false,
      },
    );
  });
}

// ================= 辅助格式化函数 =================
function getCategoryLabel(categoryId?: number, className?: string): string {
  if (categoryId != null) {
    const cat = categories.find((c) => c.categoryId === categoryId);
    if (cat) return cat.label;
  }
  return className || '文档';
}

function formatTime(timeStr?: string): string {
  if (!timeStr) return '-';
  return timeStr.replace('T', ' ').slice(0, 19);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlight(text?: string): string {
  if (!text) return '';
  const safeText = escapeHtml(text);
  const kw = searchKeyword.value.trim();
  if (!kw) return safeText;

  // 多个空格分词同时高亮，且转义正则特殊字符防止报错
  const tokens = kw
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!tokens.length) return safeText;

  const reg = new RegExp(`(${tokens.join('|')})`, 'gi');
  return safeText.replace(
    reg,
    '<span style="color: var(--el-color-danger); font-weight: 500;">$1</span>',
  );
}

// ================= 路由参数联动（兼容 Navbar 跳转） =================
onMounted(() => {
  const kw = route.query.keyword;
  if (typeof kw === 'string' && kw.trim()) {
    searchKeyword.value = kw.trim();
    handleSearch(true);
  }
});

watch(
  () => route.query.keyword,
  (newKw) => {
    if (typeof newKw === 'string' && newKw.trim()) {
      searchKeyword.value = newKw.trim();
      handleSearch(true);
    } else if (newKw === undefined && hasSearched.value) {
      // 从 Navbar 空回车再次跳转过来时回到主页或刷新列表
      searchKeyword.value = '';
    }
  },
);
</script>

<style scoped>
.full-search-container {
  min-height: calc(100vh - 60px);
  background-color: var(--el-bg-color);
  padding: 16px 24px 40px;
  position: relative;
  font-family: var(--el-font-family);
  color: var(--el-text-color-primary);
}

/* ================= 模式一：居中主页样式 ================= */
.initial-hero-wrapper {
  max-width: 960px;
  margin: 60px auto 0;
  text-align: center;
  position: relative;
}

.hero-bg-lines {
  position: absolute;
  top: -60px;
  left: -20%;
  right: -20%;
  bottom: -40px;
  background: radial-gradient(
    circle at 50% 30%,
    var(--el-color-primary-light-9) 0%,
    var(--el-fill-color-lighter) 60%,
    transparent 80%
  );
  pointer-events: none;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.main-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
  letter-spacing: 2px;
  margin-bottom: 24px;
}

.category-tabs-center {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.category-tab-item {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  cursor: pointer;
  padding-bottom: 4px;
  transition: all var(--el-transition-duration);
  position: relative;
}
.category-tab-item:hover {
  color: var(--el-color-primary);
}
.category-tab-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}
.category-tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: var(--el-color-primary);
  border-radius: var(--el-border-radius-small);
}

/* 居中大搜索框 */
.hero-search-box {
  display: flex;
  align-items: center;
  width: 680px;
  height: 48px;
  margin: 0 auto 40px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 24px;
  padding: 4px 6px 4px 16px;
  box-shadow: var(--el-box-shadow-light);
  transition: all var(--el-transition-duration);
}
.hero-search-box:hover,
.hero-search-box:focus-within {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 16px var(--el-color-primary-light-8);
}

.search-type-select {
  display: flex;
  align-items: center;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-secondary);
  cursor: pointer;
  padding-right: 12px;
  border-right: 1px solid var(--el-border-color-lighter);
}

.hero-search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 16px;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  background: transparent;
}
.hero-search-input::placeholder {
  color: var(--el-text-color-placeholder);
}

.hero-search-btn {
  height: 38px;
  padding: 0 28px;
  border: none;
  border-radius: 19px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  color: var(--el-color-white);
  font-size: var(--el-font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: opacity var(--el-transition-duration);
}
.hero-search-btn:hover {
  opacity: 0.9;
}

/* 热点双卡片 */
.hot-cards-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 30px;
}

.hot-card {
  width: 320px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  padding: 16px 20px;
  text-align: left;
}

.hot-card-title {
  font-size: var(--el-font-size-base);
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.hot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 16px;
}

.hot-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  transition: color var(--el-transition-duration);
}
.hot-item:hover {
  color: var(--el-color-primary);
}

.rank-num {
  display: inline-block;
  width: 16px;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-placeholder);
  font-weight: 500;
  margin-right: 8px;
}
.rank-num.top1 {
  color: var(--el-color-danger);
  font-weight: 600;
}
.rank-num.top2 {
  color: var(--el-color-warning);
  font-weight: 600;
}
.rank-num.top3rd {
  color: var(--el-color-warning-light-3);
  font-weight: 600;
}

.rank-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ================= 模式二：搜索结果页样式 ================= */
.results-page-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

.top-search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input-capsule {
  display: flex;
  align-items: center;
  width: 580px;
  height: 40px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 20px;
  padding: 2px 4px 2px 14px;
  transition: border-color var(--el-transition-duration);
}
.search-input-capsule:focus-within {
  border-color: var(--el-color-primary);
}

.top-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 12px;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  background: transparent;
}
.top-input::placeholder {
  color: var(--el-text-color-placeholder);
}

.clear-icon {
  color: var(--el-text-color-placeholder);
  font-size: 16px;
  cursor: pointer;
  margin-right: 8px;
}
.clear-icon:hover {
  color: var(--el-text-color-secondary);
}

.top-search-btn {
  height: 32px;
  padding: 0 20px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  color: var(--el-color-white);
  font-size: var(--el-font-size-base);
  cursor: pointer;
}

.help-question-icon {
  font-size: 18px;
  color: var(--el-text-color-placeholder);
  cursor: pointer;
}
.help-question-icon:hover {
  color: var(--el-text-color-secondary);
}

/* 分类 Tabs */
.result-categories-bar {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.result-category-item {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-regular);
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;
}
.result-category-item:hover {
  color: var(--el-color-primary);
}
.result-category-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}
.result-category-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -11px;
  height: 2px;
  background-color: var(--el-color-primary);
}

/* 排序 Pills 与统计 */
.filter-sort-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sort-pills {
  display: flex;
  gap: 8px;
}
.sort-pill {
  font-size: var(--el-font-size-extra-small);
  padding: 4px 12px;
  border-radius: var(--el-border-radius-small);
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition: all var(--el-transition-duration);
}
.sort-pill:hover {
  color: var(--el-color-primary);
}
.sort-pill.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.meta-stats {
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 16px;
}
.search-tool-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}
.search-tool-btn:hover {
  color: var(--el-color-primary);
}

/* 结果左右分栏 */
.results-layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
}

.main-results-column {
  min-height: 240px;
}

/* 文档列表 */
.doc-results-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.doc-result-card {
  padding: 14px 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  transition: all var(--el-transition-duration);
  cursor: pointer;
}
.doc-result-card:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-light);
}

.doc-header-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.doc-type-badge {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  flex-shrink: 0;
}
.doc-title-link {
  font-size: var(--el-font-size-base);
  font-weight: 500;
  color: var(--el-color-primary);
  word-break: break-all;
}
.doc-result-card:hover .doc-title-link {
  text-decoration: underline;
}
.doc-code-tag {
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
  padding: 1px 6px;
  border-radius: var(--el-border-radius-small);
}

.doc-summary-line {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.doc-meta-line {
  display: flex;
  align-items: center;
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
  gap: 20px;
}
.doc-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
.action-icon {
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-placeholder);
  cursor: pointer;
}
.action-icon:hover {
  color: var(--el-color-primary);
}

/* 分页包裹区 */
.pagination-wrapper {
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: flex-start;
}

/* 右侧栏样式 */
.side-recommend-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
  background: var(--el-bg-color);
}

.side-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.side-title {
  font-size: var(--el-font-size-base);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.side-pager {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-secondary);
}
.pager-btn {
  cursor: pointer;
}
.pager-btn:hover {
  color: var(--el-color-primary);
}

.feedback-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.feedback-user {
  font-size: var(--el-font-size-small);
  font-weight: 500;
  color: var(--el-color-success);
  margin-bottom: 4px;
}
.feedback-desc {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}
.feedback-date {
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-placeholder);
}

/* 侧边热点 Tab */
.side-tabs-header {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.side-tab {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
  cursor: pointer;
}
.side-tab.active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.side-hot-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.side-hot-item {
  display: flex;
  align-items: center;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  cursor: pointer;
}
.side-hot-item:hover {
  color: var(--el-color-primary);
}
.hot-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
