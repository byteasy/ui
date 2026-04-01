<template>
  <tuna-table
    ref="refTable"
    base-url="/product-assistant/sapi/nameplateRecords"
    context="product-assistant"
    class-name="com.tuna.productAssistant.entity.NameplateRecord"
    :query-params="{ descColumns: ['updatedTime', 'createdTime'] }"
    :excel-import-enable="true"
    :form-component="NamePlateRecordForm"
    :excel-import-component="ExcelImport"
  >
    <template v-slot:formItemField_modelCode="modelCodeScope">
      <dictionary-select code="product_model" v-model="modelCodeScope.queryParam.modelCode" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formItemField_executionStandard="executionStandardScope">
      <dictionary-select code="execution_standard" v-model="executionStandardScope.queryParam.executionStandard" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formItemField_environmentalKeyParts="environmentalKeyPartsScope">
      <dictionary-select code="environmental_key_parts" v-model="environmentalKeyPartsScope.queryParam.environmentalKeyParts" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formItemField_engineManufacturer="engineManufacturerScope">
      <dictionary-select code="engine_manufacturer" v-model="engineManufacturerScope.queryParam.engineManufacturer" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formItemField_engineModel="engineModelScope">
      <dictionary-select code="engine_model" v-model="engineModelScope.queryParam.engineModel" style="width: 200px" clearable @change="refTable?.refresh()"/>
    </template>
    <template v-slot:formQueryButton>
      <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
          $t('search')
        }}</el-button>
      <el-button type="primary" @click="refTable?.onAdd({ fuelInjectionSystemType: '高压共轨' })" icon="Plus">{{ $t('add') }}</el-button>
      <el-button type="primary" icon="UploadFilled" @click="onCreateQrCode">生成二维码</el-button>
      <el-button type="primary" icon="List" @click="onCreatePrintTemplate">生成打印模板</el-button>
    </template>
    <template v-slot:table_column_qrUrl="qrUrlScode">
      <el-image style="width: 100px; height: 100px" :src="qrUrlScode.row.qrUrl" fit="cover" :zoom-rate="1.2" @click="onQrCodeDetail(qrUrlScode.row)"
                />
    </template>

    <template v-slot:operationSlot="operationSlot">
      <el-button link type="primary" @click="refTable?.onView(operationSlot.row)">{{
          t('table.view')
        }}</el-button>
      <el-button link type="primary" @click="refTable?.onEdit(operationSlot.row)" :disabled="operationSlot.row.status !== 'WAIT_SALE'">
        {{ t('table.edit') }}
      </el-button>
      <el-popconfirm
        :confirm-button-text="$t('ok')"
        :cancel-button-text="$t('cancel')"
        :title="$t('deleteWarn')"
        :hide-after="10"
        @confirm="refTable?.onDelete(operationSlot.row)"
        v-if="operationSlot.row.status === 'WAIT_SALE'"
      >
        <template #reference>
          <el-button link type="danger">
            {{ t('table.delete') }}
          </el-button>
        </template>
      </el-popconfirm>
      <el-button link type="danger" v-else :disabled="operationSlot.row.status !== 'WAIT_SALE'">
        {{ t('table.delete') }}
      </el-button>
    </template>
  </tuna-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ExcelImport from '@/views/microapp/productAssistant/namePlatePrint/ExcelImport.vue'
import NamePlateRecordForm
  from '@/views/microapp/productAssistant/namePlatePrint/NamePlateRecordForm.vue'
import CreateQrCode from '@/views/microapp/productAssistant/namePlatePrint/CreateQrCode.vue'
import { useModal } from '@/components/dialog/useModal.ts'
import CreatePrintTemplate
  from '@/views/microapp/productAssistant/namePlatePrint/CreatePrintTemplate.vue'

const { open } = useModal()
const { t } = useI18n() // 表单引用
const refTable = ref(null)

function onCreateQrCode() {
  open(
    CreateQrCode, // 要显示的组件
    {}, // 传给组件的 props
    {
      title: '生成二维码',
      width: "95%",
      onClose: (data) => {
      },
    },
  )
}

function onCreatePrintTemplate() {
  open(
    CreatePrintTemplate, // 要显示的组件
    {}, // 传给组件的 props
    {
      title: '生成打印模板',
      width: "95%",
      onClose: (data) => {
      },
    },
  )
}

function onQrCodeDetail(row) {
  if(row.qrRawUrl) {
    window.open(row.qrRawUrl, '_blank')
  }
}
</script>
