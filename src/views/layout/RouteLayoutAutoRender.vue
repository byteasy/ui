<template>
  <div style="width: 100%; height: 100%">
    <template v-if="loadFailed === undefined">
      <be-std-page-layout
        v-if="layout !== undefined && layout?.type === 'STAND'"
        :layout-prams-id="layout.stdLayoutParamsId"
      />
      <component
        v-else-if="layout != undefined && layout?.type === 'DEVELOP'"
        :is="getComponent(parseComponent(layout.componentPath))"
        :param="parseComponentParam(layout.componentParam)"
      />
      <be-page-render style="width: 100%; height: 100%" v-else-if="layout !== undefined && layout?.type === 'EB'" v-model="ebFormValue" :form-define="pageFormDefine"/>
      <el-skeleton :rows="5" animated v-else />
    </template>
    <el-result
      v-else
      icon="error"
      :title="$t('platform.ebApp.layoutLoadFailed')"
      :sub-title="loadFailed"
    >
      <template #extra>
        <el-button type="primary" @click="reload">{{ $t('platform.ebApp.retry') }}</el-button>
      </template>
    </el-result>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { executeOpenApi } from '@/api/common/platform';
import BeStdPageLayout from '@/views/template/BeStdPageLayout.vue';
import { getComponent } from '@/util/componentLoader.ts';
import { parseComponent, parseComponentParam } from '@/util/common.ts';

const props = defineProps<{
  layoutId?: object | null | undefined;
}>();

const route = useRoute();

const layout = ref(undefined);
const pageFormDefine = ref(undefined);
const loading = ref(true);
const loadFailed = ref(undefined);
const ebFormValue = ref({})

onMounted(() => {
  let layoutId = props.layoutId;
  const params = { ...route.query };
  if (params && params.layoutId) {
    layoutId = params.layoutId;
  }

  loading.value = true;
  if (layoutId) {
    executeOpenApi('4JLqmAjqs', { id: layoutId, idQueryType: 'eq' }, {})
      .then((rsp) => {
        layout.value = rsp.data;
        loading.value = false;
      })
      .catch((err) => {
        loadFailed.value = err.description;
      });
  } else {
    // 根据当前路由查询默认布局
    const fullPath = route.fullPath;
    executeOpenApi('4GEvaDgQs', { path: fullPath }, {})
      .then((rsp) => {
        console.log('pageFormDefine', pageFormDefine);
        layout.value = rsp.data.layout;
        pageFormDefine.value = JSON.parse(rsp.data.ebPage.formDefine || "[]");
        ebFormValue.value = rsp.data.ebValue || {}
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
        loadFailed.value = err.description;
      });
  }
});

const reload = () => {
  window.location.reload();
};
</script>
