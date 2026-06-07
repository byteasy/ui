<template>
  <div class="flex-column w-full" :style="{ height: props.fullscreen === true ? 'calc(100vh - 200px)' : 'calc(55vh - 100px)'}">
    <el-checkbox v-model="componentParamEnable" :label="$t('platform.componentParamEnable')"/>
    <tuna-object-input v-model="componentParam" v-if="componentParamEnable === true" class="w-full"/>
    <el-collapse accordion class="w-full h-full" expand-icon-position="left">
      <el-collapse-item :title="getLangText(group.name, locale)" :name="group.name"
                        v-for="group in props.componentGroups" :key="group.name">
        <div class="flex-row flex-wrap p-2">
          <div
            :class="{ 'component-item flex-column justify-content-center align-items-center' : true, 'component-item-active': isInSelectedRows(com.path) }"
            v-for="com in group.components" :key="com.path" @click="() => selectedKey = com.path">
            <div class="el-card">
              <tuna-svg-icon :svg="com.icon" size="64"/>
            </div>
            <tuna-i18n-value :model-value="com.name"/>
          </div>
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
const componentParamEnable = ref(false)
const componentParam = ref({})

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

function isInSelectedRows(obj) {
  return selectedKey.value === obj
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
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
.component-item {
  width: 100%;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.component-item-active {
  border-color: var(--el-color-success);
}

.component-item:hover {
  border-color: var(--el-color-primary);
  cursor: pointer;
}
</style>
