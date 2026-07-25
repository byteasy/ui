<template>
  <div class="editor-container" :style="{ height: (props.height - 80)+ 'px'}">
    <vue-monaco-editor
      v-model:value="code"
      theme="vs-dark"
      language="javascript"
      :options="editorOptions"
      @mount="handleMount"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import {defineExpose, ref, shallowRef} from 'vue'
import VueMonacoEditor from '@guolao/vue-monaco-editor'

const emit = defineEmits<{
  (e: 'close', value: string): void
  (e: 'update:modelValue', value: string): void
}>()

const props = defineProps<{
  modelValue: string
  isDrawer?: boolean
  height?: number
}>()

// 1. 双向绑定的代码内容
const code = ref(props.modelValue)

// 2. 存储编辑器实例
// 重点：必须使用 shallowRef！如果使用 ref，Vue 的深度响应式代理会导致编辑器卡顿甚至崩溃
const editorRef = shallowRef()

// 3. 编辑器核心配置项
const editorOptions = ref({
  automaticLayout: true, // 自动触发布局计算（很重要，否则容器尺寸变化时编辑器不会自适应）
  minimap: {
    enabled: true,       // 是否开启右侧的迷你代码缩略图
  },
  fontSize: 14,          // 字体大小
  wordWrap: 'on',        // 自动换行 ('on' | 'off' | 'wordWrapColumn' | 'bounded')
  readOnly: false,       // 是否只读
  tabSize: 2,            // Tab 缩进空格数
  scrollBeyondLastLine: false, // 是否允许滚动到最后一行之后
})

// 4. 生命周期钩子：编辑器挂载完成
const handleMount = (editor) => {
  editorRef.value = editor
  console.log('编辑器实例已就绪', editor)
  editor.getAction('editor.action.formatDocument').run()
  // 你可以在这里调用原生的 Monaco API，例如格式化代码：
  // editor.getAction('editor.action.formatDocument').run()
}

// 5. 监听内容变化
const handleChange = (value) => {
  emit('update:modelValue', value)
}

function onButtonClick(btnName) {
  if(btnName === 'ok') {
    emit('close', code.value)
  } else if (btnName === 'cancel') {
    emit('close', 'cancel')
  }
}

defineExpose({onButtonClick})

</script>

<style scoped>
/* 必须给父容器指定明确的高度，否则编辑器默认高度可能会塌陷为 0 */
.editor-container {
  width: 100%;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
}
</style>
