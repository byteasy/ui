<template>
  <el-tree-select :data="parentTreeData" class="w-full"
                  :props="{ label: 'name', children: 'childrenList'}"
                  node-key="id" value-key="id" :filter-node-method="filterNodeMethod"
                  filterable check-strictly>
    <template #default="{ data: { name, icon } }">
      <div class="w-full flex flex-row items-center">
        <div class="flex flex-row items-center">
          <tuna-svg-icon :svg="icon" v-if="icon"/>
          <span class="pl-1">{{ name }}</span>
        </div>
      </div>
    </template>
  </el-tree-select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { langMap } from "@/locales/common.ts"
import { doHttpGet } from "@/api/common/platform"
import {computed, defineExpose, onMounted, ref} from "vue"

// 1. 定义树节点类型（替代 any）
interface TreeNode {
  id: number | string
  name: string
  children?: TreeNode[]
  [key: string]: any
}
const parentTreeData = ref<TreeNode[]>([])
const queryParams = ref({})

const { locale } = useI18n()
const currentLang = computed(() => langMap[locale.value] || locale.value)

onMounted(() => {
  doLoadTreeData()
})

// 2. 递归处理所有层级的 name
function processTreeNode(node: TreeNode) {
  // 处理当前节点
  try {
    const nameObj = JSON.parse(node.name || '{}')
    node.name = nameObj[currentLang.value] || ''
  } catch {
    node.name = ''
  }

  // 递归处理子节点
  if (node.childrenList && node.childrenList.length > 0) {
    node.childrenList.forEach(child => processTreeNode(child))
  }
}

// 3. 加载数据 + 递归处理整棵树
function doLoadTreeData() {
  doHttpGet('/platformSvr/sapi/resources', queryParams.value).then(res => {
    const list: TreeNode[] = res.data.records
    list.forEach(item => processTreeNode(item)) // 递归处理每个根节点
    parentTreeData.value = list
  })
}

// 过滤方法
const filterNodeMethod = (value: string, data: TreeNode) => {
  return data.name.includes(value)
}

function refresh() {
  console.log('refresh')
  doLoadTreeData()
}

defineExpose({
  queryParams,
  refresh
})
</script>
