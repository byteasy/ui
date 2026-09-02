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
            <el-dropdown-item @click="handleAddNode(activeContextMenuNode)">
              <el-icon><FolderAdd /></el-icon>
              {{ $t('add') }}
            </el-dropdown-item>
            <el-dropdown-item @click="handleEditNode(activeContextMenuNode)">
              <el-icon><FolderOpened /></el-icon>
              {{ $t('table.edit') }}
            </el-dropdown-item>
            <el-dropdown-item @click="handleDeleteNode(activeContextMenuNode)">
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
import { computed, defineEmits, defineExpose, nextTick, onMounted, ref, watch } from 'vue';
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
const activeContextMenuNode = ref<any>(undefined);
const treeData = ref<any[]>([]);
const filterText = ref('');
const treeRef = ref<TreeInstance>();
const dropDownMenuRef = ref<any>(null);
const contextMenuPosition = ref({ top: 0, left: 0, bottom: 0, right: 0 } as DOMRect);
const contextMenuTriggerRef = ref({
  getBoundingClientRect: () => contextMenuPosition.value,
});

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
            refreshCurrentNode(parentNode);
            emit('saveSuccess', parentNode);
          }
        },
      },
    );
  } else if (props.apiSave) {
    // 🔥 极简模式：打开 BeI18nDynamicInput 多语言录入框
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
    // 🔥 极简模式：回显当前多语言值并打开
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
      refreshCurrentNode(parentNode);
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
      refreshCurrentNode(nodeData);
      emit('deleteSuccess', nodeData);
    })
    .catch(() => {});
}

// =========================================================================
// 2. 数据加载与局部/全量刷新
// =========================================================================
/**
 * {
 *             "code": "EasyBuilder",
 *             "icon": "Notebook",
 *             "name": "{\"zh_CN\":\"低代码平台\"}",
 *             "id": 11.0,
 *             "type": "ResourceGroup",
 *             "parentId": "3"
 * }
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

function onContextMenuClick(event: MouseEvent, data: any) {
  if (!props.contextMenuEnable) return;
  activeContextMenuNode.value = data;
  handleContextmenuOpen(event);
}

const filterNode: FilterNodeMethodFunction = (value: string, data: any) => {
  if (!value) return true;
  const labelKey = props.label || 'name';
  const val = data[labelKey];
  return typeof val === 'string' ? val.includes(value) : JSON.stringify(val).includes(value);
};

function onTreeNodeExtraClick(name: string) {
  emit('extraNodeClick', name, activeContextMenuNode.value);
}

function getParentData(currentData: any) {
  const currentNode = treeRef.value?.getNode(currentData);
  if (currentNode && currentNode.parent && currentNode.parent.level > 0) {
    return currentNode.parent.data;
  }
  return undefined;
}

function onTreeNodeClick(data: any) {
  emit('nodeClick', data);
}

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

function refreshCurrentNode(nodeData: any) {
  if (!nodeData) {
    refresh();
    return;
  }
  const parent = getParentData(nodeData);
  if (parent !== undefined && props.lazy) {
    executeOpenApi(props.apiQuery, parent, {})
      .then((res: any) => {
        const parentKey = parent[props.nodeKey];
        treeRef.value?.updateKeyChildren(parentKey, res.data || []);
      })
      .catch((err) => console.error(err));
  } else {
    refresh();
  }
}

onMounted(() => {
  if (!props.lazy) {
    loadTreeData();
  }
});

defineExpose({
  refresh,
  refreshCurrentNode,
  treeRef,
});
</script>
