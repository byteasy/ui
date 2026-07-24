<template>
  <el-splitter>
    <el-splitter-panel size="400" collapsible :min="300" :max="600">
      <service-class-tree ref="refTree" @tree-node-click="onTreeNodeClick"/>
    </el-splitter-panel>
    <el-splitter-panel :min="200">
      <BeTableV2
        ref="refTable"
        base-url="/platformSvr/sapi/schemaDefines"
        context="platformSvr"
        class-name="com.byteasy.platform.entity.SchemaDefine"
        :query-params="{ ascColumns: ['className', 'showOrder'] }"
        :form-component="BeDefaultObjectForm"
        class="pl-2"
      >
        <template v-slot:form-query-field-serviceName="serviceNameScope">
          <el-select v-model="serviceNameScope.queryParam.serviceName" style="width: 180px;" clearable @change="refTable.refresh()">
            <el-option v-for="item in services" :key="item" :label="item" :value="item" />
          </el-select>
        </template>
        <template v-slot:form-query-buttons-extra>
          <el-button type="primary" icon="Loading" v-debounce="onSyncSchemaClick">{{ $t('platform.schemaDefine.syncSchema') }}</el-button>
          <el-button type="primary" icon="Loading" v-debounce="onSyncSchemaFromDatabaseClick">{{ $t('platform.schemaDefine.syncSchemaFromDatabase') }}</el-button>
        </template>
        <template v-slot:table-cell-className="scope"
        ><el-link @click="doResearch(scope.row)">{{ scope.row.className }}</el-link></template
        >
        <template v-slot:table-cell-showOrder="scope"
        >
          <el-input-number
            v-model="scope.row.showOrder"
            :min="1"
            :max="60000"
            size="small"
            @change="saveShowOrder(scope.row)"
          />
        </template>
      </BeTableV2>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {doHttpGet, doHttpPost, doHttpPut } from '@/api/common/platform'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import ServiceClassTree from "@/views/microapp/developConfig/schemaDefine/ServiceClassTree.vue";
import BeDefaultObjectForm from "@/views/template/BeDefaultObjectForm.vue";
const { t } = useI18n() // 表单引用

const refTable = ref(null)
const refTree = ref(null)
const services = ref([])

onMounted(() => {
  loadServices()
})

function onSyncSchemaClick() {
  const serviceName = refTable.value?.queryParam.serviceName
  const className = refTable.value?.queryParam.className
  if(serviceName == null) {
    ElMessage.warning(t('platform.serviceNameMissing'))
    return
  }
  if(className == null) {
    ElMessage.warning(t('platform.classNameMissing'))
    return
  }
  doHttpGet('/platformSvr/sapi/schemaDefines/services/' + serviceName + '/context').then(res1 => {
    const ctxPath = res1.data
    doHttpGet(ctxPath + '/sapi/schemas/src/' + className).then(res2 => {
      const columns = res2.data
      if(columns.length > 0) {
        doHttpPut('/platformSvr/sapi/schemaDefines/' + serviceName + '/' + className, {}, columns).then(res3 => {
          ElMessage.success(t('operationSuccess'))
          refTable.value?.refresh()
          refTree.value?.refresh()
        })
      } else {
        ElMessage.warning(t('table.emptyText'))
        return
      }
    })
  })
}

function onSyncSchemaFromDatabaseClick() {
  const serviceName = refTable.value?.queryParam.serviceName
  const className = refTable.value?.queryParam.className
  if(serviceName == null) {
    ElMessage.warning(t('platform.serviceNameMissing'))
    return
  }
  if(className == null) {
    ElMessage.warning(t('platform.classNameMissing'))
    return
  }
  doHttpGet('/platformSvr/sapi/schemaDefines/services/' + serviceName + '/context').then(res1 => {
    const ctxPath = res1.data
    doHttpGet(ctxPath + '/sapi/schemas/database/' + className).then(res2 => {
      const columns = res2.data
      if(columns.length > 0) {
        doHttpPut('/platformSvr/sapi/schemaDefines/' + serviceName + '/' + className, {}, columns).then(res3 => {
          ElMessage.success(t('operationSuccess'))
          refTable.value?.refresh()
          refTree.value?.refresh()
        })
      } else {
        ElMessage.warning(t('table.emptyText'))
        return
      }
    })
  })
}

function loadServices() {
  doHttpGet('/platformSvr/sapi/schemaDefines/services', {}).then(res1 => {
    services.value = res1.data
  })
}

function onTreeNodeClick(node) {
  if(node.name.startsWith('com')) {
    doResearch({ className: node.name })
  } else {
    refTable.value.queryParam.serviceName = node.name
    refTable.value.queryParam.className = undefined
    refTable.value.refresh()
  }
}

function doResearch(row) {
  refTable.value.queryParam.serviceName = undefined
  refTable.value.queryParam.className = row.className
  refTable.value.queryParam.classNameQueryType = 'eq'
  refTable.value.refresh()
}

function saveShowOrder(row) {
  doHttpPost('/platformSvr/sapi/schemaDefines', {}, row)
    .then(() => {
      ElMessage.success(t('operationSuccess'))
      refTable.value.refresh()
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error(t('operationFailed'))
    })
}
</script>
