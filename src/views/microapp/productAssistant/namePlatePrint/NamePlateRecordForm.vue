<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_modelCode="modelCodeScope">
      <dictionary-select code="product_model"
                         v-model="modelCodeScope.row[modelCodeScope.column.name]"
                         style="width: 300px" :disabled="modelCodeScope.props.readonly" clearable
                         @change="loadEnvPubNumbers" />
    </template>
    <template v-slot:formItemField_executionStandard="executionStandardScope">
      <dictionary-select code="execution_standard"
                         v-model="executionStandardScope.row[executionStandardScope.column.name]"
                         style="width: 300px" :disabled="executionStandardScope.props.readonly"
                         clearable />
    </template>
    <template v-slot:formItemField_environmentalKeyParts="environmentalKeyPartsScope">
      <dictionary-select code="environmental_key_parts"
                         v-model="environmentalKeyPartsScope.row[environmentalKeyPartsScope.column.name]"
                         style="width: 300px" :disabled="environmentalKeyPartsScope.props.readonly"
                         clearable />
    </template>
    <template v-slot:formItemField_engineManufacturer="engineManufacturerScope">
      <dictionary-select code="engine_manufacturer"
                         v-model="engineManufacturerScope.row[engineManufacturerScope.column.name]"
                         style="width: 300px" :disabled="engineManufacturerScope.props.readonly"
                         clearable />
    </template>
    <template v-slot:formItemField_engineModel="engineModelScope">
      <dictionary-select code="engine_model"
                         v-model="engineModelScope.row[engineModelScope.column.name]"
                         style="width: 300px" :disabled="engineModelScope.props.readonly" clearable
                         @change="onEngineModelChange(engineModelScope.row)" />
    </template>
    <template v-slot:formItemField_ratedPower="ratedPowerScope">
      <el-input v-model="ratedPowerScope.row[ratedPowerScope.column.name]" type="number"
                style="width: 300px" :disabled="ratedPowerScope.props.readonly" clearable />
    </template>
    <template v-slot:formItem_vin="vinScope">
      <el-form-item
        :label="vinScope.column.displayName"
        :prop="vinScope.column.name"
        :rules="[
                {
                  required: true,
                  message: vinScope.column.displayName + t('validate.required'),
                },
                {
                  validator: (rule, value, callback) => {
                    validateVin(vinScope.column, rule, vinScope.row, callback)
                  },
                  trigger: 'blur',
                },
              ]"
      >
        <tuna-form-field
          :column="vinScope.column"
          context="product-assistant"
          :placeholder="vinScope.column.displayName"
          clearable
          show-word-limit
          :disabled="vinScope.props.readonly"
          v-model="vinScope.row[vinScope.column.name]"
          style="width: 300px"
        />
      </el-form-item>
    </template>
    <template v-slot:formItem_engineSerialNumber="engineSerialNumberScope">
      <el-form-item
        :label="engineSerialNumberScope.column.displayName"
        :prop="engineSerialNumberScope.column.name"
        :rules="[
                {
                  required: true,
                  message: engineSerialNumberScope.column.displayName + t('validate.required'),
                },
                {
                  validator: (rule, value, callback) => {
                    validateEngineSerialNumber(engineSerialNumberScope.column, rule, engineSerialNumberScope.row, callback)
                  },
                  trigger: 'blur',
                },
              ]"
      >
        <el-input
          v-model="engineSerialNumberScope.row.engineSerialNumber"
          filterable
          clearable
          style="width: 300px"
          :placeholder="engineSerialNumberScope.column.displayName"
          :disabled="engineSerialNumberScope.props.readonly">
        </el-input>
      </el-form-item>
    </template>
    <template v-slot:formItem_environmentalPublicNumber="environmentalPublicNumberScope">
      <el-form-item
        :label="environmentalPublicNumberScope.column.displayName"
        :prop="environmentalPublicNumberScope.column.name"
        :rules="[
                {
                  required: true,
                  message: environmentalPublicNumberScope.column.displayName + t('validate.required'),
                },
              ]"
      >
        <el-select v-model="environmentalPublicNumberScope.row.environmentalPublicNumber" clearable
                   filterable style="width: 300px"
                   :placeholder="environmentalPublicNumberScope.column.displayName"
                   :disabled="environmentalPublicNumberScope.props.readonly">
          <el-option v-for="item in envPubNumbers" :key="item.id"
                     :label="item.environmentalPublicNumber"
                     :value="item.environmentalPublicNumber" />
        </el-select>
      </el-form-item>
    </template>
    <template v-slot:footerButton="btnScope">
      <el-button type="primary" v-debounce="saveClick" icon="Check" v-if="!btnScope.props.readonly">
        {{
          t('save')
        }}
      </el-button>
      <el-button @click="refForm?.onClearForm" icon="Close">{{ t('close') }}</el-button>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { doHttpGet, doHttpPost } from '@/api/common/platform'
import { validateColumnRule } from '@/util/validateUtils.ts'
import { useI18n } from 'vue-i18n'
import TunaFormField from '@/components/TunaFormField.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n() // 表单引用
const resourceCategorys = ref([])
const envPubNumbers = ref([])
const refForm = ref(null)

onMounted(() => {
  doHttpGet('/platformSvr/sapi/resourceCategorys', {
    current: 1,
    size: 10000,
    ascColumns: ['showOrder']
  }).then((res) => {
    resourceCategorys.value = res.data.records
  })

  if (refForm.value.props.readonly !== true) {
    loadEnvPubNumbers()
  }
})

function loadEnvPubNumbers() {
  refForm.value.formValue.environmentalPublicNumber = undefined
  doHttpGet('/product-assistant/sapi/modelEnvPubNos', {
    ascColumns: ['code'],
    current: 1,
    size: 10000,
    modelCode: refForm.value?.formValue.modelCode,
    modelCodeQueryType: 'eq',
    engineModel: refForm.value?.formValue.engineModel
  }).then((res) => {
    envPubNumbers.value = res.data.records
    if (envPubNumbers.value.length === 1) {
      refForm.value.formValue.environmentalPublicNumber = envPubNumbers.value[0].environmentalPublicNumber
    }
  })
}


function validateVin(col: any, rule: any, value: any, callback: any) {
  validateColumnRule(col, rule, value, (err) => {
    if (err) {
      callback(err)
      return
    }
    doHttpPost('/product-assistant/sapi/nameplateRecords/formValidate', {}, {
      vin: value.vin,
      id: value.id
    }).then((res) => {
      console.log('res', res)
      if (res.data.success === true) {
        callback()
      } else {
        callback(new Error(res.description))
      }
    }).catch((err) => {
      callback(err.description)
    })
  })
}

function validateEngineSerialNumber(col: any, rule: any, value: any, callback: any) {
  validateColumnRule(col, rule, value, (err) => {
    if (err) {
      callback(err)
      return
    }
    doHttpPost('/product-assistant/sapi/nameplateRecords/formValidate', {}, {
      engineSerialNumber: value.engineSerialNumber,
      id: value.id
    }).then((res) => {
      console.log('res', res)
      if (res.data.success === true) {
        callback()
      } else {
        callback(new Error(res.description))
      }
    }).catch((err) => {
      callback(err.description)
    })
  })
}

function onEngineModelChange(row) {
  if (row.engineModel !== null && row.engineModel !== undefined) {
    if (row.engineModel.startsWith('SC')) {
      row.engineManufacturer = '上海新动力汽车科技股份有限公司'
    } else if (row.engineModel.startsWith('V')) {
      row.engineManufacturer = '安徽全柴动力股份有限公司'
    }
  }
  loadEnvPubNumbers()
}

async function saveClick() {
  const valid = await refForm.value?.validate()
  if (!valid) {
    ElMessageBox.confirm(
      '输入的信息有校验错误，请确认，是否继续?',
      '提醒',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        doHttpPost(refForm.value?.props.url, {}, refForm.value?.formValue)
          .then(() => {
            ElMessage.success(t('operationSuccess'))
            refForm.value?.onClearForm()
          })
          .catch((err) => {
            console.log(err)
            ElMessage.error(t('operationFailed'))
          })
      })
      .catch(() => {
      })
  } else {
    doHttpPost(refForm.value?.props.url, {}, refForm.value?.formValue)
      .then(() => {
        ElMessage.success(t('operationSuccess'))
        refForm.value?.onClearForm()
      })
      .catch((err) => {
        console.log(err)
        ElMessage.error(t('operationFailed'))
      })
  }
}
</script>
