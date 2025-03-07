<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import { useIFetch } from '~/plugins/useIFetch'

const i18n = useI18n()
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(['initial', 'part_number', 'disabled'])
const emit = defineEmits(['close'])
const productColumns = [
  {
    key: 'product',
    label: i18n.t('Продукт')
  },
  {
    key: 'price_per_product',
    label: i18n.t('Цена за продукт')
  },
  {
    key: 'count_product',
    label: i18n.t('Кол-во продукт')
  },
  {
    key: 'total_price',
    label: i18n.t('Обшая цена')
  }
]
const disabled = (props.initial.status ? props.initial.status !== 'create_time' : false) || props.disabled

const state = reactive(props.initial)
// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.client) errors.push({ path: 'client', message: i18n.t('Пасспорт – обязательное поле') })
  if (!state.weight) errors.push({ path: 'weight', message: i18n.t('Весь – обязательное поле') })
  if (!state.facture_price) errors.push({
    path: 'facture_price',
    message: i18n.t('Фактическая цена – обязательное поле')
  })
  return errors
}

const searchClient = async (q: string | null) => {
  const query = { limit: 30 }
  if (q && q.length > 3) query.search = q
  const { data } = await useIFetch('cargo/client/admin/client/', { query })
  return data.value?.results
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  const body = JSON.parse(JSON.stringify(event.data))
  if (!state.products || !state.products.product_counts) {
    return useToast().add({
      title: i18n.t('Генерируйте продукты'),
      icon: 'i-heroicons-x-circle-16-solid', color: 'red' })
  }
  body.client = body.client.id
  body.parts = props.part_number ?? body.parts
  await useIFetch(`cargo/order/admin/${company.value.sub}/order/`, { method: 'POST', body })
  emit('close')
}

async function generate_products() {
  if (!state.facture_price) {
    return useToast().add({
      title: i18n.t('Фактическая цена – обязательное поле'),
      icon: 'i-heroicons-x-circle-16-solid', color: 'red' })
  }
  const { data } = await useIFetch(`cargo/order/admin/products-generator/${state.facture_price}/`)
  state.products = data.value
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup
      :label="$t('Трек-код')"
      name="weight"
      v-if="state.number"
    >
      <UBadge color="black">{{ state.number }}</UBadge>
    </UFormGroup>
    <UFormGroup
      :label="$t('Пасспорт')"
      name="client"
    >
      <USelectMenu
        v-model="state.client"
        :searchable="searchClient"
        option-attribute="name"
        trailing
        :disabled="disabled"
      >
        <template #label>
          <span class="truncate dark:text-white">{{ state.client?.fio ?? $t('Выберите пасспорт') }}</span>
        </template>
        <template #option="{ option }">
          {{ option.fio }} ({{ option.passport }}})
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup
      :label="$t('Вес')"
      name="weight"
    >
      <UInput
        v-model="state.weight"
        placeholder="0.00"
        :disabled="disabled"
      />
    </UFormGroup>

    <UFormGroup
      :label="$t('Фактическая цена')"
      name="facture_price"
    >
      <UInput
        v-model="state.facture_price"
        type="number"
        :disabled="disabled"
        placeholder="john.doe@example.com"
      />
    </UFormGroup>
    <div class="overflow-y-scroll" style="height: 400px">
      <UTable
        v-if="state.products && state.products.product_counts"
        :rows="Object.values(state.products.product_counts)"
        :columns="productColumns"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      />
    </div>
    <div
      v-if="!disabled"
      class="flex justify-between gap-3"
    >
      <UButton
        variant="ghost"
        :label="$t('Генерировать')"
        color="green"
        @click="generate_products"
      />
      <div>
        <UButton
          :label="$t('Закрить')"
          color="gray"
          variant="ghost"
          @click="emit('close')"
        />
        <UButton
          type="submit"
          :label="$t('Сохранить')"
          color="black"
        />
      </div>
    </div>
  </UForm>
</template>
