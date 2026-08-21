<template>
  <el-popover width="50vw" @before-enter="init" trigger="click"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;" v-if="props.modelValue">
    <template #reference>
      <el-link underline="never" type="primary" >
        <slot name="reference">
          <be-i18n-value :model-value="showValue[props.column.externalClassDisplayField]"
                           :lang="props.lang" />
        </slot>
      </el-link>
    </template>
    <template #default>
      <div style="max-height: 50vh; max-width: 70vw; overflow: auto;">
        <el-descriptions border :column="props.cols || 2">
          <template v-for="col in columns" :key="col.name">
            <el-descriptions-item :label="getLangText(col.displayName, locale)">
              <slot :name="'view_' + col.name" :value="showValue[col.name]" style="width: 30vw">
                <be-enum-viewer
                  v-if="col.type === 'ENUM' && showValue[col.name]"
                  :prop="showValue[col.name]"
                  :context="svrContext"
                  :code="col.typeClassName"
                />
                <be-popup-object-view :model-value="showValue[getClassFieldName(col.externalClass)]"
                                        :column="col" :lang="props.lang"
                                        v-else-if="col.relationType === 'EXTERNAL_KEY'"/>
                <el-text style="max-width: 15vw;" truncated v-else-if="col.type ==='STRING'">{{ getLangText(showValue[col.name], props.lang) }}</el-text>
                <span v-else> {{ showValue[col.name] }}</span>
              </slot>
            </el-descriptions-item>
          </template>
        </el-descriptions>
      </div>
    </template>
  </el-popover>

</template>

<script setup lang="ts">

import {onMounted, ref, watch} from 'vue'
import {doHttpGet, getEntitySchema} from '@/api/common/platform'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import {getClassFieldName} from "@/util/common.ts";

const {t, locale} = useI18n() // 表单引用

const props = defineProps<{
  modelValue: any
  column: any
  lang?: string | undefined | null
  cols?: number
}>()

const showValue = ref({...props.modelValue })
const svrContext = ref('')

const columns = ref([])

onMounted(() => {
  showValue.value = props.modelValue
})

watch(
  () => props.modelValue,
  () => {
    showValue.value = props.modelValue
  },
)

function init() {
  getEntitySchema(props.column.externalClass)
    .then((response) => {
      columns.value = response.data
    })
}
</script>

<style scoped></style>
