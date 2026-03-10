<template>
  <tuna-container>
    <template v-slot:topBar>
      <el-form :inline="true">
        <el-form-item label="系统">
          <el-select filterable clearable reserve-keyword placeholder="系统" style="width: 160px">
            <el-option key="tms-service" label="物流系统" value="tms-service" />
            <el-option key="tms-measure" label="物流计量" value="tms-measure" />
            <el-option key="tms-gateway" label="物流门禁" value="tms-gateway" />
            <el-option key="mes-service" label="MES系统" value="mes-service" />
            <el-option key="mes-measure" label="车间计量" value="mes-measure" />
            <el-option key="lims-service" label="实验室管理系统" value="lims-service" />
            <el-option key="iron-service" label="铁水跟踪系统" value="iron-service" />
            <el-option key="bms-service" label="票据管理系统" value="bms-service" />
            <el-option key="mdm-service" label="主数据管理系统" value="mdm-service" />
            <el-option key="visitor-service" label="访客管理系统" value="visitor-service" />
            <el-option key="ebs" label="ERP" value="ebs" />
            <el-option key="srm" label="SRM" value="srm" />
            <el-option key="cm" label="合同管理系统" value="cm" />
            <el-option key="shr" label="人事管理系统" value="shr" />
            <el-option key="interface" label="自研系统接口" value="interface" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            type="datetimerange"
            :clearable="false"
            unlink-panels
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search">{{ $t('search') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:mainContent>
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table :data="tableData" style="width: 100%" :height="height">
            <el-table-column fixed prop="date" label="Date" width="150" />
            <el-table-column prop="name" label="Name" width="120" />
            <el-table-column prop="state" label="State" width="120" />
            <el-table-column prop="city" label="City" width="120" />
            <el-table-column prop="address" label="Address" width="600" />
            <el-table-column prop="zip" label="Zip" width="120" />
            <el-table-column fixed="right" label="Operations" min-width="120">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.prevent="deleteRow(scope.$index)"
                >
                  Remove
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template></el-auto-resizer
      >
    </template>
    <template v-slot:bottomBar>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :default-page-size="20" :total="1000" />
    </template>
  </tuna-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import TunaContainer from '@/components/TunaContainer.vue'

const now = new Date()

const tableData = ref([
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  },
])

const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}

const onAddItem = () => {
  now.setDate(now.getDate() + 1)
  tableData.value.push({
    date: dayjs(now).format('YYYY-MM-DD'),
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
  })
}
</script>
