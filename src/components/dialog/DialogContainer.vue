<!-- DialogContainer.vue 最简化版本 -->
<template>
  <Teleport to="body">
    <div v-for="item in modals" :key="String(item.id)">
      <el-dialog
        v-if="item.dialogModel"
        v-model="item.visible"
        :title="item.title"
        :width="item.width"
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
      <el-drawer
        v-else
        v-model="item.visible"
        :title="item.title"
        :size="item.width"
        :resizable="item.draggable"
        :close-on-click-modal="item.closeOnClickModal"
        :direction="item.direction"
      >
        <component
          :is="item.component"
          v-bind="item.props"
          @close="(data) => handleClose(item.id, data)"
          @confirm="(data) => handleConfirm(item.id, data)"
        />
      </el-drawer>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from './useModal.ts'

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
