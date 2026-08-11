<template>
  <el-splitter class="h-full">
    <el-splitter-panel size="70%" collapsible :min="300">
      <be-src-editor v-model="scriptRow.script" :height="props.height" />
    </el-splitter-panel>
    <el-splitter-panel class="pl-2" collapsible>
    </el-splitter-panel>
  </el-splitter>
</template>

<script lang="ts" setup>
import {defineEmits, defineExpose, defineModel} from "vue";
import {executeOpenApi} from "@/api/common/platform";
const emit = defineEmits(['close'])

const props = defineProps<{
  height?: number
}>()

const scriptRow = defineModel<any>('row', {default: () => ({})})

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    executeOpenApi('saveScript', {}, scriptRow.value).then(response => {
      scriptRow.value = response.data
      emit('close', scriptRow.value)
    })
  } else {
    emit('close', undefined)
  }
}

defineExpose({onButtonClick})

</script>
