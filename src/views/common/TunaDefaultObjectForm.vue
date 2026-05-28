<template>
  <tuna-table-form ref="refForm" v-if="loading === false" :url="props.url" :context="props.context" :columns="props.columns" :class-name="props.className" :row="props.row" :readonly="props.readonly" :direction="props.direction" :fullscreen="props.fullscreen" :is-drawer="props.isDrawer">
    <template v-for="col in fieldComponents" :key="col.name" v-slot:[`formItemField_${col.name}`]="scope">
      <component :is="getComponent(col.fieldComponent)" v-model="scope.row[col.name]"></component>
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {doHttpGet} from "@/api/common/platform";
import {getRouteComponents} from "@/util/autoImportComponent.ts";

const props = defineProps<{
  url: string
  context: string
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

function getComponent(path) {
  return modules['..' + path]
}

const fieldComponents = ref(props.columns.filter(s => s.fieldComponent))

onMounted(() => {
  // doHttpGet('/platformSvr/sapi/entityDefines/entity/' + props.className, {}).then(entityDefine => {
  //   loading.value = false
  // })
  loading.value = false
})
</script>
