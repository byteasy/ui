<template>
  <el-descriptions border :column="props.cols || 2">
    <template v-for="col in columns" :key="col.name">
      <el-descriptions-item
        :label="getLangText(col.displayName, locale)"
        :label-class-name="diffLabelClassName(col.name)"
      >
        <slot :name="'view_' + col.name" :value="showValue[col.name]" style="width: 30vw">
          <el-text style="max-width: 15vw; padding-right: 0.5rem;" truncated tag="del" v-if="props.diffFieldNames.indexOf(col.name) >= 0" type="info"> {{ getOldValue(col.name) }}</el-text>
          <be-enum-viewer
            v-if="col.type === 'ENUM' && showValue[col.name]"
            :prop="showValue[col.name]"
            :context="svrContext"
            :code="col.typeClassName"
          />
          <be-popup-object-view
            :model-value="showValue[getClassFieldName(col.externalClass)]"
            :column="col"
            :lang="props.lang"
            v-else-if="col.relationType === 'EXTERNAL_KEY' && col.externalClassAutoFill === true"
          />
          <el-text
            style="max-width: 15vw"
            truncated
            v-else-if="col.type === 'STRING' && col.isI18n === 'YES'"
            >{{ getLangText(showValue[col.name], props.lang) }}</el-text
          >
          <el-text style="max-width: 15vw" truncated v-else> {{ showValue[col.name] }}</el-text>
        </slot>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getEntitySchema } from '@/api/common/platform';
import { useI18n } from 'vue-i18n';
import { getLangText } from '@/locales/common.ts';
import { getClassFieldName } from '@/util/common.ts';

const { t, locale } = useI18n(); // 表单引用

const props = defineProps<{
  modelValue: any;
  oldModelValue: any;
  diffFieldNames: Array<string>;
  className: string;
  lang?: string | undefined | null;
  cols?: number;
}>();

const showValue = ref({ ...props.modelValue });
const showOldValue = ref({ ...props.oldModelValue });
const svrContext = ref('');

const columns = ref([]);

onMounted(() => {
  showValue.value = props.modelValue;
  init();
});

watch(
  () => props.modelValue,
  () => {
    showValue.value = props.modelValue;
  },
);

const getOldValue = (name) => {
  return showOldValue.value[name];
};

const diffLabelClassName = (name) => {
  if (props.diffFieldNames.indexOf(name) >= 0) {
    return 'different-field-label';
  } else {
    return '';
  }
};

function init() {
  getEntitySchema(props.className).then((response) => {
    columns.value = response.data;
  });
}
</script>

<style scoped>
:deep(.different-field-label) {
  color: var(--el-color-danger) !important;
  font-weight: bold !important;
  background: var(--el-color-success-light-9) !important;
}
</style>
