<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">属性{{activeComponent?.id }}</el-text>
    <be-bean-input ref="refBeanInput" v-model="activeComponent.properties"
                   :class-name="activeComponent.paramForm" :columns="2" v-if="activeComponent" @update:modelValue="doUpdateComponentProps"/>
  </div>
</template>
<script lang="ts" setup>
import {useFormEngine} from '@/stores/formEngine.ts'
import {storeToRefs} from "pinia";
import {defineEmits, onMounted, ref, watch} from "vue";

const refBeanInput = ref(null)
const formEngine = useFormEngine()
const {activeComponent} = storeToRefs(formEngine)
const emit = defineEmits(['updateProps'])

onMounted(() => {
  watch(() => activeComponent.value, (newValue, oldValue) => {
    emit('updateProps', oldValue)
  }, {deep: false})
})

function doUpdateComponentProps() {
  emit('updateProps', activeComponent.value)
}

</script>
