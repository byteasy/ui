<template>
  <el-splitter>
    <el-splitter-panel class="p-2">
      <div class="flex-column w-full"
           :style="{ height: props.fullscreen === true ? 'calc(100vh - 200px)' : 'calc(55vh - 100px)'}">
        <el-collapse accordion class="w-full h-full" expand-icon-position="left"
                     :model-value="selectedGroup">
          <el-collapse-item :title="getLangText(group.name, locale)" :name="group.name"
                            v-for="group in props.componentGroups" :key="group.name">
            <div class="flex-row flex-wrap p-2">
              <div
                :class="{ 'selectable-item flex-column ml-1 justify-content-center align-items-center' : true, 'selectable-item-active': isInSelectedRows(com.path) }"
                v-for="com in group.components" :key="com.path" @click="onComponentClick(com)">
                <div class="el-card">
                  <tuna-svg-icon :svg="com.icon" size="48"/>
                </div>
                <tuna-i18n-value :model-value="com.name"/>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-splitter-panel>
    <el-splitter-panel size="350" collapsible :max="600" class="p-2">
      <el-divider border-style="dotted">
        <el-text size="large">{{ $t('platform.componentParamsTitle') }}</el-text>
      </el-divider>
      <div v-if="!selectedCom.hasParam" class="p-2">
        <span>{{ getLangText(selectedCom.name, locale) + $t('platform.componentNoParams') }}</span>
      </div>
      <div class="pl-2 pr-2" v-else>
        <be-bean-input ref="refBeanInput" :class-name="selectedCom.paramForm"
                         v-model="componentParam"/>
      </div>
    </el-splitter-panel>
  </el-splitter>
</template>

<script setup lang="ts">

import {defineEmits, defineExpose, onMounted, ref} from 'vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

const props = defineProps<{
  componentPath?: string
  componentParam?: object
  componentGroups: Array<object>
  fullscreen?: boolean
  isDrawer?: boolean
}>()
const emit = defineEmits(['close'])
const selectedGroup = ref(undefined)
const selectedKey = ref(props.componentPath)
const selectedCom = ref({})
const componentParam = ref({...props.componentParam})
const refBeanInput = ref(null)

onMounted(() => {
  for (let i = 0; i < props.componentGroups.length; i++) {
    const group = props.componentGroups[i]
    for (let j = 0; j < group.components.length; j++) {
      const com = group.components[j]
      if (com.path === selectedKey.value) {
        selectedGroup.value = group.name
        selectedCom.value = com
        return
      }
    }
  }
})

function onOkClick() {
  for (let i = 0; i < props.componentGroups.length; i++) {
    const group = props.componentGroups[i]
    for (let j = 0; j < group.components.length; j++) {
      const com = group.components[j]
      if (com.path === selectedKey.value) {
        emit('close', {component: com, param: componentParam.value})
        return
      }
    }
  }
  emit('close', undefined)
}

function isInSelectedRows(obj) {
  return selectedKey.value === obj
}

function onComponentClick(com) {
  if (refBeanInput.value) {
    refBeanInput.value.resetFields()
  }
  selectedKey.value = com.path
  selectedCom.value = com
  componentParam.value = {}
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    if (selectedCom.value.hasParam === true) {
      refBeanInput.value.validateForm().then(isValid => {
        if (isValid) {
          onOkClick()
        }
      })
    } else {
      onOkClick()
    }
  } else if (btnName === 'cancel') {
    emit('close', undefined)
  }
}

defineExpose({
  onButtonClick
})
</script>
