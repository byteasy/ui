<template>
  <div class="flex-row ml-1" style="height: 100%">
    <house style="width: 0.9rem; height: 0.9rem" />
    <el-breadcrumb :separator-icon="ArrowRight" class="ml-2">
      <template v-for="item in levelList" :key="item.path">
        <el-breadcrumb-item :to="item.path">
          {{ $t(item.name) }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, type Ref, ref, watch } from 'vue'
import { type RouteLocationMatched, useRoute } from 'vue-router'
import { ArrowRight, House } from '@element-plus/icons-vue'

const levelList: Ref<RouteLocationMatched[]> = ref([])
const route = useRoute()

onMounted(() => {
  levelList.value = route.matched.filter((item) => item.name)
})

watch(
  () => route.path,
  () => {
    levelList.value = route.matched
  },
)
</script>
