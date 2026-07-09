<template>
  <div class="flex flex-column gap-1-2 w-full">
    <div class="flex flex-row align-items-center">
      <el-radio-group v-model="blockModel" :size="props.size" class="flex-grow">
        <el-radio-button value="block" label="block"/>
        <el-radio-button value="inline-block" label="inline-block"/>
        <el-radio-button value="inline" label="inline"/>
        <el-radio-button value="flex" label="flex"/>
      </el-radio-group>
    </div>

    <div v-if="blockModel === 'flex'" class="flex flex-column gap-1-2 w-full">
      <div class="flex flex-row align-items-center">
        <el-text class="flex-none label-width" :size="props.size">Flex Direction:</el-text>
        <el-radio-group v-model="flexDirection" :size="props.size">
          <el-radio-button value="row" label="row"/>
          <el-radio-button value="column" label="column"/>
          <el-radio-button value="row-reverse" label="row-reverse"/>
          <el-radio-button value="column-reverse" label="column-reverse"/>
        </el-radio-group>
      </div>

      <div class="flex flex-row align-items-center">
      <el-text class="flex-none label-width" :size="props.size">Flex Wrap:</el-text>
      <el-radio-group v-model="flexWrap" :size="props.size">
        <el-radio-button value="wrap" label="wrap"/>
        <el-radio-button value="nowrap" label="nowrap"/>
        <el-radio-button value="wrap-reverse" label="wrap-reverse"/>
      </el-radio-group>
      </div>

      <div class="flex flex-row align-items-center">
      <el-text class="flex-none label-width" :size="props.size">Align Items:</el-text>
      <el-radio-group v-model="alignItem" :size="props.size">
        <el-radio-button value="stretch" label="stretch"/>
        <el-radio-button value="center" label="center"/>
        <el-radio-button value="baseline" label="baseline"/>
        <el-radio-button value="flex-start" label="flex-start"/>
        <el-radio-button value="flex-end" label="flex-end"/>
      </el-radio-group>
      </div>
      <div class="flex flex-row align-items-center">
      <el-text class="flex-none label-width" :size="props.size">Justify Content: </el-text>
      <el-radio-group v-model="justifyContent" :size="props.size">
        <el-radio-button value="flex-start" label="flex-start"/>
        <el-radio-button value="flex-end" label="flex-end"/>
        <el-radio-button value="center" label="center"/>
        <el-radio-button value="space-between" label="space-between"/>
        <el-radio-button value="space-around" label="space-around"/>
        <el-radio-button value="space-evenly" label="space-evenly"/>
      </el-radio-group>
      </div>

      <div class="flex flex-row align-items-center">
      <el-text class="flex-none label-width" :size="props.size">Align Content:</el-text>
      <el-radio-group v-model="alignContent" :size="props.size">
        <el-radio-button value="flex-start" label="flex-start"/>
        <el-radio-button value="flex-end" label="flex-end"/>
        <el-radio-button value="center" label="center"/>
        <el-radio-button value="stretch" label="stretch"/>
        <el-radio-button value="space-between" label="space-between"/>
        <el-radio-button value="space-around" label="space-around"/>
        <el-radio-button value="space-evenly" label="space-evenly"/>
      </el-radio-group>
    </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {watch, ref} from "vue";
import {useI18n} from "vue-i18n";
import {getLangText} from "@/locales/common.ts";

const {t, locale} = useI18n();

// 定义v-model
const props = defineProps<{
  modelValue: string | undefined
  size?: string
}>();
const emit = defineEmits(["update:modelValue"]);

// 布局状态，设置浏览器默认值
const blockModel = ref<string>("block");
const flexDirection = ref<string>("row");
const flexWrap = ref<string>("nowrap");
const alignItem = ref<string>("stretch");
const justifyContent = ref<string>("flex-start");
const alignContent = ref<string>("stretch");

/**
 * 组装样式对象，序列化为JSON字符串抛出v-model事件
 */
function syncStyleToParent() {
  const styleObj: Record<string, string> = {
    display: blockModel.value,
  };

  // 只有flex模式才携带flex相关样式
  if (blockModel.value === "flex") {
    styleObj.flexDirection = flexDirection.value;
    styleObj.flexWrap = flexWrap.value;
    styleObj.alignItems = alignItem.value;
    styleObj.justifyContent = justifyContent.value;
    styleObj.alignContent = alignContent.value;
  }

  // 序列化为字符串抛出
  const styleStr = JSON.stringify(styleObj);
  emit("update:modelValue", styleStr);
}

// 监听所有布局字段变化，自动同步到父组件
watch(blockModel, syncStyleToParent);
watch(flexDirection, syncStyleToParent);
watch(flexWrap, syncStyleToParent);
watch(alignItem, syncStyleToParent);
watch(justifyContent, syncStyleToParent);
watch(alignContent, syncStyleToParent);

watch(
  () => props.modelValue,
  (str) => {
    // 当为 null / undefined 时，所有布局字段置空
    if (str === null || str === undefined) {
      blockModel.value = ''
      flexDirection.value = ''
      flexWrap.value = ''
      alignItem.value = ''
      justifyContent.value = ''
      alignContent.value = ''
      return
    }
    // 空字符串直接返回不做解析
    if (!str) return

    try {
      const styleObj = JSON.parse(str) as Record<string, string>;
      blockModel.value = styleObj.display ?? "block";

      if (blockModel.value === "flex") {
        flexDirection.value = styleObj.flexDirection ?? "row";
        flexWrap.value = styleObj.flexWrap ?? "nowrap";
        alignItem.value = styleObj.alignItems ?? "stretch";
        justifyContent.value = styleObj.justifyContent ?? "flex-start";
        alignContent.value = styleObj.alignContent ?? "stretch";
      }
    } catch (err) {
      console.warn("布局样式JSON解析失败", err);
    }
  },
  {immediate: true}
);
</script>
<style scoped>

.label-width {
  min-width: 80px;
}
</style>
