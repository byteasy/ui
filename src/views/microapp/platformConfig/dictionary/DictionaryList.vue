<template>
  <el-splitter>
    <el-splitter-panel size="250" collapsible :max="600">
      <resource-category-group-tree @tree-node-click="onGroupClick"/>
    </el-splitter-panel>
    <el-splitter-panel>
      <tuna-table-v2
        ref="refTable"
        base-url="/platformSvr/sapi/dictionarys"
        context="platformSvr"
        class-name="com.tuna.platform.entity.Dictionary"
        class="pl-1"
        :form-component="DictionaryForm"
      >
        <template v-slot:form-query-buttons>
          <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
              $t('search')
            }}
          </el-button>
          <el-button type="primary" @click="onAdd" icon="Plus">{{ $t('add') }}</el-button>
        </template>
        <template v-slot:table-cell-code="codeScope">
          <el-link type="success" @click="onItemManageClick(codeScope.row)">{{ codeScope.row.code }}</el-link>
        </template>
      </tuna-table-v2>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import DictionaryForm from "@/views/microapp/platformConfig/dictionary/DictionaryForm.vue";
import ResourceCategoryGroupTree
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTree.vue";
import DictionaryItemList from "@/views/microapp/platformConfig/dictionary/DictionaryItemList.vue";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {useRoute} from "vue-router";
import {useModal} from "@/components/dialog/useModal.ts";

const {t, locale} = useI18n()

const {open} = useModal()
const route = useRoute()
const refTable = ref(null)

function onGroupClick(treeNode) {
  if (!(treeNode.children && treeNode.children.length > 0)) {
    refTable.value.queryParam.groupId = treeNode.id
    refTable.value?.refresh()
  }
}

function onAdd() {
  refTable.value?.onAdd({groupId: refTable.value.queryParam.groupId})
}

function onItemManageClick(row) {
  const [lastRoute] = route.matched.slice(-1)
  open(
    DictionaryItemList, // 要显示的组件
    {
      parent: row,
    }, // 传给组件的 props
    {
      title: t('table.edit') + getLangText(lastRoute !== undefined ? lastRoute.meta.title : '', locale.value),
      width: "60%",
      onClose: (data) => {
      },
    },
  )
}
</script>
