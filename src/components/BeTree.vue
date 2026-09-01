<template>
  <div class="flex-column pr-2 w-full">
    <!-- 1. 骨架屏：在首次 loading 时显示 -->
    <div v-if="loading" class="w-full pt-1">
      <div class="flex-row align-items-center w-full mb-3">
        <el-skeleton-item variant="rect" class="w-full" style="height: 32px; border-radius: 4px" />
      </div>
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 2. 树容器：使用 v-show 或在骨架屏结束后平滑显示，并屏蔽加载中的空数据提示 -->
    <div v-show="!loading" class="w-full">
      <div class="flex-row align-items-center w-full">
        <el-input
          v-model="filterText"
          class=""
          clearable
          :placeholder="$t('platform.searchTip')"
          suffix-icon="search"
        />
        <el-button-group direction="horizontal" class="flex-none">
          <el-button
            :title="$t('add')"
            v-debounce="onAddTreeRootNodeClick"
            type="primary"
            v-if="props.apiSave === undefined || session.authorize(props.apiSave)"
          >
            <IconLocalAddOne style="width: 1rem; height: 1rem; color: var(--my-text-color)" />
          </el-button>
          <slot name="tool-buttons-extra"></slot>
        </el-button-group>
      </div>

      <el-tree
        ref="treeRef"
        class="filter-tree w-full pt-1"
        :data="treeData"
        :lazy="props.lazy"
        :load="loadChildren"
        :node-key="props.nodeKey"
        :props="{ label: props.label, children: props.children }"
        :empty-text="loading ? '' : undefined"
        @node-click="onTreeNodeClick"
        @node-contextmenu="onContextMenuClick"
        :highlight-current="props.highlightCurrent"
        :default-expand-all="props.defaultExpandAll"
        :check-strictly="props.checkStrictly"
        :expand-on-click-node="props.expandOnClickNode"
        :filter-node-method="filterNode"
      >
        <template #default="{ node, data }">
          <div class="w-full flex-row align-items-center">
            <div class="flex-none flex-row align-items-center">
              <be-svg-icon :svg="data.icon" v-if="data.icon" />
              <be-i18n-value :model-value="data[props.label]" class="pl-1" />
            </div>
          </div>
        </template>
      </el-tree>

      <!-- 右键上下文菜单 -->
      <el-dropdown
        ref="dropDownMenuRef"
        :trigger="['contextmenu']"
        :hide-on-click="true"
        class="w-full"
        placement="bottom"
        virtual-triggering
        :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 0] } }] }"
        :virtual-ref="contextMenuTriggerRef"
      >
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="onTreeNodeAddClick"
              v-if="props.apiSave === undefined || session.authorize(props.apiSave)"
            >
              <el-icon><FolderAdd /></el-icon>
              {{ $t('add') }}
            </el-dropdown-item>
            <el-dropdown-item
              @click="onTreeNodeEditClick"
              v-if="props.apiSave === undefined || session.authorize(props.apiSave)"
            >
              <el-icon><FolderOpened /></el-icon>
              {{ $t('table.edit') }}
            </el-dropdown-item>
            <el-dropdown-item
              @click="onTreeNodeDeleteClick"
              v-if="props.apiDelete === undefined || session.authorize(props.apiDelete)"
            >
              <el-icon><FolderDelete /></el-icon>
              {{ $t('table.delete') }}
            </el-dropdown-item>
            <template v-for="extra in props.contextExtraItems" :key="extra.name">
              <el-dropdown-item
                @click="onTreeNodeExtraClick(extra.name)"
                v-if="extra.permission === undefined || session.authorize(extra.permission)"
              >
                <be-svg-icon :svg="extra.icon" v-if="extra.icon" />
                {{ $t(extra.label) }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineExpose, nextTick, onMounted, ref, watch } from 'vue';
import { ElMessageBox, type FilterNodeMethodFunction, type TreeInstance } from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';
import { useI18n } from 'vue-i18n';
import { useSessionStore } from '@/stores/session.ts';

interface Tree {
  [key: string]: any;
}

interface ExtraItem {
  label: string;
  name: string;
  icon: string;
  permission?: string;
}

const props = withDefaults(
  defineProps<{
    /**
     * 查询列表数据的 OpenAPI 方法名或接口 URL（必填）
     */
    apiQuery: string;

    /**
     * 保存/新增/修改接口
     */
    apiSave?: string;

    /**
     * 单条删除接口
     */
    apiDelete?: string;
    contextExtraItems?: Array<ExtraItem>;
    label?: string;
    children?: string;
    nodeKey?: string;
    lazy?: boolean;
    defaultExpandAll?: boolean;
    highlightCurrent?: boolean;
    checkStrictly?: boolean;
    expandOnClickNode?: boolean;
    contextMenuEnable?: boolean;
  }>(),
  {
    apiQuery: undefined,
    apiSave: undefined,
    apiDelete: undefined,
    contextExtraItems: undefined,
    label: 'name',
    children: 'children',
    nodeKey: 'code',
    lazy: false,
    defaultExpandAll: false,
    highlightCurrent: true,
    checkStrictly: false,
    expandOnClickNode: false,
    contextMenuEnable: true,
  },
);

const emit = defineEmits([
  'nodeClick',
  'addNodeClick',
  'editNodeClick',
  'deleteNodeClick',
  'extraNodeClick',
]);
const session = useSessionStore();

const { t } = useI18n();
const loading = ref(true); // 初始为 true，等待首批数据返回
const activeContextMenuNode = ref(undefined);
const treeData = ref([]);
const filterText = ref('');
const treeRef = ref<TreeInstance>();
const dropDownMenuRef = ref(null);
const contextMenuPosition = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect);
const contextMenuTriggerRef = ref({
  getBoundingClientRect: () => contextMenuPosition.value,
});

watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

/**
 * 非懒加载模式：加载整棵树
 */
function loadTreeData() {
  loading.value = true;
  executeOpenApi(props.apiQuery, {}, {})
    .then((res: any) => {
      treeData.value = res.data || [];
    })
    .catch((err) => {
      console.error('加载树失败:', err);
      treeData.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 懒加载子节点数据
 */
async function loadChildren(node: any, resolve: (data: any[]) => void, reject: (err: any) => void) {
  try {
    const parentParam = node.level === 0 ? {} : node.data || {};
    const res: any = await executeOpenApi(props.apiQuery, parentParam, {});
    const result = res.data || [];

    resolve(result);

    // 只要是第一层（根节点）数据返回，立刻关闭骨架屏
    if (node.level === 0) {
      loading.value = false;
    }

    // 单个子节点自动递归展开
    if (result.length === 1) {
      await nextTick();
      const singleChildNode = node.childNodes?.[0];
      if (singleChildNode && !singleChildNode.isLeaf) {
        singleChildNode.expand();
      }
    }
  } catch (err) {
    console.error('加载子节点失败:', err);
    if (node.level === 0) {
      loading.value = false;
    }
    reject(err);
  }
}

const handleCloseContextMenu = () => {
  dropDownMenuRef.value?.handleClose();
};

const handleContextmenuOpen = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  contextMenuPosition.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  });
  event.preventDefault();
  dropDownMenuRef.value?.handleOpen();
};

function onContextMenuClick(event: MouseEvent, data: any) {
  if (!props.contextMenuEnable) {
    return;
  }
  activeContextMenuNode.value = data;
  handleContextmenuOpen(event);
}

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true;
  const labelKey = props.label || 'name';
  return data[labelKey]?.includes(value) ?? false;
};

function onAddTreeRootNodeClick() {
  emit('addNodeClick', undefined);
}

function onTreeNodeAddClick() {
  emit('addNodeClick', activeContextMenuNode.value);
  executeOpenApi(props.apiQuery, activeContextMenuNode.value, {})
    .then((res: any) => {
      activeContextMenuNode.value.children = res.data;
    })
    .catch(() => {});
}

function onTreeNodeEditClick() {
  emit('editNodeClick', activeContextMenuNode.value);
  refreshCurrentNode(activeContextMenuNode.value);
}

function onTreeNodeExtraClick(name: string) {
  emit('extraNodeClick', name, activeContextMenuNode.value);
  refreshCurrentNode(activeContextMenuNode.value);
}

function onTreeNodeDeleteClick() {
  ElMessageBox.confirm(t('deleteWarn'), t('warning'), {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(() => {
    emit('deleteNodeClick', activeContextMenuNode.value);
    refreshCurrentNode(activeContextMenuNode.value);
  });
}

function getParentData(currentData: any) {
  const currentNode = treeRef.value?.getNode(currentData);
  let parentData = undefined;
  if (currentNode && currentNode.parent && currentNode.parent.level > 0) {
    parentData = currentNode.parent.data;
  }
  return parentData;
}

function onTreeNodeClick(data: any) {
  emit('nodeClick', data);
}

function refresh() {
  if (props.lazy) {
    // 懒加载模式重置根节点
    const rootNode = treeRef.value?.root;
    if (rootNode) {
      rootNode.loaded = false;
      rootNode.loading = false;
      rootNode.childNodes = [];
      rootNode.loadData();
    }
  } else {
    loadTreeData();
  }
}

onMounted(() => {
  if (!props.lazy) {
    loadTreeData();
  }
  // 如果是 lazy 模式，el-tree 会在挂载时由其自身生命周期自动调用 loadChildren (node.level === 0)
});

function refreshCurrentNode(nodeData: any) {
  const parent = getParentData(nodeData);
  if (parent !== undefined) {
    executeOpenApi(props.apiQuery, parent, {})
      .then((res: any) => {
        const parentKey = parent[props.nodeKey];
        treeRef.value!.updateKeyChildren(parentKey, res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    refresh();
  }
}

defineExpose({
  refresh,
});
</script>
