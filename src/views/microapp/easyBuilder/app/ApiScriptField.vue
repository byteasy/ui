<template>
  <el-input ref="refInput"
            :model-value="getDisplayName()"
            clearable
            @clear="onClearClick"
            v-bind="bindAttrs">
    <template #append>
      <el-icon :class="{'my-icon-color-primary': true, 'cursor-pointer': !bindAttrs.disabled }"
               @click="onAppendIconClick">
        <IconLocalSelect/>
      </el-icon>
    </template>
  </el-input>
</template>

<script lang="ts" setup>

import {defineModel, onMounted, ref, useAttrs} from "vue";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";
import ApiScriptEditor from "@/views/microapp/easyBuilder/app/ApiScriptEditor.vue";
import {useModal} from "@/components/dialog/useModal.ts";
import {executeOpenApi} from "@/api/common/platform";

const {open} = useModal()
const {t, locale} = useI18n()
const bindAttrs = useAttrs()
// scriptId
const modelValue = defineModel<any>('modelValue', {default: () => null})
const apiName = defineModel<any>('name', {default: () => null})
const openApi = defineModel<any>('openApi', {default: () => null})
// script row
const scriptRow = ref()

onMounted(() => {
  if (modelValue.value) {
    executeOpenApi('queryScript', {id: modelValue.value, idQueryType: 'eq'}, {}).then(response => {
      scriptRow.value = response.data.records[0]
    })
  }
})

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return
  if (!modelValue.value) {
    executeOpenApi('saveScript', {}, {name: apiName.value, script: ''}).then(response => {
      scriptRow.value = response.data
      if(!scriptRow.value.script) {
        scriptRow.value.script = ''
      }
      modelValue.value = scriptRow.value.id
      openEditor()
    })
  } else {
    openEditor()
  }
}

const openEditor = () => {
  open(
    ApiScriptEditor,
    {
      row: JSON.parse(JSON.stringify(scriptRow.value)),
      openApi: openApi.value
    },
    {
      title: t('platform.ebApp.scriptEditor'),
      width: '100%',
      btnExtras: [{
        key: 'save',
        name: t('save'),
        type: 'primary',
        icon: 'DocumentChecked',
      }],
      onClose: (data) => {
        console.log('data', data)
        if (data) {
          scriptRow.value = data
          modelValue.value = data.id
        }
      },
    },
  )
}

const onClearClick = () => {
  modelValue.value = null
  scriptRow.value = undefined
}

function getDisplayName() {
  if (scriptRow.value && scriptRow.value.name) {
    return getLangText(scriptRow.value.name, locale)
  } else {
    return ''
  }
}
</script>
