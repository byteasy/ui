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
          :query-params="{ ascColumns: ['updatedTime', 'createdTime'], status: 'WAIT_SALE' }"
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
                <el-form-item label="出厂日期">
                  <el-date-picker type="date" placeholder="生产日期" v-model="productTime"
                                  value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Cloudy" v-debounce="syncInfo">生成大田Excel模板
                  </el-button>
                </el-form-item>
              </el-form>
              <el-divider />
              <el-table
                :height="height/2"
                :data="selectRows"
                fix
                highlight-current-row
              >
                <el-table-column label="序号" type="index" width="80" />
                <el-table-column label="型号" prop="modelCode" stripe highlight-current-row />
                <el-table-column label="出厂编号" prop="vin" stripe highlight-current-row />
                <el-table-column label="发动机型号" prop="engineModel" stripe
                                 highlight-current-row />
                <el-table-column label="发动机功率" prop="ratedPower" stripe
                                 highlight-current-row />
                <el-table-column label="发动机编号" prop="engineSerialNumber" stripe
                                 highlight-current-row />
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
const emit = defineEmits(['close'])

function onRowSelected(row: any) {
  if (row.modelCode === undefined || row.modelCode === null || row.modelCode === '') {
    ElMessage.error('该条记录缺少：型号')
    return
  }
  if (row.vin === undefined || row.vin === null || row.vin === '') {
    ElMessage.error('该条记录缺少：出厂编号')
    return
  }
  if (row.engineModel === undefined || row.engineModel === null || row.engineModel === '') {
    ElMessage.error('该条记录缺少：发动机型号')
    return
  }
  if (row.ratedPower === undefined || row.ratedPower === null || row.ratedPower === '') {
    ElMessage.error('该条记录缺少：发动机功率')
    return
  }
  if (row.engineSerialNumber === undefined || row.engineSerialNumber === null || row.engineSerialNumber === '') {
    ElMessage.error('该条记录缺少：发动机编号')
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
    vins: selectRows.value.map(row => row.vin).filter(vin => !!vin).join(',')
  }
  if (selectRows.value.length < 1) {
    ElMessage.error('请选择需要生成二维码的车辆')
    return
  }
  doHttpPost('/product-assistant/sapi/qrSyncJobs', {}, form).then(res => {
    ElMessage.success('提交成功')
    productTime.value = ''
    selectRows.value = []
    emit('close')
    router.push({ name: 'qrSyncJob' })
  }).catch(err => {
    ElMessage.error('提交同步任务失败')
  })
}
</script>
