<template>
  <el-table
    height="300"
    :data="tableData.records"
    fix
    scrollbar-always-on
    v-loading="loading"
    highlight-current-row
  >
    <template v-for="col in tableColumns" :key="col.name">
      <el-table-column
        :align="col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'"
        :fixed="col.isFixed === 'YES'"
        :label="col.displayName"
        :prop="col.name"
        stripe
        highlight-current-row
        v-if="isColumnExist(col.name)"
        :min-width="col.width === 0 ? undefined : col.width"
        :show-overflow-tooltip="col.isOverflow === 'YES'"
      >
        <template #header v-if="col.name === 'name'">
          <div class="flex-row align-items-center w-full">
            <div class="flex-grow"></div>
            <div class="flex-none">
              {{ col.displayName }}
            </div>
            <div class="flex-grow flex-row justify-content-end">
              <el-button icon="Plus" circle @click="onAddI18n" />
              <el-button
                icon="Check"
                circle
                :type="edited ? 'success' : ''"
                :disabled="!edited"
                @click="onSave18n"
              />
            </div>
          </div>
        </template>
        <template #default="scope">
          <el-select
            v-if="col.name === 'lang'"
            v-model="scope.row[col.name]"
            @change="edited = true"
          >
            <el-option label="中文简体" value="zh_CN" :disabled="langExist('zh_CN')" />  <!-- 中文简体 -->
            <el-option label="中文繁體" value="zh_TW" :disabled="langExist('zh_TW')"/>  <!-- 中文繁体 -->
            <el-option label="English" value="en" :disabled="langExist('en')"/>      <!-- 英语 -->
            <el-option label="Русский" value="ru" :disabled="langExist('ru')"/>      <!-- 俄语 -->
            <el-option label="Português" value="pt" :disabled="langExist('pt')"/>    <!-- 葡萄牙语 -->
            <el-option label="Español" value="es" :disabled="langExist('es')"/>      <!-- 西班牙语 -->
            <el-option label="Français" value="fr" :disabled="langExist('fr')"/>     <!-- 法语 -->
            <el-option label="Deutsch" value="de" :disabled="langExist('de')"/>      <!-- 德语 -->
            <el-option label="Italiano" value="it" :disabled="langExist('it')"/>     <!-- 意大利语 -->
            <el-option label="日本語" value="ja" :disabled="langExist('ja')"/>       <!-- 日语 -->
            <el-option label="한국어" value="ko" :disabled="langExist('ko')"/>       <!-- 韩语 -->
          </el-select>
          <el-input
            v-else
            v-model="scope.row[col.name]"
            :readonly="col.name === 'code'"
            @change="edited = true"
          ></el-input>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { defineEmits, onMounted, ref } from 'vue'
import { doHttpGet, doHttpPost } from '@/api/common/platform'
import { ElMessage } from 'element-plus'

const tableData = ref({ total: '0', records: [] })
const tableColumns = ref([])
const loading = ref(false)
const visibleColumns = ref(['code', 'lang', 'name'])
const queryParam = ref({ current: 1, size: 20, ascColumns: ['code'] })
const edited = ref(false)
const { t } = useI18n() // 表单引用
const props = defineProps<{
  code: string
}>()

const emit = defineEmits(['close'])

onMounted(() => {
  doHttpGet('/platformSvr/sapi/schemas/com.tuna.platform.entity.I18n', {}).then((rsp) => {
    tableColumns.value = rsp.data
  })

  queryParam.value.code = props.code
  loading.value = true
  doHttpGet('/platformSvr/sapi/i18ns', queryParam.value).then((res) => {
    tableData.value.records = res.data.records
    loading.value = false
  })
})

const isColumnExist = (column) => {
  // 先取 .value 获取原始数组，再用 includes 判断
  return visibleColumns.value.includes(column)
}

const onAddI18n = () => {
  tableData.value.records.push({ code: props.code })
}

const onSave18n = () => {
  doHttpPost('/platformSvr/sapi/i18ns/batch', {}, tableData.value.records)
    .then((res) => {
      ElMessage.success(t('operationSuccess'))
      emit('close')
    })
}

const langExist = (lang) => {
  return tableData.value.records.some(item => item.lang === lang)
}
</script>
