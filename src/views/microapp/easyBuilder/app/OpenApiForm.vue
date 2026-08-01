<template>
  <be-form ref="refBeForm" api-save="saveOpenApi" class-name="com.byteasy.platform.entity.Openapi">
    <template v-slot:formItemExtra="scope">
      <el-form-item label="标准接口" required>
        <el-radio-group v-model="scope.row.type">
          <el-radio label="查询" :value="1"/>
          <el-radio label="新增/保存" :value="2"/>
          <el-radio label="删除" :value="3"/>
          <el-radio label="下载导入模板" :value="4"/>
          <el-radio label="导入预览" :value="5"/>
          <el-radio label="批量导入" :value="6"/>
          <el-radio label="导出" :value="7"/>
          <el-radio label="脚本接口" :value="8"/>
        </el-radio-group>
      </el-form-item>
    </template>
  </be-form>
</template>
<script lang="ts" setup>
import {defineExpose, ref} from "vue";

const refBeForm = ref(null)


function onButtonClick(btnName) {
  refBeForm.value?.onButtonClick(btnName)
}

defineExpose({onButtonClick})
</script>
