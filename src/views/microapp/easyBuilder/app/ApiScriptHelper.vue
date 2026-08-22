<template>
  <el-scrollbar :height="props.height - 80">
    <span style="font-size: var(--el-font-size-base)">{{
        $t('platform.ebApp.scriptInputParam')
      }}</span>
    <el-collapse expand-icon-position="left">
      <el-collapse-item title="params" name="1">
        <div>
          http request: http://api.demo?name=3&age=4
        </div>
        <div>
          获取方法: params.name params.age
        </div>
      </el-collapse-item>
      <el-collapse-item title="header" name="2">
        <div>
          Http的请求头
        </div>
        <div>
          获取方法: header.${paramName}
        </div>
      </el-collapse-item>
      <el-collapse-item title="body" name="3">
        <div>
          Http请求体，脚本调用默认使用的POST请求，可以携带Http body,body的类型未字符串
        </div>
        <div>
          使用方法: var bodyObj = JSONParse(body)
        </div>
      </el-collapse-item>
    </el-collapse>
    <span style="font-size: var(--el-font-size-base)">{{
        $t('platform.ebApp.scriptFunction')
      }}</span>
    <be-tree query-api-code="queryScriptFunctionTree" node-key="code"
             permission-add-code="noExistPermission" @nodeClick="onFunctionClick" :context-menu-enable="false" />
    <span style="font-size: var(--el-font-size-base)">{{
        $t('platform.ebApp.scriptFunctionHelpMsg')
      }}</span>
    <div class="flex-column">
      <el-text v-for="des in descriptionList" class="w-full">{{ des }}</el-text>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const activeFunction = ref({})
const descriptionList = ref([])

const props = defineProps<{
  height: number | undefined
}>()

function onFunctionClick(node) {
  activeFunction.value = node
  if (activeFunction.value.description) {
    descriptionList.value = activeFunction.value.description.split('\n')
  } else {
    descriptionList.value = []
  }
}
</script>
