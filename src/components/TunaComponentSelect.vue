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

<script setup lang="ts">

import {defineExpose, onMounted, ref, useAttrs} from 'vue'
import {useModal} from '@/components/dialog/useModal.ts'
import {useI18n} from 'vue-i18n'
import {getLangText} from "@/locales/common.ts";
import TunaComponentSelectDetail from "@/components/TunaComponentSelectDetail.vue";
import {
  jsonToQueryString,
  parseComponent,
  parseComponentParam,
  queryStringToJson
} from "@/util/common.ts";

const props = defineProps<{
  modelValue?: any
}>()

const {open} = useModal()
const {t, locale} = useI18n()
const refInput = ref(null)
const bindAttrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()

const componentGroups = [
  {
    name: "{\"zh_CN\":\"表格组件\",\"en\":\"Table Column Component\"}",
    components: [
      {
        name: "{\"zh_CN\":\"图片\",\"en\":\"Image\"}",
        path: '/components/TunaTableColumnImage.vue',
        icon: 'Picture'
      }
    ]
  },
  {
    name: "{\"zh_CN\":\"表单组件\",\"en\":\"Form Field Component\"}",
    components: [
      {
        name: "{\"zh_CN\":\"数据字典\",\"en\":\"Dictionary\"}",
        path: '/components/DictionarySelect.vue',
        icon: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M791.599488 905.676128c-32.010041 0-58.051137-26.050306-58.051137-58.07058 0-31.93841 26.041096-57.922201 58.051137-57.922201 13.972223 0 25.340131-11.367909 25.340131-25.343201 0-0.677429-0.034792-1.266853-0.073678-1.785669L816.865941 92.369757c0-13.95278-11.366885-25.304316-25.340131-25.304316L316.866253 67.065442c-60.037375 0-108.880803 48.835242-108.880803 108.862383l0 671.489434c0 60.048631 48.843428 108.901269 108.880803 108.901269l474.733235 0c13.972223 0 25.340131-11.351536 25.340131-25.303292C816.939619 917.043013 805.572734 905.676128 791.599488 905.676128zM342.207407 117.708865l424.032506 0 0 620.847034L342.207407 738.555899 342.207407 117.708865zM258.647293 175.927825c0-22.852474 13.050224-42.974767 32.91669-52.488445l0 618.0882c-11.740392 2.792603-22.832008 7.482415-32.91669 13.890358L258.647293 175.927825zM699.717847 905.676128 316.866253 905.676128c-32.102139 0-58.21896-26.134217-58.21896-58.258868 0-32.122605 26.116821-58.256822 58.21896-58.256822l383.158586 0c-11.126408 17.3389-17.102516 37.506219-17.102516 58.444087C682.922323 868.388896 688.790984 888.426255 699.717847 905.676128z"></path></svg>',
        hasParam: true,
        paramForm: 'components.TunaBeanInput.vue'
      }
    ]
  },
]

const selectedComponent = ref(undefined)

onMounted(() => {
  if (props.modelValue !== undefined && props.modelValue !== '') {
    const path = parseComponent(props.modelValue)
    const param = parseComponentParam(props.modelValue)
    for (let i = 0; i < componentGroups.length; i++) {
      const group = componentGroups[i]
      for (let j = 0; j < group.components.length; j++) {
        const com = group.components[j]
        if (com.path === path) {
          selectedComponent.value = {component: com, param: queryStringToJson(param)}
          return
        }
      }
    }
  }
})

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return
  open(
    TunaComponentSelectDetail,
    {
      componentPath: selectedComponent.value ? selectedComponent.value.component.path : undefined,
      componentParam: selectedComponent.value ? selectedComponent.value.param : undefined,
      componentGroups: componentGroups
    },
    {
      title: t('platform.selectComponent'),
      width: '60%',
      dialogModel: true,
      onClose: (data) => {
        if (data) {
          selectedComponent.value = data
          emit('update:modelValue', toComponentPath(data))
          emit('change', toComponentPath(data))
        } else {
          selectedComponent.value = undefined
          emit('update:modelValue', '')
          emit('change', '')
        }
      },
    },
  )
}

function toComponentPath(selectedComponent) {
  return selectedComponent.component.path + '?' + jsonToQueryString(selectedComponent.param)
}

const onClearClick = () => {
  selectedComponent.value = undefined
  emit('update:modelValue', '')
  emit('change', '')
}

function getDisplayName() {
  if (selectedComponent.value && selectedComponent.value.component) {
    return getLangText(selectedComponent.value.component.name, locale)
  } else {
    return ''
  }
}

defineExpose({})
</script>
