<template>
  <div class="w-full flex-column">
    <div class="w-full flex-grow">
      <div class="w-full flex-row justify-content-center">
        <el-transfer v-model="selectedFieldNames" :data="data" :titles="[t('table.exportTotalFields'), t('table.exportExcelFields')]" filterable />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {defineEmits, defineExpose, onMounted, ref} from 'vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import {doHttpPost} from "@/api/common/platform";
import {useAppSettingsStore} from "@/stores/appSettings.ts";

interface Option {
  key: string
  label: string
  disabled: boolean
}

const props = defineProps<{
  url: string
  columns: Array<any>
  queryParam: any
}>()

const emit = defineEmits(['close'])

const { t, locale } = useI18n() // 表单引用
const appSettingsStore = useAppSettingsStore()
const selectedFieldNames = ref<string[]>([])

const data = ref<Option[]>([])

onMounted(() => {
  props.columns.forEach((column) => {
    data.value.push({
      key: column.name,
      label: getLangText(column.displayName, locale.value),
      disabled: false
    })
    if('YES' === column.isShow) {
      selectedFieldNames.value.push(column.name)
    }
  })
})

const closeForm = () => {
  emit('close')
}

function doSubmit() {
  const params = { ...props.queryParam }
  params.lang = appSettingsStore.lang
  doHttpPost(props.url + '/excel/export', params, selectedFieldNames.value, { responseType: 'blob' }).then(response => {
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/vnd.malformations-office.document.spreadsheet.sheet'
      })
    )
    let fileName = '导出文件.xlsx'
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename=(.*?)(;|$)/)
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = decodeURIComponent(fileNameMatch[1]).replace(/"/g, '')
      }
    }
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  })
}

function onButtonClick(btnName) {
  if(btnName === 'ok') {
    doSubmit()
  } else if (btnName === 'cancel') {
    emit('close', {})
  }
}

defineExpose({
  onButtonClick
})
</script>
