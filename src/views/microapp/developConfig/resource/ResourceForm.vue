<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_icon="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type === 'MENU' || scope.row.type === 'BUTTON'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_visible="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_openTab="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_affix="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_keepAlive="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_component="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_layout="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'DIRECTORY'"
        v-model="scope.row[scope.column.name]"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_routerUrl="scope">
      <tuna-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type === 'BUTTON'"
        style="min-width: 300px"
      />
    </template>
    <template v-slot:formItemField_groupId="scope">
      <div style="width: 300px">
        <resource-category-group-tree-select v-model="scope.row.groupId" @change="loadParentTree"/>
      </div>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <div style="width: 300px">
        <resource-tree-select v-model="scope.row.parentId" ref="refParentTree"/>
      </div>
    </template>
    <template v-slot:formExtra="scope">
      <el-form-item :label="$t('platform.resource.standardPermission')" v-if="scope.row.type === 'BUTTON'">
        <div style="width: 300px">
          <enum-select code="com.tuna.enums.YesNo" context="platformSvr" v-model="scope.row.standButton" @change="(va) => refForm.queryParam.standButton = va"/>
        </div>
      </el-form-item>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";
import ResourceTreeSelect from "@/views/microapp/developConfig/resource/ResourceTreeSelect.vue";
import {getLangText} from "@/locales/common.ts";
import TunaFormField from "@/components/TunaFormField.vue";
import {useI18n} from "vue-i18n";
const {t, locale} = useI18n()

const refParentTree = ref(null)
const refForm = ref(null)

onMounted(() => {
  loadParentTree()
})

function loadParentTree() {
  refParentTree.value.queryParams.groupId = refForm.value.formValue.groupId
  refParentTree.value.refresh()
}
</script>
