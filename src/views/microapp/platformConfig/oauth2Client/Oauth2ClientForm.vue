<template>
  <tuna-table-form ref="refForm">
    <template v-slot:formItemField_clientAuthenticationMethods="scope">
      <el-select v-model="scope.row.clientAuthenticationMethods" multiple :disabled="scope.props.readonly">
        <el-option label="CLIENT_SECRET_BASIC" value="client_secret_basic"/>
        <el-option label="CLIENT_SECRET_POST" value="client_secret_post"/>
        <el-option label="CLIENT_SECRET_JWT" value="client_secret_jwt"/>
        <el-option label="PRIVATE_KEY_JWT" value="private_key_jwt"/>
        <el-option label="NONE" value="none"/>
        <el-option label="TLS_CLIENT_AUTH" value="tls_client_auth"/>
        <el-option label="SELF_SIGNED_TLS_CLIENT_AUTH" value="self_signed_tls_client_auth"/>
      </el-select>
    </template>
    <template v-slot:formItemField_authorizationGrantTypes="scope">
      <el-select v-model="scope.row.authorizationGrantTypes" multiple :disabled="scope.props.readonly">
        <el-option label="AUTHORIZATION_CODE" value="authorization_code"/>
        <el-option label="REFRESH_TOKEN" value="refresh_token"/>
        <el-option label="CLIENT_CREDENTIALS" value="client_credentials"/>
        <el-option label="PASSWORD" value="password"/>
        <el-option label="JWT_BEARER" value="urn:ietf:params:oauth:grant-type:jwt-bearer"/>
        <el-option label="DEVICE_CODE" value="urn:ietf:params:oauth:grant-type:device_code"/>
        <el-option label="TOKEN_EXCHANGE" value="urn:ietf:params:oauth:grant-type:token-exchange"/>
      </el-select>
    </template>
    <template v-slot:formItemField_redirectUris="scope">
      <tuna-string-array-input v-model="scope.row.redirectUris" />
    </template>
    <template v-slot:formItemField_postLogoutRedirectUris="scope">
      <tuna-string-array-input v-model="scope.row.postLogoutRedirectUris" />
    </template>
    <template v-slot:formItemField_scopes="scope">
      <tuna-string-array-input v-model="scope.row.scopes" />
    </template>
    <template v-slot:formItemField_clientSettings="scope">
      <tuna-object-input v-model="scope.row.clientSettings" />
    </template>
    <template v-slot:formItemField_tokenSettings="scope">
      <tuna-object-input v-model="scope.row.tokenSettings" />
    </template>
  </tuna-table-form>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n()

const refForm = ref(null)

onMounted(() => {
})
</script>
