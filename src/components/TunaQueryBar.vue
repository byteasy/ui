<template>
  <div class="w-full flex-column justify-content-start p-1" ref="queryBarRef">
    <div class="w-full flex-row justify-content-start">
      <el-form :inline="true" class="w-full">
        <slot name="from-query" :fields="props.fields" :queryParam="props.queryParam">
          <template v-for="col in visibleFields" :key="col.name">
            <el-form-item :label="getLangText(col.displayName, locale)" v-if="col.isSearch === 'YES'">
              <slot :name="'form-query-field-' + col.name" :column="col" :queryParam="props.queryParam">
                <tuna-query-field
                  :column="col"
                  :context="props.context"
                  :placeholder="getLangText(col.displayName, locale)"
                  v-model="props.queryParam[col.name]"
                  clearable
                  @change="handleEvent('refresh')"
                  :align="col.align === 'LEFT' ? 'left' : col.align === 'RIGHT' ? 'right' : 'center'" />
              </slot>
            </el-form-item>
          </template>
          <slot name="form-query-extra" :queryParam="props.queryParam"/>
          <el-form-item>
            <div v-if="showCollapseBtn === true" @click="isCollapsed = !isCollapsed, updateVisibleFields()"
                 class="mr-2">
              <el-icon :class="{ rotate: !isCollapsed }">
                <ArrowDown v-if="isCollapsed"/>
                <ArrowUp v-else/>
              </el-icon>
            </div>
            <slot name="form-query-buttons">
              <el-button type="primary" icon="Search" @click="handleEvent('refresh')">{{ $t('search') }}</el-button>
              <el-button type="primary" icon="Plus" v-if="props.queryMode !== true" v-permission="className + '.Add'" @click="handleEvent('add')">{{ $t('add') }}</el-button>
            </slot>
            <slot name="form-query-buttons-extra"></slot>
          </el-form-item>
        </slot>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref} from 'vue'
import {ElIcon} from 'element-plus'
import {ArrowDown} from '@element-plus/icons-vue'
import {getLangText} from "@/locales/common.ts";
import {useI18n} from "vue-i18n";

const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  context: String,
  queryParam: Object,
  queryMode: Boolean
})

const {t, locale} = useI18n()
const emit = defineEmits(['refresh', 'add'])

const queryBarRef = ref(null)
const isCollapsed = ref(true)
const showCollapseBtn = ref(true)
const containerWidth = ref(600)
const visibleFields = ref([])
const className = props.fields[0]?.className

onMounted(() => {
  containerWidth.value = queryBarRef.value?.offsetWidth
  updateVisibleFields()
})

function getVisibleCount() {
  const searchFields = props.fields?.filter(s => s.isSearch === 'YES')
  let count = 0
  let w = containerWidth.value
  w = w - 300
  for (let i = 0; i < searchFields.length; i++) {
    const fieldWidth = searchFields[i]?.width
    const lang = getLangText(searchFields[i]?.displayName, locale)
    if (fieldWidth === 0) {
      w = w - 200 - 20 * lang.length
    } else {
      w = w - fieldWidth - 20 * lang.length
    }
    if (w > 0) {
      count++
    } else {
      break
    }
  }
  return count
}

const updateVisibleFields = () => {
  const num = getVisibleCount()
  const searchFields = props.fields?.filter(s => s.isSearch === 'YES')
  const actualNum = isCollapsed.value === true ? num : searchFields.length
  if (searchFields.length > num) {
    showCollapseBtn.value = true
  } else {
    showCollapseBtn.value = false
  }
  if (visibleFields.value.length < actualNum) {
    for (let i = visibleFields.value.length; i < actualNum && i < searchFields.length; i++) {
      visibleFields.value.push(searchFields[i])
    }
  }
  if (visibleFields.value.length > actualNum) {
    while (visibleFields.value.length > actualNum) {
      visibleFields.value.splice(visibleFields.value.length - 1, 1)
    }
  }
}

const handleEvent = (event) => emit(event, {...props.queryParam})

// 监听 resize 自动刷新（防抖）
let resizeTimer = null
const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    containerWidth.value = queryBarRef.value?.offsetWidth || 0
    updateVisibleFields()
  }, 100)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

onActivated(() => {
  nextTick(() => {
    setTimeout(() => {
      containerWidth.value = queryBarRef.value?.offsetWidth || 0
      updateVisibleFields()
      window.addEventListener('resize', onResize)
    }, 100)
  })
})

onDeactivated(() => {
  window.removeEventListener('resize', onResize)
})

</script>
