<template>
  <el-link underline="never" type="primary" @click="onEdit">源码</el-link>
</template>
<script lang="ts" setup>
import BeSrcEditor from "@/components/BeSrcEditor.vue";
import {useModal} from "@/components/dialog/useModal.ts";
import {ref} from "vue";
import {doHttpPost} from "@/api/common/platform";
const {open} = useModal()

const props = defineProps<{
  row: object
  param?: object
  tableRef?: any
}>()

const script = ref(props.row.script)

function onEdit() {
  open(
    BeSrcEditor, // 要显示的组件
    {
      modelValue: script.value,
    }, // 传给组件的 props
    {
      title: "源码编辑",
      width: "100%",
      dialogModel: false,
      onClose: (data) => {
        if (data !== 'cancel') {
          const obj = { ...props.row }
          obj.script = data
          script.value = data
          doHttpPost('/platformSvr/sapi/common/com.byteasy.platform.entity.JsScript', {}, obj).then((rsp) => {
            props.tableRef?.refresh()
          })
        }
      },
    },
  )
}
</script>

