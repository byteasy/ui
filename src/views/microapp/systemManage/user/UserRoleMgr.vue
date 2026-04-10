<template>
  <div class="w-full h-full flex-column">
    <el-form
      ref="refForm"
      label-width="auto"
      label-position="top"
      class="w-full"
    >
      <el-form-item :label="$t('role.name')">
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
      </el-form-item>
    </el-form>
    <el-affix position="bottom" class="w-full">
      <div class="flex-row w-full justify-content-center pb-2">
        <el-button @click="setCheckedKeys" icon="Select">{{ t('selectAll') }}</el-button>
        <el-button @click="resetChecked" icon="Failed">{{ t('clearAll') }}</el-button>
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
import {defineEmits, onMounted, ref, watch} from 'vue'
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
  doHttpGet('/platformSvr/sapi/users/roles', {
    userId: props.row.id
  }).then((res) => {
    treeData.value = res.data.roles
    selectedKeys.value = res.data.roleIds
    treeRef.value?.setCheckedKeys(selectedKeys.value, false)
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
</script>
