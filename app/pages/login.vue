<script lang="ts">
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Вход'
})

export default {
  name: 'Login',
  data() {
    return {
      fields: [{
        name: 'phone',
        type: 'phone',
        label: this.$t('Номер телефона'),
        placeholder: this.$t('Введите номер телефона')
      }, {
        name: 'password',
        label: this.$t('Пароль'),
        type: 'password',
        placeholder: this.$t('Введите номер пароль')
      }],
      providers: []
    }
  },
  methods: {
    validate(state: any) {
      const errors = []
      if (!state.phone) errors.push({ path: 'phone', message: i18n.t('Телефон – обязательное поле') })
      if (!state.password) errors.push({ path: 'password', message: i18n.t('Пароль – обязательное поле') })
      return errors
    },
    async onSubmit(data: any) {
      console.log('Submitted', data)
      const response = await this.$api('oauth/', { method: 'POST', body: data })
      token.value.access = response.data.value.access
      token.value.refresh = response.data.value.refresh
      await useRouter().push(useRoute().query.next ?? useLocalePath()('/'))
    }
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
