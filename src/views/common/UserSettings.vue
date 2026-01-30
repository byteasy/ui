<template>
  <div>12333</div>
</template>

<script lang="ts" setup>
import { closeModal } from 'jenesius-vue-modal'
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const I18n = useI18n()
const user = ref({
  attributes: {
    phone: [],
  },
})

onBeforeMount(() => {})

function doLogout() {
  closeModal()
}
</script>

<style scoped>
.tb-image {
  width: 13rem;
  height: 13rem;
}
.tb-wei {
  width: 11rem;
  height: 15rem;
}
.tb-mayi {
  width: 10rem;
  height: 15rem;
}
</style>
