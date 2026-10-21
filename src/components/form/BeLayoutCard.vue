<template>
  <div class="w-full drag-container-border">
    <div :style="props.modelValue.properties.marginStyle">
      <el-card :style="renderCss(props.modelValue.properties)">
        <template #header>
          <div class="card-header">
            <span>{{ getLangText( props.modelValue.properties.title || '{"zh_CN":"标题","en":"title"}', locale, ) }}</span>
          </div>
        </template>

        <!-- 🔥 修复核心：
             1. 添加 item-key="id"
             2. 显式添加 :direction="'vertical'" 和 :sort="true"
             3. 优化拖拽触发灵敏度与落点空间
        -->
        <VueDraggable
          class="w-full h-full be-material-target sense-rect-border drag-rect-border p-2"
          v-model="children"
          item-key="id"
          :animation="150"
          :direction="'vertical'"
          :sort="true"
          group="material"
          ghostClass="drag-ghost"
          chosenClass="drag-chosen"
          v-bind="$attrs"
        >
          <template v-for="root in children" :key="root.id">
            <!-- 加上 my-1 给组件之间留出微小缝隙，让鼠标能够极其轻松地悬停在中间插入 -->
            <div class="drag-item-wrapper my-1 w-full">
              <be-form-component
                :model-value="root"
                @click="onComponentClick(root)"
                @copy="onComponentCopy(root)"
                @delete="onComponentDelete(root)"
                :active="root.id === activeComponent?.id"
                class="w-full"
                @update:modelValue="(value) => updateChildrenValue(value)"
              />
            </div>
          </template>
        </VueDraggable>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import BeFormComponent from '@/components/form/BeFormComponent.vue';
import { useFormEngine } from '@/stores/formEngine.ts';
import { storeToRefs } from 'pinia';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
import { renderCss } from '@/util/formUtil.ts';

const props = defineProps<{
  modelValue: {
    id: string;
    name: string;
    path: string;
    icon: string;
    propsForm: Array<object>;
    properties: object;
    children: any[];
  };
}>();

const formEngine = useFormEngine();
const children = ref([...(props.modelValue.children || [])]);
const emit = defineEmits(['selected', 'update:modelValue']);
const { activeComponent } = storeToRefs(formEngine);
const { t, locale } = useI18n();

function onComponentClick(ponent: any) {
  formEngine.setActiveComponent(ponent);
}

function onComponentCopy(root: any) {
  const newRoot = JSON.parse(JSON.stringify(root));
  newRoot.id = newRoot.id + '-' + new Date().getTime();
  children.value.push(newRoot);
}

function onComponentDelete(root: any) {
  children.value = children.value.filter((item) => item.id !== root.id);
  if (root.id === activeComponent.value?.id) {
    formEngine.setActiveComponent(null);
  }
}

watch(
  () => children.value,
  () => {
    doUpdateModelValue();
  },
  { deep: true },
);

// 优化：只有当节点确实产生属性变更时才更新，防止覆盖刚刚发生的排序行为
watch(
  () => JSON.stringify(collectAllPropsNodes(props.modelValue.children)),
  () => {
    if (JSON.stringify(children.value) !== JSON.stringify(props.modelValue.children)) {
      children.value = props.modelValue.children ? [...props.modelValue.children] : [];
    }
  },
);

function collectAllPropsNodes(list: any[]): Array<{ id: string; properties: any }> {
  const result: Array<{ id: string; properties: any }> = [];
  if (!Array.isArray(list)) return result;

  for (const node of list) {
    result.push({
      id: node.id,
      properties: node.properties,
    });
  }
  return result;
}

function doUpdateModelValue() {
  const newValue = JSON.parse(JSON.stringify(props.modelValue));
  newValue.children = children.value;
  emit('update:modelValue', newValue);
}

function updateChildrenValue(child: any) {
  const index = children.value.findIndex((item) => item.id === child.id);
  if (index > -1) {
    children.value[index] = child;
  }
  doUpdateModelValue();
}
</script>

<style scoped>
.drag-rect-border {
  min-height: 100px;
  border: 1px dashed var(--el-color-info);
  box-sizing: border-box;
}

.drag-container-border {
  border: 1px dashed var(--el-color-primary);
}

.drag-item-wrapper {
  position: relative;
  transition: all 0.15s ease;
}
</style>
