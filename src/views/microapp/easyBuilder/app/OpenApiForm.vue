<template>
  <be-form ref="refBeForm" api-save="saveOpenApi" class-name="com.byteasy.platform.entity.Openapi">
    <template v-slot:formItem_name="scope">
      <el-form-item label="类型">
        <el-select v-model="scope.row.type">
          <el-option label="查询" :value="1"/>
          <el-option label="新增/保存" :value="2"/>
          <el-option label="删除" :value="3"/>
          <el-option label="下载导入模板" :value="4"/>
          <el-option label="导入预览" :value="5"/>
          <el-option label="批量导入" :value="6"/>
          <el-option label="导出" :value="7"/>
          <el-option label="脚本接口" :value="8"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="getLangText(scope.column.displayName, locale)"
                    v-if="scope.column.isForm === 'YES'" :prop="scope.column.name" :rules="[
                    { required: scope.column.isRequire === 'YES', message: getLangText(scope.column.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(scope.column, rule, value, locale, callback), trigger: 'blur' }
                  ]">
        <be-form-field
          :column="scope.column"
          :placeholder="getLangText(scope.column.displayName, locale)"
          clearable
          :disabled="scope.props.readonly"
          v-model="scope.row[scope.column.name]"
          @clear="scope.row[scope.column.name] = null">
        </be-form-field>
      </el-form-item>
    </template>
  </be-form>
</template>
<script lang="ts" setup>
import {defineExpose, onMounted, ref} from "vue";
import {getLangText} from "@/locales/common.ts";
import BeFormField from "@/components/BeFormField.vue";
import {useI18n} from "vue-i18n";
import {validateColumnRule} from "@/util/validateUtils.ts";

const refBeForm = ref(null)
const {t, locale} = useI18n()

onMounted(() => {
  refBeForm.value.formValue.type = 1
})

function onButtonClick(btnName) {
  refBeForm.value?.onButtonClick(btnName)
}

defineExpose({onButtonClick})
</script>
