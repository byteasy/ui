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
            @keyup.enter="handleSearch"
          />

          <button class="hero-search-btn" @click="handleSearch">搜 索</button>
        </div>

        <!-- 下方热点推荐卡片（双列布局） -->
        <div class="hot-cards-row">
          <!-- 系统热点 -->
          <div class="hot-card">
            <div class="hot-card-title">系统热点</div>
            <div class="hot-grid">
              <div
                v-for="(item, idx) in systemHotList"
                :key="item.text"
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
                :key="item.text"
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

    <!-- ================= 模式二：搜索结果页（有搜索关键词/已提交状态） ================= -->
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
            @keyup.enter="handleSearch"
          />

          <el-icon v-if="searchKeyword" class="clear-icon" @click="handleClear">
            <CircleClose />
          </el-icon>

          <button class="top-search-btn" @click="handleSearch">
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
          <span class="stats-text">
            {{ searchResults.total }} 条结果，耗时 {{ searchResults.costTime }} 秒
          </span>
        </div>
      </div>

      <!-- 主体结果左右分栏布局 -->
      <div class="results-layout-grid">
        <!-- 左侧：搜索主结果列表 -->
        <div class="main-results-column">
          <!-- 1. 人员卡片结果 -->
          <div v-if="searchResults.personList?.length" class="person-cards-group">
            <div
              v-for="person in searchResults.personList"
              :key="person.id"
              class="person-card-item"
            >
              <el-avatar :size="52" :src="person.avatar" class="person-avatar" />
              <div class="person-info-content">
                <div class="person-title-row">
                  <span class="person-name" v-html="highlight(person.name)"></span>
                  <span class="person-dept">{{ person.dept }}</span>
                </div>
                <div class="person-meta-row">
                  <span class="meta-field">装配工</span>
                  <span class="meta-field">上级：{{ person.manager }}</span>
                  <span class="meta-field">电话：{{ person.phone || '-' }}</span>
                  <span class="meta-field">手机：{{ person.mobile }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 图片类结果横向展示 -->
          <div v-if="searchResults.imageList?.length" class="images-result-section">
            <div class="section-title">
              <span class="keyword-highlight">{{ searchKeyword }}</span>
              <span>-图片</span>
            </div>
            <div class="images-scroll-row">
              <div v-for="img in searchResults.imageList" :key="img.id" class="image-thumb-card">
                <el-image
                  :src="img.url"
                  fit="cover"
                  class="thumb-img"
                  :preview-src-list="[img.url]"
                  preview-teleported
                />
                <div class="thumb-name" v-html="highlight(img.name)"></div>
              </div>
            </div>
            <div class="more-images-link">
              <el-link type="primary" :underline="false">查看全部图片 &gt;</el-link>
            </div>
          </div>

          <!-- 3. 文档 / 流程 / 通用条目结果列表 -->
          <div class="doc-results-list">
            <div v-for="item in searchResults.docList" :key="item.id" class="doc-result-card">
              <div class="doc-header-line">
                <span class="doc-type-badge">[{{ item.typeLabel }}]</span>
                <span class="doc-title-link" v-html="highlight(item.title)"></span>
              </div>
              <div class="doc-meta-line">
                <span class="meta-text">创建者：{{ item.creator }}</span>
                <span class="meta-text">创建时间：{{ item.createTime }}</span>
                <span class="meta-text">更新时间：{{ item.updateTime }}</span>

                <div class="doc-actions">
                  <el-icon class="action-icon" :title="'有帮助'"><Pointer /></el-icon>
                  <el-icon class="action-icon" :title="'没用'"><Bottom /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. 底部标准分页组件 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="searchResults.total"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
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
                <div class="feedback-desc" v-html="highlight('123')"></div>
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
                :key="item.text"
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
import { ref, computed } from 'vue';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CircleClose,
  QuestionFilled,
  Operation,
  Pointer,
  Bottom,
} from '@element-plus/icons-vue';

interface CategoryItem {
  key: string;
  label: string;
}

interface HotItem {
  text: string;
}

interface PersonItem {
  id: string;
  name: string;
  dept: string;
  manager: string;
  phone: string;
  mobile: string;
  avatar: string;
}

interface ImageItem {
  id: string;
  url: string;
  name: string;
}

interface DocItem {
  id: string;
  typeLabel: string;
  title: string;
  creator: string;
  createTime: string;
  updateTime: string;
}

const searchKeyword = ref('123');
const hasSearched = ref(false);
const currentSearchType = ref('all');
const currentCategory = ref('all');
const currentSort = ref('relevance');
const sideHotTab = ref<'system' | 'personal'>('system');

// 分页状态
const currentPage = ref(1);
const pageSize = ref(20);

const searchTypeMap: Record<string, string> = {
  all: '全文',
  title: '标题',
  person: '人员',
  doc: '文档',
};
const currentSearchTypeLabel = computed(() => searchTypeMap[currentSearchType.value] || '全文');

const categories: CategoryItem[] = [
  { key: 'all', label: '全部' },
  { key: 'image', label: '图片' },
  { key: 'doc', label: '文档' },
  { key: 'flow', label: '流程' },
  { key: 'person', label: '人员' },
  { key: 'schedule', label: '日程' },
  { key: 'mail', label: '邮件' },
  { key: 'attachment', label: '附件' },
  { key: 'official', label: '公文' },
  { key: 'meeting', label: '会议' },
];

const sortOptions = [
  { key: 'relevance', label: '相关度优先' },
  { key: 'latest_update', label: '最近更新优先' },
  { key: 'latest_create', label: '最新创建优先' },
  { key: 'earliest_create', label: '最早创建优先' },
];

const systemHotList = ref<HotItem[]>([
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
]);

const personalHotList = ref<HotItem[]>([
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '马斯克' },
  { text: '1' },
  { text: '公文' },
]);

const currentSideHotList = computed(() => {
  return sideHotTab.value === 'system' ? systemHotList.value : personalHotList.value;
});

const searchResults = ref({
  total: 325,
  costTime: 1.043,
  personList: [
    {
      id: 'p1',
      name: '马斯克',
      dept: '加工中心1',
      manager: '马斯克',
      phone: '12345678912',
      mobile: '12345678912',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    },
    {
      id: 'p2',
      name: '马斯克',
      dept: '加工中心1',
      manager: '马斯克',
      phone: '',
      mobile: '12345678912',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    },
  ],
  imageList: [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop',
      name: 'tmp_830b74c1fa7f1232ccfebb363807db...',
    },
    {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop',
      name: 'tmp_ec1afe73e1123602a511e1bd8b433...',
    },
    {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop',
      name: 'tmp_e5f6b6d0a1d76818123b9ba088cfd...',
    },
    {
      id: 'img4',
      url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop',
      name: 'tmp_cdf122adaafdb1237f547bc7ebd989...',
    },
    {
      id: 'img5',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop',
      name: 'tmp_a8ba8d3551594115861b4af11554...',
    },
  ],
  docList: [
    {
      id: 'd1',
      typeLabel: '文档',
      title: 'tmp_830b74c1fa7f1232ccfebb363807db2c9e01fc6717cc25',
      creator: '系统管理员',
      createTime: '2026-10-16 14:25:51',
      updateTime: '2026-10-16 14:25:51',
    },
    {
      id: 'd2',
      typeLabel: '文档',
      title: 'tmp_ec1afe73e1123602a511e1bd8b43367b',
      creator: '系统管理员',
      createTime: '2026-10-15 15:41:04',
      updateTime: '2026-10-15 15:41:04',
    },
    {
      id: 'd3',
      typeLabel: '文档',
      title: 'zjjr_CMBC03_1786423592092_pdf_x512026081112463123046373620012249',
      creator: '系统管理员',
      createTime: '2026-10-14 11:15:20',
      updateTime: '2026-10-14 11:15:20',
    },
  ],
});

function handleSearch() {
  if (!searchKeyword.value.trim()) return;
  hasSearched.value = true;
  console.log('执行搜索：', {
    keyword: searchKeyword.value,
    category: currentCategory.value,
    sort: currentSort.value,
    page: currentPage.value,
    pageSize: pageSize.value,
  });
}

function handleClear() {
  searchKeyword.value = '';
}

function quickSearch(text: string) {
  searchKeyword.value = text;
  currentPage.value = 1;
  handleSearch();
}

function handleCategoryChange(key: string) {
  currentCategory.value = key;
  currentPage.value = 1;
  if (hasSearched.value) {
    handleSearch();
  }
}

function handleSortChange(sortKey: string) {
  currentSort.value = sortKey;
  currentPage.value = 1;
  handleSearch();
}

function handleSearchTypeChange(type: string) {
  currentSearchType.value = type;
}

function handlePageChange(page: number) {
  currentPage.value = page;
  handleSearch();
}

function handleSizeChange(size: number) {
  pageSize.value = size;
  currentPage.value = 1;
  handleSearch();
}

function highlight(text: string): string {
  if (!text || !searchKeyword.value.trim()) return text;
  const kw = searchKeyword.value.trim();
  const reg = new RegExp(`(${kw})`, 'gi');
  return text.replace(
    reg,
    '<span style="color: var(--el-color-danger); font-weight: 500;">$1</span>',
  );
}
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

.header-action {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.setting-link {
  font-size: var(--el-font-size-small);
  color: var(--el-color-primary);
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

/* 人员卡片 */
.person-cards-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.person-card-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.person-avatar {
  margin-right: 16px;
}

.person-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.person-name {
  font-size: var(--el-font-size-medium);
  font-weight: 600;
  color: var(--el-color-primary);
}
.person-dept {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-secondary);
}

.person-meta-row {
  display: flex;
  gap: 20px;
  font-size: var(--el-font-size-extra-small);
  color: var(--el-text-color-regular);
}

/* 图片类结果横向展示 */
.images-result-section {
  margin-bottom: 24px;
}
.section-title {
  font-size: var(--el-font-size-base);
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}
.keyword-highlight {
  color: var(--el-color-danger);
}

.images-scroll-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  margin-bottom: 8px;
}
.image-thumb-card {
  width: 140px;
  flex-shrink: 0;
}
.thumb-img {
  width: 140px;
  height: 110px;
  border-radius: var(--el-border-radius-base);
  display: block;
}
.thumb-name {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
}

.more-images-link {
  font-size: var(--el-font-size-extra-small);
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
}
.doc-result-card:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-light);
}

.doc-header-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.doc-type-badge {
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
}
.doc-title-link {
  font-size: var(--el-font-size-base);
  font-weight: 500;
  color: var(--el-color-primary);
  cursor: pointer;
  word-break: break-all;
}
.doc-title-link:hover {
  text-decoration: underline;
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
