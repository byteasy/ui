<template>
  <div class="flex-column w-full el-card">
    <el-text tag="b" size="large" class="p-2">{{ t('formEngine.property')}}</el-text>
    <el-text tag="b" size="small" v-if="activeComponent?.id">{{ t('formEngine.id')}}:{{ activeComponent?.id }}</el-text>
    <el-collapse
      expand-icon-position="left"
      class="pl-2 pr-2 w-full"
      :accordion="false"
      v-if="activeComponent"
    >
      <el-collapse-item
        :title="getLangText(group.title, locale)"
        :name="group.title"
        v-for="(group, index) in (activeComponent.propsForm || [])"
        :key="group.form"
      >
        <be-bean-input
          v-model="activeComponent.properties"
          size="small"
          :class-name="group.form || ''"
          :columns="1"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import { useFormEngine } from '@/stores/formEngine.ts';
import { storeToRefs } from 'pinia';
import { getLangText } from '@/locales/common.ts';
import { useI18n } from 'vue-i18n';

const formEngine = useFormEngine();
const { activeComponent } = storeToRefs(formEngine);
const { t, locale } = useI18n();
</script>
