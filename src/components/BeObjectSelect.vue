<template>
  <el-input
    ref="refInput"
    :model-value="displayName"
    clearable
    @clear="onClearClick"
    v-bind="bindAttrs"
  >
    <template #append>
      <el-icon
        :class="{ 'my-icon-color-primary': true, 'cursor-pointer': !bindAttrs.disabled }"
        @click="onAppendIconClick"
      >
        <IconLocalSelect />
      </el-icon>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, defineExpose, defineModel, onMounted, ref, useAttrs, watch } from 'vue'
import { useModal } from '@/components/dialog/useModal.ts'
import { useI18n } from 'vue-i18n'
import { getLangText } from "@/locales/common.ts"
import { getEntityDefine } from "@/api/common/platform"
import BeObjectSelectDetail from "@/components/BeObjectSelectDetail.vue"
import type { BeColumn } from "@/components/BeTable.ts"
import { fetchEntityObject } from "@/util/batchDataLoader" // 引入合并加载器

const props = defineProps<{
  lang?: string
  column: BeColumn
}>()

const { open } = useModal()
const { t, locale } = useI18n()
const refInput = ref(null)
const bindAttrs = useAttrs()
const emit = defineEmits<{
  'update:modelValue': [val: any]
  'change': [val: any]
}>()

// 表单或当前行绑定的值（可能是 ID，也可能是 ID 数组）
const formModel = defineModel<any>('formModel', { default: () => ({}) })
const modelValue = defineModel<any>('modelValue')

// 存储当前选中的对象列表
const selectedObject = ref<any[]>([])

/**
 * 核心：计算当前输入框显示的文本
 */
const displayName = computed(() => {
  const displayField = props.column.externalClassDisplayField || 'name'
  const names = selectedObject.value
    .map(s => getLangText(s[displayField], locale.value))
    .filter(Boolean)
  return names.join(', ')
})

onMounted(() => {
  initDisplayName()
})

/**
 * ⚡ 优化后的初始化函数：自动聚合请求与缓存
 */
const initDisplayName = async () => {
  const targetVal = modelValue.value ?? formModel.value?.[props.column.name] ?? formModel.value

  if (targetVal === undefined || targetVal === '' || targetVal === null) {
    selectedObject.value = []
    return
  }

  const primaryField = props.column.externalClassPrimaryField || 'id'
  const extraParams = genQueryParams()

  // 支持单选与多选 ID 数组解析
  const ids = Array.isArray(targetVal) ? targetVal : [targetVal]

  try {
    // 触发批量加载（同一个表格多行并发渲染时会自动合并为一个 in 查询）
    const objectList = await Promise.all(
      ids.map(id => fetchEntityObject(props.column.externalClass, primaryField, id, extraParams))
    )
    selectedObject.value = objectList.filter(Boolean)
  } catch (error) {
    console.error('[BeObjectSelect Init Error]:', error)
  }
}

// 监听值变化，自动更新展示名称
watch(
  () => modelValue.value ?? formModel.value?.[props.column.name] ?? formModel.value,
  () => {
    initDisplayName()
  }
)

const onAppendIconClick = () => {
  if (bindAttrs.disabled === true) return

  getEntityDefine(props.column.externalClass).then(response => {
    const entityDefine = response
    const primaryField = props.column.externalClassPrimaryField || 'id'

    open(
      BeObjectSelectDetail,
      {
        modelValue: props.column.multiple === 'YES'
          ? selectedObject.value.map(s => s[primaryField])
          : selectedObject.value.map(s => s[primaryField])[0],
        column: props.column,
        entityDefine: entityDefine,
        formModel: formModel.value
      },
      {
        title: getLangText(entityDefine.name, locale),
        width: '60%',
        dialogModel: true,
        onClose: (data) => {
          if (data) {
            const dataList = Array.isArray(data) ? data : [data]
            selectedObject.value = dataList

            if (props.column.multiple === 'NO') {
              const val = dataList[0]?.[primaryField]
              emit('update:modelValue', val)
              emit('change', val)
            } else {
              const vals = dataList.map(s => s[primaryField])
              emit('update:modelValue', vals)
              emit('change', vals)
            }
          }
        },
      }
    )
  })
}

const onClearClick = () => {
  selectedObject.value = []
  emit('update:modelValue', '')
  emit('change', '')
}

function genQueryParams() {
  const result: Record<string, any> = {}
  if (props.column.extrasParams) {
    try {
      const extrasParams = JSON.parse(props.column.extrasParams)
      for (const param of extrasParams) {
        const targetName = param.targetName || param.name
        result[targetName] = formModel.value?.[param.name]
        result[param.name + 'QueryType'] = param.type
        result[param.name + 'Readonly'] = param.readonly
      }
    } catch (e) {
      console.warn('解析 extrasParams 失败:', e)
    }
  }
  return result
}

defineExpose({})
</script>
