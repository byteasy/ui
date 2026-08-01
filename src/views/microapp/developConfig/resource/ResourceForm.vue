<template>
  <be-table-form ref="refForm">
    <template v-slot:formItemField_icon="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type === 'MENU' || scope.row.type === 'BUTTON'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_visible="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_openTab="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_affix="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_keepAlive="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_component="scope">
      <div class="flex-column w-full">
        <be-form-field
          :column="scope.column"
          :context="scope.props.context"
          :placeholder="getLangText(scope.column.displayName, locale)"
          clearable
          :disabled="scope.props.readonly || scope.row.type !== 'MENU'"
          v-model="scope.row[scope.column.name]"
        />
        <el-link v-if="scope.row.type === 'MENU'" type="primary" underline="never"
                 style="font-size: var(--el-font-size-extra-small)" @click="initStandComponent">
          {{ $t('platform.resource.standardTableComponent') }}
        </el-link>
        <el-link v-if="scope.row.type === 'MENU'" type="primary" underline="never"
                 style="font-size: var(--el-font-size-extra-small)" @click="initStandComponentNew">
          {{ $t('platform.resource.standardTableComponent') + 'New' }}
        </el-link>
      </div>
    </template>
    <template v-slot:formItemField_layout="scope">
      <be-form-field
        :column="scope.column"
        :context="scope.props.context"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly || scope.row.type !== 'DIRECTORY'"
        v-model="scope.row[scope.column.name]"
      />
    </template>
    <template v-slot:formItemField_routerUrl="scope">
      <div class="flex-column w-full gap-1-2">
        <be-form-field
          v-model="scope.row.routerUrl"
          :column="scope.column"
          :context="scope.props.context"
          :placeholder="getLangText(scope.column.displayName, locale)"
          clearable
          :disabled="scope.props.readonly || scope.row.type === 'BUTTON'"
        />
        <el-form-item :label="$t('platform.resource.queryParams')" >
          <be-key-value-input v-model="tableMetaData" @change="onTableMetaDataChange" v-if="scope.row.type === 'MENU'"/>
        </el-form-item>
      </div>
    </template>
    <template v-slot:formItemField_groupId="scope">
      <resource-category-group-tree-select v-model="scope.row.groupId" @change="loadParentTree"
                                           :disabled="scope.props.readonly"/>
    </template>
    <template v-slot:formItemField_parentId="scope">
      <resource-tree-select v-model="scope.row.parentId" ref="refParentTree"
                            :disabled="scope.props.readonly"/>
    </template>
    <template v-slot:formExtra="scope">
      <el-form-item :label="$t('platform.resource.standardPermission')"
                    v-if="scope.row.type === 'BUTTON'">
        <be-enum-select code="com.byteasy.enums.YesNo" context="platformSvr"
                     v-model="scope.row.standButton"
                     @change="(va) => refForm.queryParam.standButton = va"/>
      </el-form-item>
    </template>
  </be-table-form>
</template>
<script setup lang="ts">
import {defineExpose, onMounted, ref} from 'vue'
import ResourceCategoryGroupTreeSelect
  from "@/views/microapp/developConfig/resource/ResourceCategoryGroupTreeSelect.vue";
import ResourceTreeSelect from "@/views/microapp/developConfig/resource/ResourceTreeSelect.vue";
import {getLangText} from "@/locales/common.ts";
import BeFormField from "@/components/BeFormField.vue";
import {jsonToQueryString} from "@/util/common.ts";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

const refParentTree = ref(null)
const refForm = ref(null)
const tableMetaData = ref({})

onMounted(() => {
  loadParentTree()
  const routerUrl = refForm.value.formValue.routerUrl
  if (routerUrl !== undefined && routerUrl !== null) {
    if (routerUrl.indexOf('?') >= 0) {
      const queryString = routerUrl.split('?')[1]
      const params = new URLSearchParams(queryString)
      for (const [key, value] of params) {
        tableMetaData.value[key] = value;
      }
    }
  }
})

function initStandComponentNew() {
  tableMetaData.value.queryParams = "{\"id\":\"1\"}"
  refForm.value.formValue.component = '/views/template/BeStandPageLayout.vue'
}

function initStandComponent() {
  tableMetaData.value.className = ''
  tableMetaData.value.titleColumnName = ''
  tableMetaData.value.excelEnable = 'YES'
  tableMetaData.value.queryParams = "{\"descColumns\":[\"updatedTime\", \"createdTime\"]}"
  refForm.value.formValue.component = '/views/template/BeObjectList.vue'
}

function loadParentTree() {
  refParentTree.value.queryParams.groupId = refForm.value.formValue.groupId
  refParentTree.value.refresh()
}

function onTableMetaDataChange() {
  const obj = {}
  for (const key in tableMetaData.value) {
    const value = tableMetaData.value[key]
    if (value !== '' && value.length > 0) {
      obj[key] = value
    }
  }
  const param = jsonToQueryString(obj);
  if (refForm.value.formValue.routerUrl !== undefined && refForm.value.formValue.routerUrl !== null) {
    const index = refForm.value.formValue.routerUrl.indexOf('?')
    if (index >= 0) {
      refForm.value.formValue.routerUrl = refForm.value.formValue.routerUrl.split('?')[0] + '?' + param
    } else {
      refForm.value.formValue.routerUrl = refForm.value.formValue.routerUrl + '?' + param
    }
  } else {
    refForm.value.formValue.routerUrl = '?' + param
  }
}

function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

defineExpose({
  onButtonClick
})
</script>
