<template>
  <tuna-table-v2
    ref="refTable"
    base-url="/platformSvr/sapi/oauth2RegisteredClients"
    context="platformSvr"
    class-name="com.tuna.platform.oauth2.entity.Oauth2RegisteredClient"
    :query-params="{ descColumns: ['updatedTime', 'createdTime'] }"
    :form-component="Oauth2ClientForm"
  >
  </tuna-table-v2>
</template>

<script lang="ts" setup>
import Oauth2ClientForm from "@/views/microapp/platformConfig/oauth2Client/Oauth2ClientForm.vue";
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'

const {t, locale} = useI18n() // 表单引用
const refTable = ref(null)

</script>
