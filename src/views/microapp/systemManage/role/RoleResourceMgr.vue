<template>
  <div class="w-full flex-column">
    <el-input
      v-model="filterText"
      class="w-60 mb-2"
      :placeholder="$t('keyword')"
      clearable
    />

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
      :filter-node-method="filterNode"
    />
  </div>
  <div class="w-full flex-column mt-2">
    <el-affix position="bottom" class="w-full">
      <div class="flex-row w-full justify-content-center pb-2">
        <el-button @click="setCheckedKeys" icon="Select">{{ t('selectAll') }}</el-button>
        <el-button @click="resetChecked" icon="Failed">{{ t('clearAll') }}</el-button>
        <el-button type="primary" icon="Check">{{
            t('save')
          }}
        </el-button>
        <el-button @click="emit('close')" icon="Close">{{ t('close') }}</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, ref, watch, onMounted} from 'vue'
import {useI18n} from "vue-i18n";
import type {FilterNodeMethodFunction, TreeInstance} from 'element-plus'
import {doHttpGet} from "@/api/common/platform";

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

const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
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

onMounted(() => {
  doHttpGet('/platformSvr/sapi/roles/permissions', { groupId: 1, roleId: props.row.id }).then((res) => {
    treeData.value = res.data.leftMenuVOS
    selectedKeys.value = res.data.permissionIds
  })
})
</script>
