<template>
  <be-form ref="refBeForm" class-name="com.byteasy.platform.entity.Openapi">
    <template v-slot:formItemField_type="scope">
      <be-form-field
        :column="scope.column"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly"
        v-model="scope.formModel[scope.column.name]"
        @clear="scope.formModel[scope.column.name] = null"
      />
    </template>
    <template v-slot:formItem_preScriptId="scope">
      <el-form-item :label="getLangText(scope.column.displayName, locale)"
                    :prop="scope.column.name" :rules="[
                    { required: scope.column.isRequire === 'YES', message: getLangText(scope.column.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(scope.column, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <api-script-field v-model="scope.formModel[scope.column.name]" :name="scope.formModel.name" :open-api="scope.formModel"/>
      </el-form-item>
    </template>
    <template v-slot:formItem_postScriptId="scope">
      <el-form-item :label="getLangText(scope.column.displayName, locale)"
                    :prop="scope.column.name" :rules="[
                    { required: scope.column.isRequire === 'YES', message: getLangText(scope.column.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(scope.column, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <api-script-field v-model="scope.formModel[scope.column.name]" :name="scope.formModel.name" :open-api="scope.formModel"/>
      </el-form-item>
    </template>
    <template v-slot:formItem_scriptId="scope">
      <el-form-item :label="getLangText(scope.column.displayName, locale)"
                    v-if="scope.formModel.type === 'script'"
                    :prop="scope.column.name" :rules="[
                    { required: scope.column.isRequire === 'YES', message: getLangText(scope.column.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(scope.column, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <api-script-field v-model="scope.formModel[scope.column.name]" :name="scope.formModel.name" :open-api="scope.formModel"/>
      </el-form-item>
      <div style="display: none;" v-else></div>
    </template>
  </be-form>
</template>
<script lang="ts" setup>
import {defineExpose, onMounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {getLangText} from "@/locales/common.ts";
import BeFormField from "@/components/BeFormField.vue";
import {doHttpGet} from "@/api/common/platform";
import {validateColumnRule} from "@/util/validateUtils.ts";
import ApiScriptField from "@/views/microapp/easyBuilder/app/ApiScriptField.vue";

const refBeForm = ref(null)
const {t, locale} = useI18n()
const contextPath = ref('')

onMounted(() => {
  onServiceChange()
  watch(() => refBeForm.value?.formModel.type, (newType) => {
    onTypeChange(newType)
  })
  watch(() => refBeForm.value?.formModel.serviceCode, (code) => {
    onServiceChange()
  })
})

function onButtonClick(btnName) {
  refBeForm.value?.onButtonClick(btnName)
}

function onServiceChange() {
  if (refBeForm.value.formModel.serviceCode) {
    doHttpGet('/platformSvr/sapi/common/com.byteasy.platform.entity.ServiceInstance', {
      code: refBeForm.value.formModel.serviceCode,
      codeQueryType: 'eq'
    }).then(response => {
      contextPath.value = response.data.records[0].contextPath
    })
  }
}


function onTypeChange(type) {
  if (type === 'page') {
    refBeForm.value.formModel.httpMethod = 'GET'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className
  } else if (type === 'list') {
    refBeForm.value.formModel.httpMethod = 'GET'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/all'
  } else if (type === 'getByPrimaryKey') {
    refBeForm.value.formModel.httpMethod = 'GET'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/{id}'
  } else if (type === 'saveOrUpdate') {
    refBeForm.value.formModel.httpMethod = 'POST'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className
  } else if (type === 'removeByEntity') {
    refBeForm.value.formModel.httpMethod = 'DELETE'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className
  } else if (type === 'batchDelete') {
    refBeForm.value.formModel.httpMethod = 'DELETE'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/batch'
  } else if (type === 'downloadImportTemplate') {
    refBeForm.value.formModel.httpMethod = 'GET'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/excel/template'
  } else if (type === 'importPreview') {
    refBeForm.value.formModel.httpMethod = 'POST'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/excel/importPreview'
  } else if (type === 'saveOrUpdateBatch') {
    refBeForm.value.formModel.httpMethod = 'POST'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/batch'
  } else if (type === 'exportExcel') {
    refBeForm.value.formModel.httpMethod = 'POST'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formModel.className + '/excel/export'
  } else if (type === 'script') {
    refBeForm.value.formModel.httpMethod = 'POST'
    refBeForm.value.formModel.uri = contextPath.value + '/sapi/script/api/' + refBeForm.value.formModel.code
  }
}

defineExpose({onButtonClick})
</script>
