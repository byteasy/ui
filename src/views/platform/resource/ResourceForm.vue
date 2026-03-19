<template>
  <tuna-table-form>
    <template v-slot:formItemField_groupId="scope">
      <el-select
        v-model="scope.row.groupId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResourceGroups"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <el-select
        v-model="scope.row.parentId"
        filterable
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <el-option
          v-for="item in parentResources"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
    <template v-slot:formItemField_name="scope">
      <el-input
        v-model="scope.row.name"
        style="width: 300px"
        :placeholder="scope.column.displayName"
        :disabled="scope.props.readonly"
      >
        <template #append>
          <el-button circle icon="Baseball" @click="onI18nClick(scope.row)"></el-button>
        </template>
      </el-input>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doHttpGet } from '@/api/common/platform'
import { useModal } from '@/components/dialog/useModal.ts'
import I18nForm from '@/views/platform/i18n/I18nForm.vue'

const { open } = useModal()
const parentResourceGroups = ref([])
const parentResources = ref([])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceGroups', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder'],
  }).then((res) => {
    parentResourceGroups.value = res.data.records
  })

  doHttpGet('/platformSvr/sapi/resources', {
    current: 1,
    size: 10000,
    ascColumns: ['parentId', 'showOrder'],
  }).then((res) => {
    parentResources.value = res.data.records
  })
})

const onI18nClick = (row) => {
  open(
    I18nForm,
    {
      code: row.code
    },
    {
      title: '18n',
      width: '60%',
      dialogModel: true,
      onClose: (data) => {},
    },
  )
}
</script>
