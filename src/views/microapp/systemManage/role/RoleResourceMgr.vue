<template>
  <div class="w-full flex-column">
    <el-form
      :inline="false"
      ref="refForm"
      label-width="200"
      label-position="top"
      class="w-full"
    >
      <el-form-item :label="$t('resourceGroup.name')">
        <resource-group-select class="w-full" v-model="selectedGroup" select-first clearable
                               @change="loadTreeData"></resource-group-select>
      </el-form-item>

      <el-form-item :label="$t('keyword')">
        <el-input
          v-model="filterText"
          class="w-60 mb-2"
          :placeholder="$t('keyword')"
          clearable
        />
      </el-form-item>

    <el-form-item :label="$t('resource.name')">
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
  </div>
  <div class="w-full flex-column mt-2">
    <el-affix position="bottom" class="w-full">
      <div class="flex-row w-full justify-content-center pb-2">
        <el-button @click="setCheckedKeys" icon="Select">{{ t('selectAll') }}</el-button>
        <el-button @click="resetChecked" icon="Failed">{{ t('clearAll') }}</el-button>
        <el-button @click="saveRolePermission" type="primary" icon="Check">{{ t('save') }}</el-button>
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
import ResourceGroupSelect from "@/views/microapp/developConfig/resource/ResourceGroupSelect.vue";

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

const loadTreeData = () => {
  if (selectedGroup.value) {
    doHttpGet('/platformSvr/sapi/roles/permissions', {
      groupId: selectedGroup.value,
      roleId: props.row.id
    }).then((res) => {
      treeData.value = res.data.leftMenuVOS
      selectedKeys.value = res.data.permissionIds
      treeRef.value?.setCheckedKeys(selectedKeys.value, false)
    })
  } else {
    treeData.value = []
    selectedKeys.value = []
  }
}

const saveRolePermission = () => {
  doHttpPost('/platformSvr/sapi/roles/permissions', {}, {
    roleId: props.row.id,
    permissionIds: treeRef.value!.getCheckedKeys(false)
  }).then(() => {
    ElMessage.success(t('operationSuccess'))
  })
}
</script>
