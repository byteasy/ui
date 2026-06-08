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
      },
      {
        name: "{\"zh_CN\":\"枚举\",\"en\":\"Enum Select\"}",
        path: '/components/EnumSelect.vue',
        icon: '<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M237.937778 443.804444a43.946667 43.946667 0 0 0-27.875556-8.533333 48.142222 48.142222 0 0 0-27.875555 8.533333A52.337778 52.337778 0 0 0 163.555556 473.955556h88.32a45.155556 45.155556 0 0 0-13.937778-30.151112z" ></path><path d="M896 352V192.782222C896 91.093333 654.577778 64 512 64s-384 27.093333-384 128.782222V352h-18.275556A45.724444 45.724444 0 0 0 64 397.724444v196.551112A45.724444 45.724444 0 0 0 109.724444 640H128v191.217778C128 932.835556 369.351111 960 512 960s384-27.164444 384-128.782222V640h18.275556a45.724444 45.724444 0 0 0 45.724444-45.724444V397.724444a45.724444 45.724444 0 0 0-45.724444-45.724444zM512 128.426667c190.933333 0 307.342222 40.106667 323.982222 64.426666-16.64 24.248889-133.048889 64.426667-323.982222 64.426667s-307.342222-40.106667-323.982222-64.426667c16.64-24.32 133.048889-64.426667 323.982222-64.426666zM187.093333 267.022222c80.568889 41.528889 226.275556 54.542222 324.906667 54.542222s244.337778-13.013333 324.977778-54.613333v85.333333H187.093333z m203.377778 151.253334a69.973333 69.973333 0 0 1 37.902222-9.315556q27.875556 0 41.813334 15.502222a55.751111 55.751111 0 0 1 14.222222 38.684445v122.311111h-31.217778V473.955556a43.733333 43.733333 0 0 0-9.315555-29.44A31.075556 31.075556 0 0 0 419.128889 433.777778q-20.124444 0-37.902222 20.906666a77.226667 77.226667 0 0 0-17.777778 51.84v78.933334h-31.075556V412.017778h31.004445v32.497778a99.555556 99.555556 0 0 1 27.093333-26.311112zM783.573333 640c-54.044444 18.631111-146.915556 35.555556-271.573333 35.555556s-217.528889-17.137778-271.573333-35.555556zM682.666667 585.457778h-31.288889v-32.497778a100.195556 100.195556 0 0 1-27.093334 26.311111 69.973333 69.973333 0 0 1-37.902222 9.315556q-27.875556 0-41.813333-15.502223a55.68 55.68 0 0 1-14.222222-38.684444V412.017778H561.777778v111.502222a43.662222 43.662222 0 0 0 9.315555 29.44 30.933333 30.933333 0 0 0 24.746667 10.808889q20.124444 0 37.902222-20.906667A77.297778 77.297778 0 0 0 651.377778 490.666667V412.017778H682.666667z m-554.666667-86.755556q0-41.813333 24.035556-65.777778A82.844444 82.844444 0 0 1 213.333333 408.96a72.32 72.32 0 0 1 53.404445 20.906667q20.906667 20.906667 20.906666 68.906666H162.062222q0 34.062222 14.72 48a50.844444 50.844444 0 0 0 36.408889 14.222223 43.733333 43.733333 0 0 0 27.875556-8.533334 40.248889 40.248889 0 0 0 14.222222-25.528889h34.062222a64 64 0 0 1-24.746667 44.871111A80.213333 80.213333 0 0 1 213.333333 588.515556a82.773333 82.773333 0 0 1-61.155555-23.964445Q128 540.444444 128 498.702222z m384 396.871111c-197.12 0-314.808889-42.666667-324.906667-64.426666V685.511111c80.64 41.6 226.346667 54.613333 324.906667 54.613333s244.693333-13.084444 325.191111-54.755555v143.573333c-10.382222 23.893333-128.071111 66.631111-325.191111 66.631111z m384-310.186666h-31.004444V460.017778a34.56 34.56 0 0 0-3.128889-15.502222 12.515556 12.515556 0 0 0-12.373334-6.186667 26.026667 26.026667 0 0 0-20.124444 11.591111 46.862222 46.862222 0 0 0-9.315556 30.222222v105.315556H789.333333V460.017778a34.702222 34.702222 0 0 0-3.057777-15.502222 12.515556 12.515556 0 0 0-12.373334-6.186667 26.026667 26.026667 0 0 0-20.124444 11.662222 46.862222 46.862222 0 0 0-9.315556 30.222222v105.244445h-31.004444V412.017778h31.004444v23.253333a60.728889 60.728889 0 0 1 18.56-19.342222 42.097778 42.097778 0 0 1 23.253334-7.111111 31.928889 31.928889 0 0 1 20.906666 7.111111 35.555556 35.555556 0 0 1 11.591111 19.342222 64.711111 64.711111 0 0 1 17.777778-19.342222 38.542222 38.542222 0 0 1 22.471111-7.111111 36.124444 36.124444 0 0 1 27.875556 10.097778 40.746667 40.746667 0 0 1 9.315555 28.444444z" ></path></svg>',
        hasParam: true,
        paramForm: 'components.EnumSelect.vue'
      },
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
