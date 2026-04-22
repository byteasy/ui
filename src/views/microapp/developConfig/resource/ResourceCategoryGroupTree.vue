<template>
  <div class="flex-column pr-2">
    <div class="flex-row align-items-center w-full">
      <el-input
        v-model="filterText"
        class=""
        clearable
        :placeholder="$t('platform.schemaDefine.serviceTreeSearchTip')"
        suffix-icon="search"
      />
<!--      <el-button type="primary" icon="plus" class="ml-1" @click="onTreeNodeAddClick('add')">-->
<!--        {{ $t('add') }}-->
<!--      </el-button>-->
    </div>

    <el-tree
      ref="treeRef"
      style="max-width: 600px"
      class="filter-tree w-full pt-1"
      :data="treeData"
      :props="{ label: 'name', children: 'children' }"
      @node-click="onNodeClick"
      @node-contextmenu="onContextMenuClick"
      highlight-current
      default-expand-all
      :check-strictly="false"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <template #default="{ node, data }">
        <div class="w-full flex-row align-items-center">
          <div class="flex-none flex-row align-items-center">
            <el-icon size="24">
              <IconLocalFolder/>
            </el-icon>
            <tuna-i18n-value :model-value="data.name" class="pl-1"/>
          </div>
        </div>
      </template>
    </el-tree>
    <el-dropdown ref="dropDownMenuRef" :trigger="['contextmenu']" :hide-on-click="true"
                 class="w-full"
                 placement="bottom" virtual-triggering :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
    }" :virtual-ref="triggerRef">
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
import {onMounted, ref, watch, defineExpose} from 'vue'
import {ElMessage, type FilterNodeMethodFunction, type TreeInstance} from 'element-plus'
import {ElMessageBox} from "element-plus"
import {doHttpDelete, doHttpGet} from "@/api/common/platform";
import {useI18n} from "vue-i18n"
import {useModal} from '@/components/dialog/useModal.ts'
import {useRoute} from "vue-router";

const {open} = useModal()
const {t} = useI18n()
const activeContextMenuNode = ref(undefined)
const route = useRoute()

interface Tree {
  [key: string]: any
}

const emit = defineEmits(['treeNodeClick'])

const dropDownMenuRef = ref(null)
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value,
})

const handleCloseContextMenu = () => {
  dropDownMenuRef.value?.handleClose()
}

const handleContextmenu = (event: MouseEvent) => {
  const {clientX, clientY} = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  })
  event.preventDefault()
  dropDownMenuRef.value?.handleOpen()
}

const filterText = ref('')
const treeRef = ref<TreeInstance>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const treeData = ref([])

onMounted(() => {
  loadTreeData()
})

function loadTreeData() {
  doHttpGet('/platformSvr/sapi/resourceCategorys/resourceGroupTree', {}).then(res => {
    treeData.value = res.data
  })
}

function onTreeNodeAddClick(action) {
}

function onTreeNodeEditClick() {
}

function onTreeNodeDeleteClick() {
}

function onNodeClick(data, props, treeNode, event) {
  emit('treeNodeClick', data)
}

function onContextMenuClick(event, data, node, treeNode) {
  // activeContextMenuNode.value = data
  // handleContextmenu(event)
}

function refresh() {
  loadTreeData()
}

defineExpose({
  refresh
})
</script>
