<template>
  <el-card class="w-full be-card-min-height">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
      </div>
    </template>
    <VueDraggable class="w-full h-full p-2 be-material-target sense-rect-border flex-column" v-model="components"
                  v-bind="$attrs" :animation="150" group="material"
                  ghostClass="drag-ghost" chosenClass="drag-chosen">
      <template v-for="root in components" :key="root.id">
        <be-form-component :meta="root" v-model="root.childrenList" :props-value="root.propsValue"/>
      </template>
    </VueDraggable>
    <template #footer>Footer content</template>
  </el-card>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import {VueDraggable} from "vue-draggable-plus";
import BeFormComponent from "@/components/form/BeFormComponent.vue";

const components = ref([])
</script>
<style scoped>
.be-card-min-height {
  min-height: 100px;
}
</style>
