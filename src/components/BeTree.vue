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
      <el-button type="primary" icon="plus" class="ml-1" v-debounce="onAddTreeRootNodeClick">
        {{ $t('add') }}
      </el-button>
    </div>

    <el-tree ref="treeRef"
             class="filter-tree w-full pt-1"
             :data="treeData"
             :lazy="props.lazy"
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
          <el-dropdown-item @click="onTreeNodeAddClick('rootAdd')">
            <el-icon>
              <FolderAdd/>
            </el-icon>
            {{ $t('add') }}
          </el-dropdown-item>
          <el-dropdown-item @click="onTreeNodeEditClick">
            <el-icon>
              <FolderOpened/>
            </el-icon>
            {{ $t('table.edit') }}
          </el-dropdown-item>
          <el-dropdown-item @click="onTreeNodeDeleteClick">
            <el-icon>
              <FolderDelete/>
            </el-icon>
            {{ $t('table.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {defineExpose, onMounted, ref, watch} from 'vue'
import {
  ElMessage,
  ElMessageBox,
  type FilterNodeMethodFunction,
  type TreeInstance
} from 'element-plus'
import ResourceCategoryForm from "@/views/microapp/developConfig/resource/ResourceCategoryForm.vue";
import {executeOpenApi} from "@/api/common/platform";
import {useI18n} from "vue-i18n"
import {useModal} from '@/components/dialog/useModal.ts'
import {useRoute} from "vue-router";
import {getLangText} from "@/locales/common.ts";

interface Tree {
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    queryApiCode: string
    addApiCode: string
    updateApiCode: string
    deleteApiCode: string
    formComponent?: string
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
    addApiCode: undefined,
    updateApiCode: undefined,
    deleteApiCode: undefined,
    formComponent: '',
    label: 'name',
    children: 'children',
    nodeKey: 'id',
    lazy: false,
    defaultExpandAll: true,
    highlightCurrent: true,
    checkStrictly: false,
    expandOnClickNode: false,
  }
)

const emit = defineEmits(['treeNodeClick', 'addNodeClick', 'editNodeClick'])

const {open} = useModal()
const route = useRoute()
const {t, locale} = useI18n()
const activeContextMenuNode = ref(undefined)
const treeData = ref([])
const filterText = ref('')
const queryParams = ref({})
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

onMounted(() => {
  loadTreeData()
})

function loadTreeData() {
  executeOpenApi(props.queryApiCode, queryParams, {}).then(res => {
    treeData.value = res.data
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
  console.log('onAddTreeRootNodeClick')
}

function onTreeNodeAddClick(action) {
  const [lastRoute] = route.matched.slice(-1)
  const obj = {}
  if (action !== 'add') {
    obj.parentId = activeContextMenuNode.value?.id
  }
  open(
    ResourceCategoryForm,
    {
      url: '/platformSvr/sapi/resourceCategorys',
      context: 'platformSvr',
      className: 'com.byteasy.platform.entity.ResourceCategory',
      row: obj
    },
    {
      title: t('add') + getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value),
      width: '50%',
      onClose: (data) => {
        refresh()
      },
    },
  )
}

function onTreeNodeEditClick() {
  const [lastRoute] = route.matched.slice(-1)
  open(
    ResourceCategoryForm,
    {
      url: '/platformSvr/sapi/resourceCategorys',
      context: 'platformSvr',
      className: 'com.byteasy.platform.entity.ResourceCategory',
      row: activeContextMenuNode.value
    }, // 传给组件的 props
    {
      title: t('table.edit') + getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value),
      width: '50%',
      onClose: (data) => {
        refresh()
      },
    },
  )
}

function onTreeNodeDeleteClick() {
  ElMessageBox.confirm(t('deleteWarn'), t('warning'),
    {
      confirmButtonText: t('ok'),
      cancelButtonText: t('cancel'),
      type: 'warning'
    })
    .then(() => {
      executeOpenApi(props.deleteApiCode, activeContextMenuNode.value, {}).then(() => {
        refresh()
        ElMessage.success(t('operationSuccess'))
      })
    })
}

function onTreeNodeClick(data, props, treeNode, event) {
  emit('treeNodeClick', data)
}

function refresh() {
  loadTreeData()
}

defineExpose({
  refresh
})
</script>
