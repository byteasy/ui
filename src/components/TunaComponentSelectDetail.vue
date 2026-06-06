<template>
  <div class="flex-column w-full" :style="{ height: props.fullscreen === true ? 'calc(100vh - 200px)' : 'calc(55vh - 100px)'}">
    <el-collapse accordion class="w-full h-full" expand-icon-position="left">
      <el-collapse-item :title="getLangText(group.name, locale)" :name="group.name" v-for="group in props.componentGroups" :key="group.name">
        <div class="flex-row flex-wrap">
          <span v-for="item in 2000" :key="item">tt{{item}}</span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">

import {defineEmits, defineExpose, ref} from 'vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

const props = defineProps<{
  componentPath?: string
  componentGroups: Array<object>
  fullscreen?: boolean
  isDrawer?: boolean
}>()
const emit = defineEmits(['close'])
const selectedKey = ref(props.componentPath)

function onOkClick() {
  for (let i = 0; i < props.componentGroups.length; i++) {
    const group = props.componentGroups[i]
    for (let j = 0; j < group.components.length; j++) {
      const com = group.components[j]
      if (com.path === selectedKey.value) {
        emit('close', com)
        return
      }
    }
  }
  emit('close', {})
}

function onButtonClick(btnName) {
  if(btnName === 'ok') {
    onOkClick()
  } else if (btnName === 'cancel') {
    emit('close', {})
  }
}

defineExpose({
  onButtonClick
})
</script>

<style scoped>
.form-container {
  width: 100% !important;
}

.form-footer {
  flex-shrink: 0;
}

.footer-buttons {
  padding-bottom: 12px;
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
