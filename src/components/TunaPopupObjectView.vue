<template>
  <el-popover width="40%" @before-enter="init" trigger="click"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;" v-if="props.modelValue">
    <template #reference>
      <el-link underline="never" type="primary" >
        <tuna-i18n-value :model-value="showValue[props.column.externalClassDisplayField]"
                         :lang="props.lang" />
      </el-link>
    </template>
    <template #default>
      <el-descriptions border :column="props.cols || 2">
        <template v-for="col in columns" :key="col.name">
          <el-descriptions-item :label="getLangText(col.displayName, locale)"
                                v-if="col.isShow === 'YES'">
            <slot :name="'view_' + col.name" :value="showValue[col.name]">
              <enum-viewer
                v-if="col.type === 'ENUM'"
                :prop="showValue[col.name]"
                :context="svrContext"
                :code="col.typeClassName"
              />
              <tuna-popup-object-view :model-value="showValue[getClassFieldName(col.externalClass)]"
                                      :column="col" :lang="props.lang"
                                      v-else-if="col.relationType === 'EXTERNAL_KEY'"/>
              <span v-else>{{ getLangText(showValue[col.name], props.lang) }}</span>
            </slot>
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </template>
  </el-popover>

</template>

<script setup lang="ts">

import {onMounted, ref} from 'vue'
import {doHttpGet, getEntitySchema} from '@/api/common/platform'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import {getClassFieldName} from "@/util/common.ts";

const {t, locale} = useI18n() // 表单引用

const props = defineProps<{
  modelValue: any
  column: any
  lang?: string | undefined
  cols?: number
}>()

const showValue = ref({...props.modelValue })
const svrContext = ref('')

const columns = ref([])

onMounted(() => {
  showValue.value = props.modelValue
})

function init() {
  doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.column.externalClass, {})
    .then((response) => {
      const contextPath = response.serviceInstance.contextPath
      svrContext.value = contextPath.substring(1)
      getEntitySchema(svrContext.value, props.column.externalClass)
        .then((response) => {
          columns.value = response.data
        })
    })
}
</script>

<style scoped></style>
