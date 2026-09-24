<template>
  <div
    class="w-full"
    :style="{ height: props.height ? `${props.height - 60}px !important` : '100vh !important' }"
  >
    <el-splitter layout="horizontal">
      <el-splitter-panel size="300" collapsible v-if="isPlay === false">
        <BeMaterialContainer
          ref="refMaterialContainer"
          @drag-start="onMaterialDrapStart"
          @drag-end="onMaterialDrapEnd"
          :on-move-handle="onDragMoveHandle"
        />
      </el-splitter-panel>
      <el-splitter-panel v-if="isPlay === false">
        <BeFormSense ref="refFormSense" :height="props.height" v-model="formDefine"
                     @update:modelValue="doUpdateModelValue" @play-start="isPlay = true" @play-stoped="isPlay = false"/>
      </el-splitter-panel>
      <el-splitter-panel size="300" collapsible v-if="isPlay === false">
        <be-form-component-prop-editor @updateProps="doUpdateComponentProps" />
      </el-splitter-panel>
      <el-splitter-panel v-if="isPlay === true">
        <be-page-render-container
          v-model="formDefine"
          :height="props.height"
          @play-start="isPlay = true"
          @play-stoped="isPlay = false"
        />
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>
<script setup lang="ts">
import BeFormSense from '@/components/form/BeFormSense.vue';
import BeMaterialContainer from '@/components/form/BeMaterialContainer.vue';
import BeFormComponentPropEditor from '@/components/form/BeFormComponentPropEditor.vue';
import { defineEmits, defineExpose, onMounted, ref } from 'vue';
import BePageRenderContainer from '@/components/form/BePageRenderContainer.vue';
import { executeOpenApi } from '@/api/common/platform';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  height?: number;
  row: object;
}>();
const emit = defineEmits(['close']);
const { t } = useI18n();

const refMaterialContainer = ref(null);
const refFormSense = ref(null);

const formDefine = ref([]);
const isPlay = ref(false);

onMounted(() => {
  const arrs = JSON.parse(props.row?.formDefine || '[]');
  for(let i = 0; i < arrs.length; i++) {
    formDefine.value.push(arrs[i])
    console.log('push', arrs[i])
  }
  console.log('formDefine', formDefine.value)
})

function onMaterialDrapStart(event) {
  refFormSense.value.handleDragStart(event.data);
}

function onMaterialDrapEnd(event) {
  refFormSense.value.handleDragEnd(event.data);
}

function onDragMoveHandle(event, originalEvent) {
  refFormSense.value.onDragMoveHandle(event, originalEvent);
}

function doUpdateModelValue(value) {
  formDefine.value = value
}

function doUpdateComponentProps(compoent) {
  if (compoent == null) {
    return;
  }
  const target = findComponentById(compoent.id, formDefine.value);
  if (target) {
    target.properties = compoent.properties;
  }
  refFormSense.value?.updateComponentProperties();
}

function findComponentById(id: string, list: any[]): any | undefined {
  if (!Array.isArray(list)) return undefined;

  for (const ele of list) {
    if (ele.id === id) {
      return ele;
    }
    if (Array.isArray(ele.children)) {
      const result = findComponentById(id, ele.children);
      if (result) return result;
    }
  }
  return undefined;
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    const page = { ...props.row }
    page.formDefine = JSON.stringify(formDefine.value)
    executeOpenApi('4KNAj25xi', {}, page).then(() => {
      ElMessage.success(t('operationSuccess'));
      emit('close');
    })
  } else if (btnName === 'cancel') {
    emit('close');
  }
}

defineExpose({ onButtonClick });
</script>
