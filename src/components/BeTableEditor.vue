<template>
  <el-table
    fix
    border
    scrollbar-always-on
    stripe
    highlight-current-row
    ref="refElTable">
    <!-- 动态渲染列 -->
    <el-table-column
      v-for="field in props.fields"
      :key="field.name"
      :label="field.name"
    >
      <template #default="scope">
        <!-- 根据字段type渲染不同录入组件 -->
        <component
          :is="getInputTag(field.type)"
          v-model="scope.row[field.name]"
          v-bind="field.props"
          @change="syncParent"
        >
          <!-- 下拉/单选选项插槽，props传入options时渲染 -->
          <template v-if="['radio','select'].includes(field.type)" #default>
            <el-option
              v-for="opt in field.props.options || []"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </template>
        </component>
        <!-- 校验错误提示 -->
        <div v-if="getFieldError(scope.row, field)" class="error-tip">
          {{ getFieldError(scope.row, field) }}
        </div>
      </template>
    </el-table-column>

    <!-- 删除操作列 -->
    <el-table-column label="操作" width="80">
      <template #default="scope">
        <el-button text type="danger" @click="delRow(scope.$index)" icon="Delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import {ref, watch, reactive} from 'vue'

// 字段类型定义（优化：props不再宽泛object，validator支持返回错误文本）
type FieldType = {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select'
  // 表单组件透传属性
  props: Record<string, any>
  // 校验函数：返回string=报错，返回null/undefined=通过
  validator: (value: any, row: Record<string, any>) => string | null | undefined
};

// 组件入参
const props = defineProps<{
  fields: FieldType[]
}>()

// 自定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>[]): void
}>()

// 本地表格数据
const localList = ref<Record<string, any>[]>([])
// 存储每行校验错误信息
const rowErrors = reactive<Record<number, Record<string, string>>>({})

// 监听父组件传入数据
watch(
  () => props.modelValue,
  (val) => {
    localList.value = Array.isArray(val) ? JSON.parse(JSON.stringify(val)) : []
    clearAllError()
  },
  {immediate: true, deep: true}
)

// 同步数据给父组件
function syncParent() {
  // 执行全局校验
  validateAllRow()
  emit('update:modelValue', localList.value)
}

// 根据字段类型返回对应Element组件名
const getInputTag = (type: FieldType['type']) => {
  const map: Record<FieldType['type'], string> = {
    string: 'el-input',
    number: 'el-input-number',
    boolean: 'el-switch',
    select: 'el-select'
  }
  return map[type]
}

// 新增空行
function addRow() {
  const newRow: Record<string, any> = {}
  // 根据fields初始化空值
  props.fields.forEach(field => {
    switch (field.type) {
      case 'number':
        newRow[field.name] = undefined;
        break
      case 'boolean':
        newRow[field.name] = false;
        break
      default:
        newRow[field.name] = ''
    }
  })
  localList.value.push(newRow)
  syncParent()
}

// 删除指定行
function delRow(index: number) {
  localList.value.splice(index, 1)
  delete rowErrors[index]
  syncParent()
}

// 清空所有行
function clearAll() {
  localList.value = []
  clearAllError()
  syncParent()
}

// 清空全部错误缓存
function clearAllError() {
  Object.keys(rowErrors).forEach(k => delete rowErrors[Number(k)])
}

// 单行单字段校验
function getFieldError(row: Record<string, any>, field: FieldType): string | undefined {
  const rowIndex = localList.value.findIndex(item => item === row)
  if (rowIndex === -1) return undefined
  return rowErrors[rowIndex]?.[field.name]
}

// 校验整行数据
function validateAllRow() {
  clearAllError()
  localList.value.forEach((row, rowIdx) => {
    props.fields.forEach(field => {
      const errMsg = field.validator(row[field.name], row)
      if (errMsg) {
        if (!rowErrors[rowIdx]) rowErrors[rowIdx] = {}
        rowErrors[rowIdx][field.name] = errMsg
      }
    })
  })
}
</script>

