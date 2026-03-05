<!-- DialogContainer.vue 最简化版本 -->
<template>
  <Teleport to="body">
    <el-dialog
      v-for="item in modals"
      :key="String(item.id)"
      v-model="item.visible"
      :title="item.title"
      :width="item.width || '50%'"
      :draggable="item.draggable"
      :close-on-click-modal="item.closeOnClickModal"
      :fullscreen="item.fullscreen"
      @close="handleClose(item.id)"
      destroy-on-close
      append-to-body
    >
      <component
        :is="item.component"
        v-bind="item.props"
        @close="(data) => handleClose(item.id, data)"
        @confirm="(data) => handleConfirm(item.id, data)"
      />
    </el-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from './useModal'

const { modals, close } = useModal()

// 添加调试
console.log('DialogContainer 渲染，弹窗数量：', modals.length)

const handleClose = (id: symbol, data?: unknown) => {
  console.log('关闭弹窗：', id)
  close(id, data)
}

const handleConfirm = (id: symbol, data?: unknown) => {
  console.log('确认弹窗：', id)
  close(id, data)
}
</script>
