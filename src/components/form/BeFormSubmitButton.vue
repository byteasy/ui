<template>
  <el-button
    :type="props.type"
    :size="props.size"
    :plain="props.plain"
    :text="props.text"
    :bg="props.bg"
    :link="props.link"
    :round="props.round"
    :circle="props.circle"
    :dashed="props.dashed"
    :loading="props.loading"
    :loading-icon="props.loadingIcon"
    :disabled="props.disabled"
    :icon="props.icon"
    :autofocus="props.autofocus"
    :dark="props.dark"
    @click="() => formContext?.handleSubmit()"
    >{{ getLangText(props.title, locale) }}</el-button
  >
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { BeRenderLayoutFormKey } from '@/components/formRender/BeRenderLayoutFormContext.ts';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const props = withDefaults(
  defineProps<{
    title: string;
    type?: string;
    size?: string;
    plain?: boolean;
    text?: boolean;
    bg?: boolean;
    link?: boolean;
    round?: boolean;
    circle?: boolean;
    dashed?: boolean;
    loading?: boolean;
    loadingIcon?: string;
    disabled?: boolean;
    icon?: string;
    autofocus?: boolean;
    dark?: boolean;
  }>(),
  {
    type: 'primary',
    size: 'default',
  },
);
const formContext = inject(BeRenderLayoutFormKey);
</script>

<style scoped></style>
