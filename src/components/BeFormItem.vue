<template>
  <template v-for="(groupItems, groupId) in tableColumns" :key="groupId">
    <span style="font-size: var(--el-font-size-base)" v-if="groupId !== 'default' && groupItems.length > 0" class="w-full">
      <be-i18n-value :model-value="groupMap[groupId]?.name"/>
    </span>
    <el-divider direction="horizontal" style="margin-left: 0; margin-right: 0; margin-top: 0.5rem; margin-bottom: 0.5rem;"></el-divider>
    <div class="form-grid w-full">
      <template v-for="col in groupItems" :key="col.name">
        <slot :name="'formItem_' + col.name" :column="col" :props="props" :formModel="formModel">
          <el-form-item :label="getLangText(col.displayName, locale)"
                        v-if="col.isForm === 'YES'" :prop="col.name" :rules="[
                    { required: col.isRequire === 'YES', message: getLangText(col.displayName, locale) + ' ' + t('validate.required') },
                    { validator: (rule, value, callback) => validateColumnRule(col, rule, value, locale, callback), trigger: 'blur' }
                  ]">
            <slot :name="'formItemField_' + col.name" :formModel="formModel" :column="col" :props="props">
              <component :is="getComponent(parseComponent(col.fieldComponent))"
                         :param="parseComponentParam(col.fieldComponent)"
                         :formModel="formModel"
                         v-if="col.fieldComponent"
                         :placeholder="getLangText(col.description || col.displayName || col.name, locale)"
                         :column="col"
                         clearable
                         type="form"
                         :disabled="props.readonly"
                         v-model="formModel[col.name]"/>
              <be-form-field
                v-else
                :column="col"
                :placeholder="getLangText(col.displayName, locale)"
                clearable
                :disabled="props.readonly"
                :formModel="formModel"
                v-model="formModel[col.name]"
                @clear="formModel[col.name] = null"
              >
                <template v-for="(slot, name) in $slots" v-slot:[name]="slotProps">
                  <slot :name="name" v-bind="slotProps"></slot>
                </template>
              </be-form-field>
            </slot>
          </el-form-item>
        </slot>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import {defineModel, onMounted, ref} from 'vue'
import BeFormField from '@/components/BeFormField.vue'
import {useI18n} from 'vue-i18n'
import {executeOpenApi, getEntitySchema} from '@/api/common/platform'
import {ElMessage} from 'element-plus'
import {validateColumnRule} from '@/util/validateUtils.ts'
import {parseComponent, parseComponentParam, putValueIfValid} from '@/util/common.ts'
import {useAppSettingsStore} from '@/stores/appSettings.ts'
import {getLangText} from '@/locales/common.ts'
import {getComponent} from "@/util/componentLoader.ts";

const {t, locale} = useI18n()
const appSettingsStore = useAppSettingsStore()

const props = defineProps<{
  className?: string
  readonly?: boolean
  param?: object
  queryParam?: object
}>()

const formModel = defineModel<any>('formModel', {default: () => ({})})
const tableColumns = ref({})
const groupMap = ref({})

onMounted(() => {
  loadTableColumns()
})

function loadTableColumns() {
  executeOpenApi('listFieldGroup', {
    className: props.className,
    classNameQueryType: 'eq',
    ascColumns: ['name']
  }, {}).then(groupsData => {
    groupsData.data.forEach(group => {
      groupMap.value[group.id] = group
    })
    getEntitySchema(props.className)
      .then((response) => {
        const arrs = sortColumnsByShowOrder(mergeLocalStorage(response.data.filter((f) => f.isForm === 'YES')))
        const groupedColumns = Object.groupBy(arrs, (item) => item.groupId ?? 'default')
        tableColumns.value = groupedColumns
        console.log('groupedColumns', groupedColumns)
      })
      .catch(() => ElMessage.error(t('table.loadingTableColumnsError')))
  })
}

function sortColumnsByShowOrder(columns) {
  return [...columns].sort((a, b) => a.showOrder - b.showOrder)
}

function mergeLocalStorage(data) {
  const fields = appSettingsStore.getStorageObject(props.className + '.fields')
  if (!fields) return data

  data.forEach(col => {
    const custom = fields[col.name]
    if (custom) {
      putValueIfValid(col, 'width', custom.width)
      putValueIfValid(col, 'showOrder', custom.showOrder)
      putValueIfValid(col, 'isShow', custom.isShow)
      putValueIfValid(col, 'isSort', custom.isSort)
      putValueIfValid(col, 'isOverflow', custom.isOverflow)
      putValueIfValid(col, 'isSearch', custom.isSearch)
      putValueIfValid(col, 'align', custom.align)
    }
  })
  return data
}

</script>
<style scoped>
.form-grid {
  display: grid;
  gap: 1rem 1rem;
  align-items: flex-start;
}
.form-container:not(.drawer-mode) .form-grid {
  /* 普通弹窗 */

  .form-container:not(.fullscreen) & {
    @media (max-width: 820px) {
      grid-template-columns: repeat(1, 1fr);
    }
    @media (min-width: 821px) and (max-width: 1499px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1500px) and (max-width: 2499px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 2500px) and (max-width: 3839px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 3840px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  /* 弹窗全屏 */

  .form-container.fullscreen & {
    @media (max-width: 520px) {
      grid-template-columns: repeat(1, 1fr);
    }
    @media (min-width: 521px) and (max-width: 820px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 821px) and (max-width: 1499px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1500px) and (max-width: 2499px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 2500px) and (max-width: 3839px) {
      grid-template-columns: repeat(5, 1fr);
    }
    @media (min-width: 3840px) {
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

/* ===================================== */
/* ✅ 【抽屉模式】按自身宽度响应（100%生效） */
/* ===================================== */
.form-container.drawer-mode .form-grid {
  @container (max-width: 620px) {
    grid-template-columns: repeat(1, 1fr) !important;
  }
  @container (min-width: 621px) and (max-width: 920px) {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  @container (min-width: 921px) and (max-width: 1300px) {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  @container (min-width: 1301px) and (max-width: 1800px) {
    grid-template-columns: repeat(4, 1fr) !important;
  }
  @container (min-width: 1801px) {
    grid-template-columns: repeat(5, 1fr) !important;
  }
}

/* 表单项自动充满网格，不挤压 */
:deep(.el-form-item) {
  width: 100% !important;
  margin: 0 !important;
}
</style>
