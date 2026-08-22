<template>
  <be-form ref="refBeForm" class-name="com.byteasy.platform.entity.Openapi">
    <template v-slot:formItemField_type="scope">
      <be-form-field
        :column="scope.column"
        :placeholder="getLangText(scope.column.displayName, locale)"
        clearable
        :disabled="scope.props.readonly"
        v-model="scope.row[scope.column.name]"
        @clear="scope.row[scope.column.name] = null"
      />
    </template>
    <template v-slot:formItem_scriptId="scope">
      <el-form-item :label="getLangText(scope.column.displayName, locale)"
                    v-if="scope.row.type === 'script'"
                    :prop="scope.column.name" :rules="[
                    { required: scope.column.isRequire === 'YES', message: getLangText(scope.column.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(scope.column, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <api-script-field v-model="scope.row[scope.column.name]" :name="scope.row.name" :open-api="scope.row"/>
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
  watch(() => refBeForm.value?.formValue.type, (newType) => {
    onTypeChange(newType)
  })
  watch(() => refBeForm.value?.formValue.serviceCode, (code) => {
    onServiceChange()
  })
})

function onButtonClick(btnName) {
  refBeForm.value?.onButtonClick(btnName)
}

function onServiceChange() {
  if (refBeForm.value.formValue.serviceCode) {
    doHttpGet('/platformSvr/sapi/common/com.byteasy.platform.entity.ServiceInstance', {
      code: refBeForm.value.formValue.serviceCode,
      codeQueryType: 'eq'
    }).then(response => {
      contextPath.value = response.data.records[0].contextPath
    })
  }
}


function onTypeChange(type) {
  if (type === 'query') {
    refBeForm.value.formValue.httpMethod = 'GET'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className
  } else if (type === 'list') {
    refBeForm.value.formValue.httpMethod = 'GET'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/all'
  } else if (type === 'getById') {
    refBeForm.value.formValue.httpMethod = 'GET'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/{id}'
  } else if (type === 'saveOrUpdate') {
    refBeForm.value.formValue.httpMethod = 'POST'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className
  } else if (type === 'delete') {
    refBeForm.value.formValue.httpMethod = 'DELETE'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className
  } else if (type === 'downloadImportTemplate') {
    refBeForm.value.formValue.httpMethod = 'GET'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/excel/template'
  } else if (type === 'importPreview') {
    refBeForm.value.formValue.httpMethod = 'POST'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/excel/importPreview'
  } else if (type === 'batchImport') {
    refBeForm.value.formValue.httpMethod = 'POST'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/batch'
  } else if (type === 'export') {
    refBeForm.value.formValue.httpMethod = 'POST'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/common/' + refBeForm.value.formValue.className + '/excel/export'
  } else if (type === 'script') {
    refBeForm.value.formValue.httpMethod = 'POST'
    refBeForm.value.formValue.uri = contextPath.value + '/sapi/script/api/' + refBeForm.value.formValue.code
  }
}

defineExpose({onButtonClick})
</script>
