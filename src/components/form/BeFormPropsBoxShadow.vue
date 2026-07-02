<template>
  <div class="flex flex-column gap-1-2">
    <div class="flex flex-row items-center ">
      <span>阴影颜色：</span>
      <el-color-picker v-model="color" show-alpha />
    </div>
    <div class="flex flex-row items-center ">
      <span style="width: 40px;">X:</span>
      <be-unit-input v-model="x" />
    </div>
    <div class="flex flex-row items-center ">
      <span style="width: 40px;">Y:</span>
      <be-unit-input v-model="y" />
    </div>
    <div class="flex flex-row items-center ">
      <span style="width: 40px;">模糊:</span>
      <be-unit-input v-model="like" />
    </div>
    <div class="flex flex-row items-center ">
      <span style="width: 40px;">拓展:</span>
      <be-unit-input v-model="extras" />
    </div>
    <div class="flex flex-row items-center ">
      <el-checkbox v-model="isInset">内阴影(inset)</el-checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

// v-model 双向绑定：接收 box-shadow 完整字符串
const props = defineProps<{
  modelValue: string | undefined;
}>();
const emit = defineEmits(["update:modelValue"]);

// 内部状态
const color = ref("rgba(0, 0, 0, 0.15)");
const x = ref<string>("0px");
const y = ref<string>("2px");
const like = ref<string>("12px");
const extras = ref<string>("0px");
const isInset = ref(false);

/**
 * 组装 box-shadow 样式字符串并向外抛出
 * 单个字段为空使用默认值兜底，不会整体清空阴影
 */
function buildShadowString() {
  // 仅当颜色为空时，代表用户要移除阴影，整体置空
  if (!color.value?.trim()) {
    emit("update:modelValue", undefined);
    return;
  }

  // 单个输入框为空使用默认兜底值
  const offsetX = x.value?.trim() || "0px";
  const offsetY = y.value?.trim() || "0px";
  const blur = like.value?.trim() || "0px";
  const spread = extras.value?.trim() || "0px";

  const parts: string[] = [];
  if (isInset.value) parts.push("inset");
  parts.push(offsetX);
  parts.push(offsetY);
  parts.push(blur);
  parts.push(spread);
  parts.push(color.value.trim());

  const shadowStr = parts.join(" ");
  emit("update:modelValue", shadowStr);
}

// 监听所有配置变化自动同步
watch([color, x, y, like, extras, isInset], buildShadowString);

/**
 * 外部传入 shadow 字符串反向解析回填表单
 */
watch(
  () => props.modelValue,
  (shadowStr) => {
    // null / undefined 全部置空
    if (shadowStr === null || shadowStr === undefined) {
      color.value = "";
      x.value = "";
      y.value = "";
      like.value = "";
      extras.value = "";
      isInset.value = false;
      return;
    }
    if (!shadowStr.trim()) return;

    try {
      const arr = shadowStr.trim().split(/\s+/);
      let idx = 0;
      isInset.value = arr[idx] === "inset";
      if (isInset.value) idx++;

      x.value = arr[idx++] ?? "0px";
      y.value = arr[idx++] ?? "0px";
      like.value = arr[idx++] ?? "0px";
      extras.value = arr.length - idx > 1 ? arr[idx++] : "0px";
      // 剩余全部为颜色（rgba带空格场景兼容）
      color.value = arr.slice(idx).join(" ");
    } catch (err) {
      console.warn("阴影样式解析失败", err);
    }
  },
  { immediate: true }
);
</script>
