<template>
  <component :is="getComponent(props.meta.path)"
             :meta="props.meta"
             >
  </component>
</template>
<script lang="ts" setup>
import {getRouteComponents} from "@/util/autoImportComponent.ts";
import {useI18n} from "vue-i18n";

const props = defineProps<{
  meta: {
    id: string
    name: string
    path: string
    icon: string
    paramForm: string
  }
  modelValue: any
  propsValue: any
}>()

const {modules } = getRouteComponents()
const {t, locale} = useI18n()

function getComponent(path) {
  return modules['..' + path]
}

</script>
