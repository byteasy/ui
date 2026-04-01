<template>
  <el-splitter>
    <el-splitter-panel
      size="60%"
      collapsible
    >
      <div class="w-full h-full">
        <tuna-table
          ref="refTable"
          base-url="/product-assistant/sapi/nameplateRecords"
          context="product-assistant"
          class-name="com.tuna.productAssistant.entity.NameplateRecord"
          :query-params="{ ascColumns: ['updatedTime', 'createdTime'], status: 'QR_CODE_FINISH' }"
          :row-db-click="onRowSelected"
          class="pr-2"
        >
          <template v-slot:formItemField_modelCode="modelCodeScope">
            <dictionary-select code="product_model" v-model="modelCodeScope.queryParam.modelCode"
                               style="width: 200px" clearable @change="refTable?.refresh()" />
          </template>
          <template v-slot:formItemField_executionStandard="executionStandardScope">
            <dictionary-select code="execution_standard"
                               v-model="executionStandardScope.queryParam.executionStandard"
                               style="width: 200px" clearable @change="refTable?.refresh()" />
          </template>
          <template v-slot:formItemField_environmentalKeyParts="environmentalKeyPartsScope">
            <dictionary-select code="environmental_key_parts"
                               v-model="environmentalKeyPartsScope.queryParam.environmentalKeyParts"
                               style="width: 200px" clearable @change="refTable?.refresh()" />
          </template>
          <template v-slot:formItemField_engineManufacturer="engineManufacturerScope">
            <dictionary-select code="engine_manufacturer"
                               v-model="engineManufacturerScope.queryParam.engineManufacturer"
                               style="width: 200px" clearable @change="refTable?.refresh()" />
          </template>
          <template v-slot:formItemField_engineModel="engineModelScope">
            <dictionary-select code="engine_model" v-model="engineModelScope.queryParam.engineModel"
                               style="width: 200px" clearable @change="refTable?.refresh()" />
          </template>
          <template v-slot:formQueryButton>
            <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
                $t('search')
              }}
            </el-button>
          </template>
          <template v-slot:table_column_qrUrl="qrUrlScode">
            <el-image style="width: 100px; height: 100px" :src="qrUrlScode.row.qrUrl" fit="" />
          </template>
          <template v-slot:operationSlot="operationSlot">
            <el-button link type="primary" @click="onRowSelected(operationSlot.row)"
                       :disabled="isRowSelected(operationSlot.row).value">选择
            </el-button>
          </template>
        </tuna-table>
      </div>
    </el-splitter-panel>
    <el-splitter-panel draggable="true" collapsible>
      <div class="w-full h-full">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <div class="pl-2">
              <el-form inline>
                <el-form-item label="生产日期">
                  <el-date-picker type="date" placeholder="生产日期" v-model="productTime"
                                  value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="是否打印天">
                  <enum-select code="com.tuna.enums.YesNo" v-model="includeDay" context="product-assistant" style="width: 80px;"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Cloudy" v-debounce="syncInfo">生成打印模板</el-button>
                </el-form-item>
              </el-form>
              <el-divider />
              <el-table
                :height="height/2"
                :data="selectRows"
                fix
                highlight-current-row
                stripe
              >
                <el-table-column label="序号" type="index" width="80" />
                <el-table-column label="二维码" prop="qrUrl" width="130">
                  <template #default="scope">
                    <el-image style="width: 100px; height: 100px" :src="scope.row.qrUrl" fit="cover" />
                  </template>
                </el-table-column>
                <el-table-column label="环保信息公开编号" prop="environmentalPublicNumber" />
                <el-table-column label="型号" prop="modelCode" />
                <el-table-column label="发动机型号" prop="engineModel" />
                <el-table-column label="燃料喷射系统型式" prop="fuelInjectionSystemType" />
                <el-table-column label="发动机厂家名称" prop="engineManufacturer" />
                <el-table-column label="执行标准" prop="executionStandard" />
                <el-table-column label="环保关键零部件" prop="environmentalKeyParts" />
                <el-table-column label="发动机标定功率" prop="ratedPower" />
                <el-table-column label="出厂编号" prop="vin" />
              </el-table>
              <el-pagination
                background
                layout="total"
                :default-page-size="20"
                :total="selectRows.length"
              />
            </div>
          </template>
        </el-auto-resizer>
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { doHttpPost } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import router from '@/router'

const refTable = ref(null)
const selectRows = ref([])
const productTime = ref('')
const includeDay = ref('NO')
const emit = defineEmits(['close'])

function onRowSelected(row: any) {
  if (row.environmentalPublicNumber === undefined || row.environmentalPublicNumber === null || row.environmentalPublicNumber === '') {
    ElMessage.error('该条记录缺少：环保信息公开编号')
    return
  }
  if (row.modelCode === undefined || row.modelCode === null || row.modelCode === '') {
    ElMessage.error('该条记录缺少：型号')
    return
  }
  if (row.engineModel === undefined || row.engineModel === null || row.engineModel === '') {
    ElMessage.error('条记录缺少：发动机型号')
    return
  }
  if (row.fuelInjectionSystemType === undefined || row.fuelInjectionSystemType === null || row.fuelInjectionSystemType === '') {
    ElMessage.error('该条记录缺少：燃料喷射系统型式')
    return
  }
  if (row.engineManufacturer === undefined || row.engineManufacturer === null || row.engineManufacturer === '') {
    ElMessage.error('该条记录缺少：发动机厂家名称')
    return
  }
  if (row.executionStandard === undefined || row.executionStandard === null || row.executionStandard === '') {
    ElMessage.error('该条记录缺少：执行标准')
    return
  }
  if (row.environmentalKeyParts === undefined || row.environmentalKeyParts === null || row.environmentalKeyParts === '') {
    ElMessage.error('该条记录缺少：环保关键零部件')
    return
  }
  if (row.ratedPower === undefined || row.ratedPower === null || row.ratedPower === '') {
    ElMessage.error('该条记录缺少：发动机标定功率')
    return
  }
  if (row.vin === undefined || row.vin === null || row.vin === '') {
    ElMessage.error('该条记录缺少：出厂编号')
    return
  }
  if (row.qrRawUrl === undefined || row.qrRawUrl === null || row.qrRawUrl === '') {
    ElMessage.error('缺少二维码信息，请先在大田二维码管理平台注册审核并点击同步二维码')
    return
  }
  if (isRowSelected(row).value === false) {
    selectRows.value.push(row)
  }
}

const isRowSelected = (row) => {
  return computed(() => {
    // 根据唯一标识判断（推荐用 id / code 等唯一字段）
    return selectRows.value.some(item => item.id === row.id)
  })
}

function syncInfo() {
  const form = {
    productTime: productTime.value,
    includeDay: includeDay.value,
    vins: selectRows.value.map(row => row.vin).filter(vin => !!vin).join(',')
  }
  if (selectRows.value.length < 1) {
    ElMessage.error('请选择需要生成打印模板的车辆')
    return
  }
  doHttpPost('/product-assistant/sapi/printRecords', {}, form).then(res => {
    window.open('/product-assistant/sapi/printRecords/print/download?id=' + res.data.id, '_blank')
    productTime.value = ''
    selectRows.value = []
    emit('close')
    router.push({ name: 'printRecord' })
  }).catch(err => {
    ElMessage.error('模板生成失败')
  })
}
</script>
