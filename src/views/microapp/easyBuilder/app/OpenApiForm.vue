<template>
  <be-form ref="refBeForm" class-name="com.byteasy.platform.entity.Openapi">
  </be-form>
</template>
<script lang="ts" setup>
import {defineExpose, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";

const refBeForm = ref(null)
const {t, locale} = useI18n()

function onButtonClick(btnName) {
  refBeForm.value?.onButtonClick(btnName)
}

defineExpose({onButtonClick})
</script>
