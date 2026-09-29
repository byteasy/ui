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
        <BeFormSense
          ref="refFormSense"
          :height="props.height"
          v-model:formDefine="formDefine"
          @play-start="isPlay = true"
          @play-stoped="isPlay = false"
        />
      </el-splitter-panel>
      <el-splitter-panel size="300" collapsible v-if="isPlay === false">
        <be-form-component-prop-editor />
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
import { defineEmits, defineExpose, ref } from 'vue';
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

const formDefine = ref([...JSON.parse(props.row.formDefine || '[]')]);
const isPlay = ref(false);

function onMaterialDrapStart(event) {
  refFormSense.value.handleDragStart(event.data);
}

function onMaterialDrapEnd(event) {
  refFormSense.value.handleDragEnd(event.data);
}

function onDragMoveHandle(event, originalEvent) {
  refFormSense.value.onDragMoveHandle(event, originalEvent);
}

function onButtonClick(btnName) {
  if (btnName === 'ok') {
    const page = { ...props.row };
    page.formDefine = JSON.stringify(formDefine.value);
    executeOpenApi('4KNAj25xi', {}, page).then(() => {
      ElMessage.success(t('operationSuccess'));
      emit('close');
    });
  } else if (btnName === 'cancel') {
    emit('close');
  }
}

defineExpose({ onButtonClick });
</script>
