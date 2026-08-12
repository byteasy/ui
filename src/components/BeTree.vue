<template>
  <div class="flex-column pr-2">
    <div class="flex-row align-items-center w-full">
      <el-input
        v-model="filterText"
        class=""
        clearable
        :placeholder="$t('platform.searchTip')"
        suffix-icon="search"
      />
      <el-button type="primary" icon="plus" class="ml-1" v-debounce="onAddTreeRootNodeClick"
                 v-if="props.permissionAddCode === undefined || session.authorize(props.permissionAddCode)">
        {{ $t('add') }}
      </el-button>
    </div>

    <el-tree ref="treeRef"
             class="filter-tree w-full pt-1"
             :data="treeData"
             :lazy="props.lazy"
             :load="loadChildren"
             :node-key="props.nodeKey"
             :props="{ label: props.label, children: props.children }"
             @node-click="onTreeNodeClick"
             @node-contextmenu="onContextMenuClick"
             :highlight-current="props.highlightCurrent"
             :default-expand-all="props.defaultExpandAll"
             :check-strictly="props.checkStrictly"
             :expand-on-click-node="props.expandOnClickNode"
             :filter-node-method="filterNode">
      <template #default="{ node, data }">
        <div class="w-full flex-row align-items-center">
          <div class="flex-none flex-row align-items-center">
            <be-svg-icon :svg="data.icon" v-if="data.icon"/>
            <be-i18n-value :model-value="data[props.label]" class="pl-1"/>
          </div>
        </div>
      </template>
    </el-tree>
    <el-dropdown ref="dropDownMenuRef" :trigger="['contextmenu']" :hide-on-click="true"
                 class="w-full" placement="bottom" virtual-triggering :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }] }"
                 :virtual-ref="contextMenuTriggerRef">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="onTreeNodeAddClick"
                            v-if="props.permissionAddCode === undefined || session.authorize(props.permissionAddCode)">
            <el-icon>
              <FolderAdd/>
            </el-icon>
            {{ $t('add') }}
          </el-dropdown-item>
          <el-dropdown-item @click="onTreeNodeEditClick"
                            v-if="props.permissionEditCode === undefined || session.authorize(props.permissionEditCode)">
            <el-icon>
              <FolderOpened/>
            </el-icon>
            {{ $t('table.edit') }}
          </el-dropdown-item>
          <el-dropdown-item @click="onTreeNodeDeleteClick"
                            v-if="props.permissionDeleteCode === undefined || session.authorize(props.permissionDeleteCode)">
            <el-icon>
              <FolderDelete/>
            </el-icon>
            {{ $t('table.delete') }}
          </el-dropdown-item>
          <template v-for="extra in props.contextExtraItems" :key="extra.name">
            <el-dropdown-item @click="onTreeNodeExtraClick(extra.name)"
                              v-if="extra.permission === undefined || session.authorize(extra.permission)">
              <be-svg-icon :svg="extra.icon" v-if="extra.icon"/>
              {{ $t(extra.label) }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {defineExpose, onMounted, ref, watch} from 'vue'
import {ElMessageBox, type FilterNodeMethodFunction, type TreeInstance} from 'element-plus'
import {executeOpenApi} from "@/api/common/platform";
import {useI18n} from "vue-i18n"
import {useSessionStore} from "@/stores/session.ts";

interface Tree {
  [key: string]: any
}

interface ExtraItem {
  label: string
  name: string
  icon: string
  permission?: string
}

const props = withDefaults(
  defineProps<{
    queryApiCode: string
    permissionAddCode?: string
    permissionEditCode?: string
    permissionDeleteCode?: string
    contextExtraItems?: Array<ExtraItem>
    label?: string
    children?: string
    nodeKey?: string
    lazy?: boolean
    defaultExpandAll?: boolean
    highlightCurrent?: boolean
    checkStrictly?: boolean
    expandOnClickNode?: boolean
  }>(),
  {
    queryApiCode: undefined,
    permissionAddCode: undefined,
    permissionEditCode: undefined,
    permissionDeleteCode: undefined,
    contextExtraItems: undefined,
    label: 'name',
    children: 'children',
    nodeKey: 'code',
    lazy: false,
    defaultExpandAll: false,
    highlightCurrent: true,
    checkStrictly: false,
    expandOnClickNode: false,
  }
)

const emit = defineEmits(['nodeClick', 'addNodeClick', 'editNodeClick', 'deleteNodeClick', 'extraNodeClick'])
const session = useSessionStore()

const {t, locale} = useI18n()
const activeContextMenuNode = ref(undefined)
const treeData = ref([])
const filterText = ref('')
const treeRef = ref<TreeInstance>()
const dropDownMenuRef = ref(null)
const contextMenuPosition = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)
const contextMenuTriggerRef = ref({
  getBoundingClientRect: () => contextMenuPosition.value,
})

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

function loadTreeData() {
  executeOpenApi(props.queryApiCode, {}, {}).then(res => {
    treeData.value = res.data
  })
}

function loadChildren(node, resolve, reject) {
  executeOpenApi(props.queryApiCode, node.data, {}).then(res => {
    resolve(res.data || [])
  }).catch(err => {
    reject(err)
  })
}

const handleCloseContextMenu = () => {
  dropDownMenuRef.value?.handleClose()
}

const handleContextmenuOpen = (event: MouseEvent) => {
  const {clientX, clientY} = event
  contextMenuPosition.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropDownMenuRef.value?.handleOpen()
}

function onContextMenuClick(event, data, node, treeNode) {
  activeContextMenuNode.value = data
  handleContextmenuOpen(event)
}

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

function onAddTreeRootNodeClick() {
  emit('addNodeClick', undefined)
  // 修改的根部节点，直接刷新整棵树
  refresh()
}

function onTreeNodeAddClick() {
  emit('addNodeClick', activeContextMenuNode.value)
  executeOpenApi(props.queryApiCode, activeContextMenuNode.value, {}).then(res => {
    activeContextMenuNode.value.children = res.data
  }).catch(err => {
  })
}

function onTreeNodeEditClick() {
  emit('editNodeClick', activeContextMenuNode.value)
  refreshCurrentNode(activeContextMenuNode.value)
}

function onTreeNodeExtraClick(name) {
  emit('extraNodeClick', name, activeContextMenuNode.value)
  refreshCurrentNode(activeContextMenuNode.value)
}

function onTreeNodeDeleteClick() {
  ElMessageBox.confirm(t('deleteWarn'), t('warning'),
    {
      confirmButtonText: t('ok'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    })
    .then(() => {
      emit('deleteNodeClick', activeContextMenuNode.value)
      refreshCurrentNode(activeContextMenuNode.value)
    })
}

function getParentData(currentData) {
  // 通过 treeRef 和当前数据获取内部 Node 对象
  const currentNode = treeRef.value?.getNode(currentData)

  // 获取父节点数据 (注意：根节点的 parent.data 是一个内部生成的数组，不是你业务数据的父节点)
  // 所以需要判断 parent 的 level
  let parentData = undefined
  if (currentNode && currentNode.parent && currentNode.parent.level > 0) {
    parentData = currentNode.parent.data
  }
  return parentData
}

function onTreeNodeClick(data, props, treeNode, event) {
  emit('nodeClick', data)
}

function refresh() {
  loadTreeData()
}

onMounted(() => {
  if(!props.lazy) {
    refresh()
  }
})

function refreshCurrentNode(nodeData) {
  const parent = getParentData(nodeData)
  if (parent !== undefined) {
    executeOpenApi(props.queryApiCode, parent, {}).then(res => {
      // 获取父节点的唯一 Key（你配置了 props.nodeKey 默认为 'code'）
      const parentKey = parent[props.nodeKey]

      // 使用 el-tree 内置 API 覆盖更新子节点
      // 这会自动处理内部 Node 状态，销毁旧节点，渲染新节点，不会出现重复
      treeRef.value!.updateKeyChildren(parentKey, res.data || [])

      // 注意：无需再手动修改 parent.children，updateKeyChildren 会在底层帮你同步数据
    }).catch(err => {
      console.error(err)
    })
  } else {
    // 如果 parent 是 undefined，说明编辑的是根节点
    // 此时直接刷新整棵树即可
    refresh()
  }
}

defineExpose({
  refresh
})
</script>
