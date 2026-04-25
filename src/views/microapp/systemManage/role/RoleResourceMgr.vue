<template>
  <div class="w-full h-full flex-column">
    <el-scrollbar max-height="85vh" always class="w-full">
      <el-form
        ref="refForm"
        label-width="auto"
        label-position="top"
        class="w-full"
      >
        <el-form-item :label="$t('platform.resourceGroup.name')">
          <resource-category-group-tree-select v-model="selectedGroup" clearable
                                               @change="loadTreeData"/>
          <!--        <resource-group-select class="w-full" v-model="selectedGroup" clearable-->
          <!--                               @change="loadTreeData"-->
          <!--                               :firs-row-trigger="firstRowTrigger"></resource-group-select>-->
        </el-form-item>

        <el-form-item :label="$t('platform.searchTip')">
          <el-input
            v-model="filterText"
            class="w-60 mb-2"
            :placeholder="$t('platform.searchTip')"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('platform.resource.name')">
          <el-tree
            ref="treeRef"
            class="filter-tree w-full"
            :data="treeData"
            :props="{ label: 'name', children: 'childrenList'}"
            :default-expanded-keys="selectedKeys"
            show-checkbox
            default-expand-all
            highlight-current
            node-key="id"
            :filter-node-method="filterNode">
            <template #default="{ node, data }">
              <tuna-i18n-value :model-value="data.name" class="pl-1"/>
            </template>
          </el-tree>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <el-affix position="bottom" class="w-full">
      <div class="flex-row w-full justify-content-center pb-2">
        <el-button @click="setCheckedKeys" icon="Select">{{ t('platform.selectAll') }}</el-button>
        <el-button @click="resetChecked" icon="Failed">{{ t('platform.clearAll') }}</el-button>
        <el-button v-debounce="doSubmit" type="primary" icon="Check">{{
            t('save')
          }}
        </el-button>
        <el-button @click="emit('close')" icon="Close">{{ t('close') }}</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, ref, watch} from 'vue'
import {useI18n} from "vue-i18n";
import {ElMessage, type FilterNodeMethodFunction, type TreeInstance} from 'element-plus'
import {doHttpGet, doHttpPost} from "@/api/common/platform";
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";

const {t} = useI18n() // 表单引用
const emit = defineEmits(['close'])

interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<TreeInstance>()

const props = defineProps<{
  row?: any
}>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true
  return data.name?.toLowerCase().includes(value.toLowerCase()) || false
}

const setCheckedKeys = () => {
  if (!treeRef.value) return
  treeRef.value.setCheckedKeys(treeData.value.map(item => item.id), false)
}
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}

const treeData = ref([])
const selectedKeys = ref([])
const selectedGroup = ref(undefined)

const getAllLeafIds = (list) => {
  const leafIds = []
  const traverse = (items) => {
    items.forEach(item => {
      // 没有子节点 → 叶子
      if (!item.childrenList || item.childrenList.length === 0) {
        leafIds.push(item.id)
      } else {
        traverse(item.childrenList)
      }
    })
  }
  traverse(list)
  return leafIds
}

const loadTreeData = () => {
  if (selectedGroup.value) {
    doHttpGet('/platformSvr/sapi/roles/permissions', {
      groupId: selectedGroup.value,
      roleId: props.row.id
    }).then((res) => {
      treeData.value = res.data.leftMenuVOS
      selectedKeys.value = res.data.permissionIds

      // 拿到所有叶子ID
      const leafIds = getAllLeafIds(treeData.value)
      // 只保留后端返回的叶子节点（过滤掉父节点）
      const onlyLeafKeys = selectedKeys.value.filter(id => leafIds.includes(id))
      // 只设置叶子 → 父自动半选
      treeRef.value?.setCheckedKeys(onlyLeafKeys, false)
    })
  } else {
    treeData.value = []
    selectedKeys.value = []
  }
}

const doSubmit = () => {
  doHttpPost('/platformSvr/sapi/roles/permissions', {}, {
    groupId: selectedGroup.value,
    roleId: props.row.id,
    permissionIds: getAllCheckedKeys()
  }).then(() => {
    ElMessage.success(t('operationSuccess'))
  })
}

const getAllCheckedKeys = () => {
  // 1. 获取【真正选中】的节点
  const checkedKeys = treeRef.value!.getCheckedKeys(false)
  // 2. 获取【半选中】的父节点（因为子选中，父会半选）
  const halfCheckedKeys = treeRef.value!.getHalfCheckedKeys()

  // 3. 合并去重 → 就是你要的：所有选中节点 + 所有父节点
  return [...new Set([...halfCheckedKeys, ...checkedKeys])]
}

const firstRowTrigger = (row) => {
  selectedGroup.value = row.id
  loadTreeData()
}
</script>
