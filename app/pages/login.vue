<script setup lang="ts">
import {useIFetch} from "~/plugins/useIFetch";

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Вход'
})

const i18n = useI18n()

const fields = [{
  name: 'phone',
  type: 'phone',
  label: i18n.t('Номер телефона'),
  placeholder: i18n.t('Введите номер телефона')
}, {
  name: 'password',
  label: i18n.t('Пароль'),
  type: 'password',
  placeholder: i18n.t('Введите номер пароль')
}]

const validate = (state: any) => {
  const errors = []
  if (!state.phone) errors.push({ path: 'phone', message: i18n.t('Телефон – обязательное поле') })
  if (!state.password) errors.push({ path: 'password', message: i18n.t('Пароль – обязательное поле') })
  return errors
}

const providers = []

async function onSubmit(data: any) {
  console.log('Submitted', data)
  const response = await useIFetch('oauth/', { method: 'POST', body: data })
  if (response.status.value === 'success') {
    token.value.access = response.data.value.access
    token.value.refresh = response.data.value.refresh
    await useRouter().push(useRoute().query.next ?? useLocalePath()('/'))
  } else {
    const message = Object.values(response.error.value.data).map(v => typeof v === 'string' ? v : v.join('. ')).join('. ')
    useToast().add({ title: message, icon: 'i-heroicons-x-circle-16-solid', color: 'red' })
  }
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      title="Onson Mail Cargo Admin"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid', label: $t('Вход') }"
      @submit="onSubmit"
    />
  </UCard>
</template>
