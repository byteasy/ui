<template>
  <be-table-form ref="refForm" v-if="loading === false" :url="props.url" :columns="props.columns" :class-name="props.className" :row="props.row" :readonly="props.readonly" :direction="props.direction" :fullscreen="props.fullscreen" :is-drawer="props.isDrawer">
    <template v-for="col in fieldComponents" :key="col.name" v-slot:[`formItemField_${col.name}`]="scope">
      <component :is="getComponent(parseComponent(col.fieldComponent))"
                 :param="parseComponentParam(col.fieldComponent)"
                 :row="scope.row"
                 :column="col"
                 :placeholder="getLangText(col.displayName, locale)"
                 v-model="scope.row[col.name]" :disabled="props.readonly" clearable></component>
    </template>
  </be-table-form>
</template>
<script setup lang="ts">
import {defineExpose, onMounted, ref} from "vue";
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {parseComponent, parseComponentParam} from "@/util/common.ts";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  url: string
  columns?: Array<any>
  className?: string
  row?: any
  readonly?: boolean
  direction?: string
  fullscreen?: boolean
  isDrawer?: boolean
}>()

const refForm = ref(null)
const loading = ref(true)
const {modules } = getRouteComponents()
const {t, locale} = useI18n()

function getComponent(path) {
  return modules['..' + path]
}

function onButtonClick(btnName) {
  refForm.value.onButtonClick(btnName)
}

const fieldComponents = ref(props.columns.filter(s => s.fieldComponent))

onMounted(() => {
  // doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
  //   loading.value = false
  // })
  loading.value = false
})

defineExpose({
  onButtonClick
})
</script>
