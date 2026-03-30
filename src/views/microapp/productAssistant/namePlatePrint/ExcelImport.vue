<template>
  <tuna-excel-import ref="excelRef">
    <template v-slot:footerButton>
      <el-button type="primary" icon="Check" @click="saveClick">{{
          $t('table.importByExcelSubmitButton')
        }}</el-button>
      <el-button @click="onCloseForm" icon="Close">{{ $t('close') }}</el-button>
    </template>
  </tuna-excel-import>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'

const excelRef = ref(null)
onMounted(() => {
  // 在组件挂载后才能访问
  console.log(excelRef.value) // 应该能打印出组件实例
})

function saveClick() {
  if (excelRef.value.validSuccess === false) {
    ElMessageBox.confirm(
      '导入信息有校验错误，您确认要继续导入?',
      '提醒',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        excelRef.value?.saveBatch()
      }).catch(() => {
      })
  } else {
    excelRef.value.saveBatch()
  }
}

function onCloseForm() {
  excelRef.value.closeForm()
}
</script>
