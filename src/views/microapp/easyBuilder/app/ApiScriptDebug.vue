<template>
  <el-scrollbar :height="props.height - 80" class="pl-3 pr-3" always>
    <el-divider content-position="left">{{ $t('platform.ebApp.scriptDebug') }}</el-divider>
    <el-form>
      <el-form-item label="params">
        <be-key-value-input v-model="params" />
      </el-form-item>
      <el-form-item label="header">
        <be-key-value-input v-model="header" />
      </el-form-item>
      <el-form-item label="body">
        <el-input type="textarea" v-model="body" :rows="12" />
      </el-form-item>
    </el-form>
    <div class="flex-row w-full justify-content-end">
      <el-button v-debounce="onDebugClick" type="primary">{{ $t('platform.ebApp.scriptDebugRequest') }}</el-button>
    </div>
    <el-divider content-position="left">{{ $t('platform.ebApp.scriptDebugResponse') }}</el-divider>
    <div class="editor-container">
      <VueMonacoEditor
        v-model:value="response"
        language="json"
        theme="vs-dark"
        :options="editorOptions"
        height="800px"
      />
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>

import {defineModel, ref} from "vue";
import {doHttpPost} from "@/api/common/platform";
import VueMonacoEditor from '@guolao/vue-monaco-editor'

const props = defineProps<{
  height: number | undefined
}>()

const openApi = defineModel<any>('openApi', {default: () => null})
const scriptRow = defineModel<any>('row', {default: () => ({})})
const params = ref({})
const header = ref({})
const body = ref('')

const response = ref('')

const editorOptions = {
  readOnly: true,            // 是否只读
  automaticLayout: true,     // 自适应父容器大小变化
  formatOnPaste: true,       // 粘贴时自动格式化
  formatOnType: true,        // 输入时自动格式化
  tabSize: 2,                // 缩进空格数
  minimap: { enabled: true },// 是否开启右侧代码小地图
  scrollBeyondLastLine: false,// 禁止滚动超过最后一行
  folding: true,             // 开启代码折叠（加号/减号）
  fontSize: 14,              // 字号
  fontFamily: 'Consolas, "Fira Code", Monaco, monospace', // 标准程序员字体
}

const onDebugClick = () => {
  const url = openApi.value.serviceInstance.contextPath + '/sapi/script/api/debug/script'
  const data = { header: header.value, body: body.value, script: scriptRow.value }
  response.value = ''
  doHttpPost(url, params.value, data).then((res) => {
    response.value = JSON.stringify(res, null, 2)
  }).catch((err) => {
    response.value = JSON.stringify(err, null, 2)
  })
}
</script>
