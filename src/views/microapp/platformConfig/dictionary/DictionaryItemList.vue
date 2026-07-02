
<template>
  <div :style="{ width: '100%', height: (props.height - 60) + 'px'}">
    <tuna-table-v2
      ref="refTable"
      base-url="/platformSvr/sapi/dictionaryItems"
      context="platformSvr"
      class-name="com.byteasy.platform.entity.DictionaryItem"
      class="pl-1 w-full h-full"
      :query-params="{ dictionaryId: props.parent.id, ascColumns: ['showOrder'] }"
      :form-component="DictionaryItemForm"
    >
      <template v-slot:form-query-buttons>
        <el-button type="primary" icon="Search" @click="refTable?.refresh()">{{
            $t('search')
          }}
        </el-button>
        <el-button type="primary" @click="onAdd" icon="Plus"
                   v-permission="'com.byteasy.platform.entity.DictionaryItem.Add'">{{ $t('add') }}
        </el-button>
      </template>
    </tuna-table-v2>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import DictionaryItemForm from "@/views/microapp/platformConfig/dictionary/DictionaryItemForm.vue";

const refTable = ref(null)

const props = defineProps<{
  parent: any
  height: number
}>()

onMounted(() => {
})

function onAdd() {
  refTable.value?.onAdd({ dictionaryId: props.parent.id, groupId: props.parent.groupId })
}
</script>
