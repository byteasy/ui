<template>
  <div class="flex-column pr-2 w-full">
    <!-- 1. 骨架屏：在首次 loading 时显示 -->
    <div v-if="loading" class="w-full pt-1">
      <div class="flex-row align-items-center w-full mb-3">
        <el-skeleton-item variant="rect" class="w-full" style="height: 32px; border-radius: 4px" />
      </div>
      <el-skeleton :rows="6" animated />
    </div>

    <!-- 2. 树容器 -->
    <div v-show="!loading" class="w-full">
      <div class="flex-row align-items-center w-full">
        <el-input
          v-model="filterText"
          clearable
          :placeholder="$t('platform.searchTip')"
          suffix-icon="search"
        />
        <el-button-group direction="horizontal" class="flex-none">
          <el-button :title="$t('add')" @click="handleAddNode(undefined)" type="primary">
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
        :show-checkbox="props.showCheckBox"
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
            <el-dropdown-item @click="handleAddNode(activeContextMenuData)">
              <el-icon><FolderAdd /></el-icon>
              {{ $t('add') }}
            </el-dropdown-item>
            <el-dropdown-item @click="handleEditNode(activeContextMenuData)">
              <el-icon><FolderOpened /></el-icon>
              {{ $t('table.edit') }}
            </el-dropdown-item>
            <el-dropdown-item @click="handleDeleteNode(activeContextMenuData)">
              <el-icon style="color: var(--el-color-danger)"><FolderDelete /></el-icon>
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

    <!-- 极简模式：内置多语言弹窗对话框 -->
    <el-dialog
      v-model="simpleDialogVisible"
      :title="simpleDialogTitle"
      width="480px"
      append-to-body
      destroy-on-close
    >
      <el-form label-position="top" class="pt-2">
        <el-form-item :label="$t('platform.beTree.nodeName')" required>
          <be-i18n-dynamic-input
            v-model="simpleFormValue"
            class="w-full"
            :placeholder="$t('platform.beTree.pleaseInputNodeName')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex-row justify-content-end">
          <el-button @click="simpleDialogVisible = false">{{ $t('cancel') }}</el-button>
          <el-button
            type="primary"
            :loading="simpleDialogSaving"
            @click="handleSimpleDialogConfirm"
          >
            {{ $t('ok') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, nextTick, onMounted, ref, watch } from 'vue';
import {
  ElMessage,
  ElMessageBox,
  type FilterNodeMethodFunction,
  type TreeInstance,
} from 'element-plus';
import { executeOpenApi } from '@/api/common/platform';
import { useI18n } from 'vue-i18n';
import { useSessionStore } from '@/stores/session.ts';
import { useModal } from '@/components/dialog/useModal.ts';
import BeI18nDynamicInput from '@/components/BeI18nDynamicInput.vue';

interface ExtraItem {
  label: string;
  name: string;
  icon: string;
  permission?: string;
}

const props = withDefaults(
  defineProps<{
    apiQuery: string;
    apiSave?: string;
    apiDelete?: string;

    /**
     * 实体模型类名（用于弹窗表单自动加载字段定义，如 "com.byteasy.platform.entity.Dept"）
     */
    className?: string;

    /**
     * 树形父级关联字段名（默认 'parentId' 或 'parentCode'）
     */
    parentKey?: string;

    /**
     * 自定义弹窗表单组件（若提供，默认增/改会弹该组件）
     */
    formComponent?: any;

    /**
     * 自定义行为拦截器 / 覆盖处理器（返回 false 或自行处理异步弹窗）
     */
    beforeAdd?: (parentNode?: any) => boolean | Promise<boolean>;
    beforeEdit?: (nodeData: any) => boolean | Promise<boolean>;
    beforeDelete?: (nodeData: any) => boolean | Promise<boolean>;

    showCheckBox?: boolean;
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
    className: undefined,
    parentKey: 'parentId',
    formComponent: undefined,
    showCheckBox: false,
    contextExtraItems: undefined,
    label: 'name',
    children: 'children',
    nodeKey: 'id',
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
  'saveSuccess',
  'deleteSuccess',
]);

const session = useSessionStore();
const { t } = useI18n();
const { open } = useModal();

const loading = ref(true);
const treeData = ref<any[]>([]);
const filterText = ref('');
const treeRef = ref<TreeInstance>();
const dropDownMenuRef = ref<any>(null);
const contextMenuPosition = ref({ top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
const contextMenuTriggerRef = ref({
  getBoundingClientRect: () => contextMenuPosition.value,
});

// 🔥 核心存储：右键选中的业务数据对象与其底层真实的 el-tree Node 实例对象
const activeContextMenuData = ref<any>(null);
const activeContextMenuNodeInstance = ref<any>(null);

// 极简多语言弹窗状态
const simpleDialogVisible = ref(false);
const simpleDialogTitle = ref('');
const simpleDialogSaving = ref(false);
const simpleFormValue = ref<any>('');
const currentOperationType = ref<'add' | 'edit'>('add');
const currentEditingTarget = ref<any>(null);

watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

// =========================================================================
// 1. 默认增、改、删核心动作与生命周期拦截
// =========================================================================

/**
 * 统一处理新增节点
 */
async function handleAddNode(parentNode?: any) {
  emit('addNodeClick', parentNode);

  if (props.beforeAdd) {
    const shouldContinue = await props.beforeAdd(parentNode);
    if (shouldContinue === false) return;
  }

  if (props.formComponent) {
    const initialFormModel: Record<string, any> = {};
    if (parentNode) {
      initialFormModel[props.parentKey] = parentNode[props.nodeKey] || parentNode.id;
    }
    open(
      props.formComponent,
      { formModel: initialFormModel, parentNode },
      {
        title: t('add'),
        onClose: (data) => {
          if (data === 'ok') {
            ElMessage.success(t('operationSuccess'));
            refreshNodeAndExpand(parentNode);
            emit('saveSuccess', parentNode);
          }
        },
      },
    );
  } else if (props.apiSave) {
    // 极简模式：打开 BeI18nDynamicInput 多语言录入框
    currentOperationType.value = 'add';
    currentEditingTarget.value = parentNode;
    simpleFormValue.value = '';
    simpleDialogTitle.value = t('add');
    simpleDialogVisible.value = true;
  }
}

/**
 * 统一处理编辑节点
 */
async function handleEditNode(nodeData: any) {
  if (!nodeData) return;

  emit('editNodeClick', nodeData);

  if (props.beforeEdit) {
    const shouldContinue = await props.beforeEdit(nodeData);
    if (shouldContinue === false) return;
  }

  if (props.formComponent) {
    open(
      props.formComponent,
      { formModel: JSON.parse(JSON.stringify(nodeData)), isEdit: true },
      {
        title: t('table.edit'),
        onClose: (data) => {
          if (data === 'ok') {
            ElMessage.success(t('operationSuccess'));
            refreshCurrentNode(nodeData);
            emit('saveSuccess', nodeData);
          }
        },
      },
    );
  } else if (props.apiSave) {
    // 极简模式：回显当前多语言值并打开
    currentOperationType.value = 'edit';
    currentEditingTarget.value = nodeData;
    simpleFormValue.value = nodeData[props.label];
    simpleDialogTitle.value = t('table.edit');
    simpleDialogVisible.value = true;
  }
}

/**
 * 极简多语言弹窗保存确认
 */
async function handleSimpleDialogConfirm() {
  if (!simpleFormValue.value) {
    ElMessage.warning(t('platform.beTree.nodeNameRequired'));
    return;
  }

  simpleDialogSaving.value = true;
  try {
    let payload: Record<string, any> = {};

    if (currentOperationType.value === 'add') {
      const parentNode = currentEditingTarget.value;
      payload = {
        [props.label]: simpleFormValue.value,
      };
      if (parentNode) {
        payload[props.parentKey] = parentNode[props.nodeKey] || parentNode.id;
      }
      if (props.className) {
        payload.className = props.className;
      }
      await executeOpenApi(props.apiSave!, {}, payload);
      ElMessage.success(t('operationSuccess'));
      refreshNodeAndExpand(parentNode);
      emit('saveSuccess', payload);
    } else {
      const nodeData = currentEditingTarget.value;
      payload = {
        ...nodeData,
        [props.label]: simpleFormValue.value,
      };
      await executeOpenApi(props.apiSave!, {}, payload);
      ElMessage.success(t('operationSuccess'));
      refreshCurrentNode(nodeData);
      emit('saveSuccess', payload);
    }

    simpleDialogVisible.value = false;
  } catch (error: any) {
    ElMessage.error(error?.message || '保存失败');
  } finally {
    simpleDialogSaving.value = false;
  }
}

/**
 * 统一处理删除节点
 */
async function handleDeleteNode(nodeData: any) {
  if (!nodeData) return;

  emit('deleteNodeClick', nodeData);

  if (props.beforeDelete) {
    const shouldContinue = await props.beforeDelete(nodeData);
    if (shouldContinue === false) return;
  }

  ElMessageBox.confirm(t('deleteWarn'), t('warning'), {
    confirmButtonText: t('ok'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  })
    .then(async () => {
      if (props.apiDelete) {
        const primaryKeyVal = nodeData[props.nodeKey] || nodeData.id;
        await executeOpenApi(
          props.apiDelete,
          { id: primaryKeyVal, [props.nodeKey]: primaryKeyVal },
          nodeData,
        );
        ElMessage.success(t('operationSuccess'));
      }
      removeNode(nodeData);
      emit('deleteSuccess', nodeData);
    })
    .catch(() => {});
}

// =========================================================================
// 2. 数据加载与树事件监听
// =========================================================================

function loadTreeData(): Promise<void> {
  loading.value = true;
  return executeOpenApi(props.apiQuery, {}, {})
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

async function loadChildren(node: any, resolve: (data: any[]) => void, reject: (err: any) => void) {
  try {
    const parentParam = node.level === 0 ? {} : node.data || {};
    const res: any = await executeOpenApi(props.apiQuery, parentParam, {});
    const result = res.data || [];

    resolve(result);

    if (node.level === 0) {
      loading.value = false;
    }

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

const handleContextmenuOpen = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  contextMenuPosition.value = DOMRect.fromRect({ x: clientX, y: clientY });
  event.preventDefault();
  dropDownMenuRef.value?.handleOpen();
};

/**
 * 右键监听：通过第 3 个参数直接拿到 el-tree 内部真正的 Node 实例
 */
function onContextMenuClick(event: MouseEvent, data: any, node: any) {
  if (!props.contextMenuEnable) return;
  activeContextMenuData.value = data;
  activeContextMenuNodeInstance.value = node; // 🔥 锁死当前底层 Node
  handleContextmenuOpen(event);
}

const filterNode: FilterNodeMethodFunction = (value: string, data: any) => {
  if (!value) return true;
  const labelKey = props.label || 'name';
  const val = data[labelKey];
  return typeof val === 'string' ? val.includes(value) : JSON.stringify(val).includes(value);
};

function onTreeNodeExtraClick(name: string) {
  emit('extraNodeClick', name, activeContextMenuData.value);
}

function onTreeNodeClick(data: any) {
  emit('nodeClick', data);
}

// =========================================================================
// 3. 针对懒加载与普通模式的高可靠 Node 定位与展开/刷新机制
// =========================================================================

/**
 * 全量刷新整棵树
 */
function refresh() {
  if (props.lazy) {
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

/**
 * 定位 el-tree Node 实例（多层级兜底保证 100% 命中）
 */
function findNode(target: any) {
  // 1. 如果本身就是 Node 实例
  if (target && target.childNodes !== undefined && target.level !== undefined) {
    return target;
  }

  // 2. 如果传入的业务数据对象与当前右键的数据是同一个，直接返回保存的 node 实例
  if (
    activeContextMenuNodeInstance.value &&
    activeContextMenuData.value &&
    target &&
    (target === activeContextMenuData.value ||
      target[props.nodeKey] === activeContextMenuData.value[props.nodeKey])
  ) {
    return activeContextMenuNodeInstance.value;
  }

  // 3. 按指定的 nodeKey 查找
  if (target) {
    const key = typeof target === 'object' ? target[props.nodeKey] : target;
    let n = treeRef.value?.getNode(key);
    if (n) return n;
    // 按原生对象查找
    n = treeRef.value?.getNode(target);
    if (n) return n;
  }

  // 4. 兜底返回右键时捕获的实例
  return activeContextMenuNodeInstance.value || null;
}

/**
 * 重新拉取某个父节点的子项并强制展开
 */
function reloadNodeChildren(parentNode: any) {
  if (!parentNode) {
    refresh();
    return;
  }

  if (props.lazy) {
    // 懒加载模式：清空子级缓存并重新走 loadChildren，保持展开状态
    parentNode.loaded = false;
    parentNode.loading = false;
    parentNode.childNodes = [];
    parentNode.expand();
  } else {
    loadTreeData();
  }
}

/**
 * 【新增子节点后调用】
 * 刷新当前选中的节点自身，并将其【自动展开】以显示新子节点
 * @param parentNodeData 父节点数据对象（为 undefined 时代表刷新一级根节点）
 */
function refreshNodeAndExpand(parentNodeData?: any) {
  if (!parentNodeData) {
    refresh();
    return;
  }
  const node = findNode(parentNodeData);
  if (node) {
    reloadNodeChildren(node);
  } else {
    refresh();
  }
}

/**
 * 【编辑当前节点后调用】
 * 刷新当前节点的【直属父节点】，重新拉取同级列表，保持其父级展开（绝不会整树收起）
 */
function refreshCurrentNode(nodeData: any) {
  const node = findNode(nodeData);

  if (node) {
    const parentNode = node.parent;
    // 如果不是最顶层的一级根节点，重载父节点子级
    if (parentNode && parentNode.level > 0) {
      reloadNodeChildren(parentNode);
    } else {
      // 顶层一级根节点被编辑时刷新根列表
      refresh();
    }
  } else {
    refresh();
  }
}

/**
 * 【删除当前节点后调用】
 * 从前端树上物理剔除当前节点；如果父级没有其他子节点了，父级自动变为叶子节点（去除小箭头）
 */
function removeNode(nodeData: any) {
  const node = findNode(nodeData);

  if (node) {
    const parentNode = node.parent;
    // 1. 从前端树中物理移除
    treeRef.value?.remove(node);

    // 2. 检查父节点是否已无子节点
    if (parentNode && parentNode.level > 0) {
      if (!parentNode.childNodes || parentNode.childNodes.length === 0) {
        parentNode.isLeaf = true;
        parentNode.loaded = true;
      }
    }
  } else {
    refreshCurrentNode(nodeData);
  }
}

onMounted(() => {
  if (!props.lazy) {
    loadTreeData();
  }
});

defineExpose({
  refresh,
  refreshNodeAndExpand, // 🔥 新增子节点后调用
  refreshCurrentNode, // 🔥 编辑节点后调用
  removeNode, // 🔥 删除节点后调用
  treeRef,
});
</script>
