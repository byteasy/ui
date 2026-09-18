<template>
  <div class="w-full h-full flex-column">
    <el-form
      ref="refForm"
      label-width="auto"
      label-position="top"
      class="w-full"
    >
      <el-form-item :label="$t('platform.role.name')">
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
        >
          <template #default="{ node, data }">
            <be-i18n-value :model-value="data.name" class="pl-1"/>
          </template>
        </el-tree>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineExpose, onMounted, ref, watch} from 'vue'
import {useI18n} from "vue-i18n";
import {ElMessage, type FilterNodeMethodFunction, type TreeInstance} from 'element-plus'
import {doHttpGet, doHttpPost} from "@/api/common/platform";

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

onMounted(() => {
  loadTreeData()
})

const loadTreeData = () => {
  doHttpGet('/platformSvr/sapi/roles/list/match', { ascColumns: [ 'code' ] }).then((res) => {
    treeData.value = res.data
    doHttpGet('/platformSvr/sapi/users/roles', { id: props.row.id }).then((res) => {
      selectedKeys.value = res.data.roleIds
      treeRef.value?.setCheckedKeys(selectedKeys.value, true)
    })
  })
}

const doSubmit = () => {
  doHttpPost('/platformSvr/sapi/users/roles', {}, {
    userId: props.row.id,
    roleIds: treeRef.value!.getCheckedKeys(false)
  }).then(() => {
    ElMessage.success(t('operationSuccess'))
    emit('close')
  })
}

function onButtonClick(btnName) {
  if(btnName === 'selectAll') {
    setCheckedKeys()
  } else if (btnName === 'clearAll') {
    resetChecked()
  } else if (btnName === 'ok') {
    doSubmit()
  } else if (btnName === 'cancel') {
    emit('close')
  }
}

defineExpose({
  onButtonClick
})
</script>
