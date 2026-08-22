<template>
  <el-select class="w-full" style="min-width: 160px;" @change="optionChange">
    <el-option label="未分组" :value="0" />
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="getLangText(item.name, locale)"
      :value="item.id"
    />
    <template #footer>
      <el-button v-if="!isAdding" text @click="onAddOption" size="small" class="w-full">
        {{ $t('platform.ebApp.addFieldGroup') }}
      </el-button>
      <template v-else>
        <be-i18n-dynamic-input v-model="optionName" class="option-input"
                               :placeholder="$t('platform.ebApp.inputFieldGroupName')"
                               size="small"/>
        <el-button type="primary" @click="onConfirm" size="small">
          {{ $t('ok') }}
        </el-button>
        <el-button @click="onCancel" size="small">{{ $t('cancel') }}</el-button>
      </template>
    </template>
  </el-select>
</template>
<script lang="ts" setup>
import {defineModel, onMounted, ref} from "vue";
import {executeOpenApi} from "@/api/common/platform";
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const {locale} = useI18n() // 表单引用

const formModel = defineModel<any>('formModel', {
  default: () => ({})
})

const options = ref([])
const isAdding = ref(false)
const optionName = ref('')

onMounted(() => {
  refresh()
})

const refresh = () => {
  executeOpenApi('queryFieldGroup', {
    className: formModel.value.className,
    ascColumns: ['id']
  }, {}).then((rsp) => {
    options.value = rsp.data.records
  })
}

const optionChange = (value) => {
  if(value === 0) {
    formModel.value.groupId = 0
    formModel.value.groupIdQueryType = 'isnull'
  } else {
    formModel.value.groupIdQueryType = 'eq'
  }
}
const onAddOption = () => {
  isAdding.value = true
}

const onConfirm = () => {
  executeOpenApi('saveFieldGroup', {}, {
    name: optionName.value,
    className: formModel.value.className
  }).then(() => {
    onCancel()
    refresh()
  })
}
const onCancel = () => {
  optionName.value = ''
  isAdding.value = false
}
</script>

<style>
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
