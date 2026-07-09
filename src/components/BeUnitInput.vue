<!-- UnitInput.vue -->
<template>
  <div class="flex flex-row align-items-center w-full">
    <el-input-number
      v-model="unitValue"
      controls-position="right"
      v-bind="$attrs"
      class="flex-grow"
      :min="props.allowNegative ? -Infinity : 0"
    >
      <template #decrease-icon>
        <el-icon>
          <Minus />
        </el-icon>
      </template>
      <template #increase-icon>
        <el-icon>
          <Plus />
        </el-icon>
      </template>
    </el-input-number>
    <el-button @click="changeUnit" v-bind="$attrs" class="flex-none">
      {{ props.units[activeUnit] }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { Minus, Plus } from "@element-plus/icons-vue";

interface Props {
  /** v-model 绑定值 例：12px、50% */
  modelValue?: string;
  /** 可选单位列表，默认 ['px', 'vw', 'vh', 'rem', 'em', '%'] */
  units?: string[];
  /** 是否允许负数（如阴影X/Y偏移可开，宽高模糊建议关闭） */
  allowNegative?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  units: () => ["px", "vw", "vh", "rem", "em", "%"],
  allowNegative: false,
});

const emit = defineEmits(["update:modelValue", "change"]);

// 当前数值
const unitValue = ref<number>(0);
// 当前选中单位下标
const activeUnit = ref<number>(0);

/**
 * 解析带单位字符串：提取数字 + 匹配单位下标
 */
const parseValue = (value?: string) => {
  if (!value) {
    unitValue.value = 0;
    activeUnit.value = 0;
    return;
  }
  // 正则匹配数字 + 单位
  const match = String(value).trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/);
  if (!match) {
    unitValue.value = 0;
    activeUnit.value = 0;
    return;
  }

  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const unitIndex = props.units.findIndex((u) => u.toLowerCase() === unit);

  unitValue.value = num;
  activeUnit.value = unitIndex > -1 ? unitIndex : 0;
};

// 初始解析绑定值
parseValue(props.modelValue);

/**
 * 拼接最终带单位的值，通知父组件更新
 */
const syncModel = () => {
  const currentUnit = props.units[activeUnit.value];
  const val = `${unitValue.value}${currentUnit}`;
  emit("update:modelValue", val);
  emit("change", val);
};

// 数值改变同步
watch(unitValue, () => {
  syncModel();
});

// 切换单位
const changeUnit = () => {
  activeUnit.value = activeUnit.value + 1;
  if (activeUnit.value >= props.units.length) {
    activeUnit.value = 0;
  }
  syncModel();
};

// 监听外部 modelValue 变化（父组件赋值同步到子组件）
watch(
  () => props.modelValue,
  (newVal) => {
    parseValue(newVal);
  }
);
</script>
