<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">属性</el-text>
    <el-text tag="b" size="small">ID:{{activeComponent?.id }}</el-text>
    <el-collapse expand-icon-position="left" class="pl-2 pr-2 w-full" :accordion="false" v-if="activeComponent">
      <el-collapse-item :title="getLangText(group.title, locale)" :name="group.title"
                        v-for="group in activeComponent.propsForm" :key="group.form">
        <be-bean-input ref="refBeanInput" v-model="activeComponent.properties" size="small"
                       :class-name="group.form" :columns="1"  @update:modelValue="doUpdateComponentProps"/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import {useFormEngine} from '@/stores/formEngine.ts'
import {storeToRefs} from "pinia";
import {defineEmits, onMounted, ref, watch} from "vue";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const refBeanInput = ref(null)
const formEngine = useFormEngine()
const {activeComponent} = storeToRefs(formEngine)
const emit = defineEmits(['updateProps'])
const { t, locale } = useI18n()

onMounted(() => {
  watch(() => activeComponent.value, (newValue, oldValue) => {
    emit('updateProps', oldValue)
  }, {deep: false})
})

function doUpdateComponentProps() {
  emit('updateProps', activeComponent.value)
}

</script>
