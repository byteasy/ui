<template>
  <div class="flex-column w-full">
    <span style="font-size: var(--el-font-size-medium)">{{ $t('platform.ebApp.scriptDebug') }}</span>
    <el-scrollbar :height="props.height - 105" class="w-full pl-3 pr-3" always>
      <div class="flex-column w-full">
        <span style="font-size: var(--el-font-size-base)">{{
            $t('platform.ebApp.scriptDebugHttpParams')
          }}</span>
        <be-key-value-input v-model="params"/>
        <span style="font-size: var(--el-font-size-base)">{{
            $t('platform.ebApp.scriptDebugHttpHeader')
          }}</span>
        <be-key-value-input v-model="header"/>
        <div class="flex-row w-full">
          <span style="font-size: var(--el-font-size-base)"
                class="flex-grow">{{ $t('platform.ebApp.scriptDebugHttpBody') }}</span>
          <el-input-number
            v-model="bodyRows"
            :min="1"
            :max="50"
            size="small"
            controls-position="right"/>
        </div>
        <el-input type="textarea" v-model="body" :rows="bodyRows" class="ml-1"/>
      </div>
      <div class="flex-row w-full justify-content-end">
        <el-button v-debounce="onDebugClick" type="primary">
          {{ $t('platform.ebApp.scriptDebugRequest') }}
        </el-button>
      </div>
      <span style="font-size: var(--el-font-size-base)">{{
          $t('platform.ebApp.scriptDebugResponse')
        }}</span>
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
  </div>
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
const bodyRows = ref(4)
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
  minimap: {enabled: false},// 是否开启右侧代码小地图
  scrollBeyondLastLine: false,// 禁止滚动超过最后一行
  folding: true,             // 开启代码折叠（加号/减号）
  fontSize: 14,              // 字号
  fontFamily: 'Consolas, "Fira Code", Monaco, monospace', // 标准程序员字体
}

const onDebugClick = () => {
  const url = openApi.value.serviceInstance.contextPath + '/sapi/script/api/debug/script'
  const data = {header: header.value, body: body.value, script: scriptRow.value}
  response.value = ''
  doHttpPost(url, convertToObj(params.value), data).then((res) => {
    response.value = JSON.stringify(res, null, 2)
  }).catch((err) => {
    const description = err.description
    const lines = description.split('\r\n')
    let lineNo = 0;
    for (const line of lines) {
      if (lineNo === 0) {
        err['description'] = line
      } else {
        err['description' + lineNo] = line
      }
      lineNo += 1
    }
    response.value = JSON.stringify(err, null, 2)
  })
}

const convertToObj = (value) => {
  const result = {};
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, val]) => {
      if (val.startsWith('[')) {
        result[key] = JSON.parse(val);
      } else {
        result[key] = val;
      }
    });
  }
  console.log(value, result)
  return result;
}
</script>
<style scoped>
/* 必须给父容器指定明确的高度，否则编辑器默认高度可能会塌陷为 0 */
.editor-container {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}
</style>
