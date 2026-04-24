<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :max="600">
      <resource-category-group-tree @tree-node-click="onMicroAppClick"/>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table-v2
        class="pl-1"
        ref="refTable"
        base-url="/platformSvr/sapi/i18ns"
        context="platformSvr"
        class-name="com.tuna.platform.entity.I18n"
        :form-component="I18nForm"
        :query-params="{ ascColumns: ['code'] }"
      >
        <template v-slot:form-query-buttons>
          <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
              $t('search')
            }}
          </el-button>
          <el-button type="primary" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
        </template>
      </tuna-table-v2>
    </el-splitter-panel>
  </el-splitter>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import I18nForm from "@/views/microapp/developConfig/i18n/I18nForm.vue";
import ResourceCategoryGroupTree
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTree.vue";

const { t } = useI18n() // 表单引用

const refTable = ref(null)
const activeGroup = ref(undefined)

function onMicroAppClick(treeNode) {
  if(treeNode.children === null || treeNode.children === undefined) {
    activeGroup.value = treeNode
    refTable.value.queryParam.groupId = treeNode.id
    refTable.value.refresh()
  }
}

function onAdd() {
  refTable.value.onAdd({ groupId: activeGroup.value?.id })
}
</script>
