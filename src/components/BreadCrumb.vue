<template>
  <div class="flex-row ml-1" style="height: 2rem;">
    <house style="width: 0.8rem; height: 0.8rem;" />
    <el-breadcrumb :separator-icon="ArrowRight" class="ml-2">
      <template v-for="item in levelList" :key="item.path">
        <el-breadcrumb-item :to="item.path">
          {{ t(item.name) }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, type Ref, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocationMatched, useRoute } from 'vue-router'
import { ArrowRight, House } from '@element-plus/icons-vue'

const { t } = useI18n()
const levelList: Ref<RouteLocationMatched[]> = ref([])
const route = useRoute()

onMounted(() => {
  levelList.value = route.matched.filter((item) => item.name)
})

watch(
  () => route.path,
  () => {
    levelList.value = route.matched
    console.log(levelList.value)
  },
)
</script>
