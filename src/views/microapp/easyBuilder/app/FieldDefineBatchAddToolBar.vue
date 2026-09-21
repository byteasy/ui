<template>
  <el-dropdown>
    <el-button type="primary">
      {{ $t('platform.ebApp.stdField') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="batchAddField([id])">{{
          $t('platform.ebApp.stdFieldBase')
        }}</el-dropdown-item>
        <el-dropdown-item
          @click="batchAddField([id, creatorId, createdBy, createdTime])"
          >{{ $t('platform.ebApp.stdFieldImmutably') }}</el-dropdown-item
        >
        <el-dropdown-item
          @click="
            batchAddField([
              id,
              version,
              creatorId,
              createdBy,
              createdTime,
              updaterId,
              updatedBy,
              updatedTime,
            ])
          "
          >{{ $t('platform.ebApp.stdFieldAudit') }}</el-dropdown-item
        >
        <el-dropdown-item
          @click="
            batchAddField([
              id,
              version,
              creatorId,
              createdBy,
              createdTime,
              updaterId,
              updatedBy,
              updatedTime,
              isDeleted,
              deleterId,
              deletedBy,
              deletedTime,
            ])
          "
          >{{ $t('platform.ebApp.stdFieldLogicDelete') }}</el-dropdown-item
        >
        <el-dropdown-item @click="batchAddField([creatorId, createdBy, createdTime])">{{
          $t('platform.ebApp.stdFieldRelation')
        }}</el-dropdown-item>
        <el-dropdown-item @click="loadFromDatabase">{{
          $t('platform.ebApp.stdFieldSyncFromDb')
        }}</el-dropdown-item>
        <el-dropdown-item @click="loadFromSrc">{{
            $t('platform.ebApp.stdFieldSyncFromSrc')
          }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { doHttpGet, getEntityDefine } from '@/api/common/platform';
import { ElMessage } from 'element-plus';

const { t, locale } = useI18n(); // 表单引用

const props = defineProps<{
  refTable: any;
  // 前端配置参数
  param: any;
  queryParams: any;
}>();

const id = {
  name: 'id',
  fieldName: 'id',
  displayName: '{"zh_CN":"编号"}',
  type: 'LONG',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  isOverflow: 'NO',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'YES',
  encrypt: 'NO',
  isRequire: 'NO',
  isSort: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  isForm: 'NO',
  isShow: 'YES',
  typeClassName: 'java.lang.Long',
  showOrder: 0,
  desensitize: 'NO',
};

const version = {
  isSort: 'NO',
  fieldName: 'version',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"版本"}',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'LONG',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  isForm: 'NO',
  externalClassAutoFill: false,
  isShow: 'NO',
  typeClassName: 'java.lang.Long',
  externalClassDisplayField: 'name',
  name: 'version',
  showOrder: 10006,
  desensitize: 'NO',
};

const creatorId = {
  isSort: 'NO',
  fieldName: 'creator_id',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"创建人编号"}',
  minLength: 0,
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  externalClassAutoFill: false,
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'creatorId',
  showOrder: 10000,
  desensitize: 'NO',
  maxLength: 80,
};

const createdBy = {
  isSort: 'NO',
  fieldName: 'created_by',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"创建人"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  externalClassAutoFill: false,
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'createdBy',
  showOrder: 10001,
  desensitize: 'NO',
  maxLength: 80,
};

const createdTime = {
  isSort: 'NO',
  fieldName: 'created_time',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"创建时间"}',
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'LOCAL_DATE_TIME',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  isForm: 'NO',
  externalClassAutoFill: false,
  version: 1,
  isShow: 'NO',
  typeClassName: 'java.time.LocalDateTime',
  name: 'createdTime',
  showOrder: 10002,
  desensitize: 'NO',
};

const updaterId = {
  isSort: 'NO',
  fieldName: 'updater_id',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"更新人编号"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'updaterId',
  showOrder: 10003,
  desensitize: 'NO',
  maxLength: 80,
};

const updatedBy = {
  isSort: 'NO',
  fieldName: 'updated_by',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"更新人"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'updatedBy',
  showOrder: 10004,
  desensitize: 'NO',
  maxLength: 80,
};

const updatedTime = {
  isSort: 'NO',
  fieldName: 'updated_time',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"更新时间"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'LOCAL_DATE_TIME',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.time.LocalDateTime',
  name: 'updatedTime',
  showOrder: 10005,
  desensitize: 'NO',
  maxLength: 80,
};

const isDeleted = {
  isSort: 'NO',
  fieldName: 'is_deleted',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"是否删除"}',
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'INT',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.lang.Integer',
  name: 'isDeleted',
  showOrder: 10006,
  desensitize: 'NO',
};

const deleterId = {
  isSort: 'NO',
  fieldName: 'deleter_id',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"删除人编号"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'deleterId',
  showOrder: 10007,
  desensitize: 'NO',
  maxLength: 80,
};

const deletedBy = {
  isSort: 'NO',
  fieldName: 'deleted_by',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"删除人"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'STRING',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.lang.String',
  name: 'deletedBy',
  showOrder: 10008,
  desensitize: 'NO',
  maxLength: 80,
};

const deletedTime = {
  isSort: 'NO',
  fieldName: 'deleted_time',
  isOverflow: 'NO',
  displayName: '{"zh_CN":"删除时间"}',
  minLength: 0,
  pattern: 'NONE',
  className: 'com.byteasy.platform.entity.EntityDefine',
  isI18n: 'NO',
  type: 'LOCAL_DATE_TIME',
  align: 'LEFT',
  isSearch: 'NO',
  isPrimary: 'NO',
  encrypt: 'NO',
  isRequire: 'NO',
  isFixed: 'NO',
  multiple: 'NO',
  textareaRows: 1,
  isForm: 'NO',
  isShow: 'NO',
  typeClassName: 'java.time.LocalDateTime',
  name: 'deletedTime',
  showOrder: 10009,
  desensitize: 'NO',
  maxLength: 80,
};

const batchAddField = (rows) => {
  rows.forEach((row) => {
    row.className = props.queryParams.className;
  });
  props.refTable.batchAddRow(rows);
};

const loadFromDatabase = async () => {
  getEntityDefine(props.queryParams.className).then(entity => {
    const contextPath = entity.serviceInstance.contextPath
    doHttpGet(contextPath + '/sapi/fieldDefineHelper/database/' + props.queryParams.className, {}).then(response => {
      const rows = response.data;
      rows.forEach((row) => {
        row.className = props.queryParams.className;
      });
      props.refTable.batchAddRow(rows);
    })
  }).catch(error => {
    ElMessage.error(error);
  })
}

const loadFromSrc = async () => {
  getEntityDefine(props.queryParams.className).then(entity => {
    const contextPath = entity.serviceInstance.contextPath
    doHttpGet(contextPath + '/sapi/fieldDefineHelper/src/' + props.queryParams.className, {}).then(response => {
      const rows = response.data;
      rows.forEach((row) => {
        row.className = props.queryParams.className;
      });
      props.refTable.batchAddRow(rows);
    })
  }).catch(error => {
    ElMessage.error(error);
  })
}
</script>

<style></style>
