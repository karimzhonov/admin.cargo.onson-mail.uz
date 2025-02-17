<template>
  <UDashboardNavbar
    :title="$t('Инвойси')"
  >
    <template #badge>
      <UBadge
        v-if="status"
        class="mr-3"
        :color="statuses[status].color"
      >
        {{ statuses[status].name }}
      </UBadge>
      <UBadge
        v-if="table.length > 0"
        color="orange"
      >
        {{ table.length }}
      </UBadge>
    </template>
    <template #right v-if="part_number">
      <UButton
        :label="$t('Добавить')"
        @click="isModalOpen=true"
      />
    </template>
    <template
      v-if="!status"
      #toggle
    >
      <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
    </template>
  </UDashboardNavbar>
  <OrderTable
    :table="table"
    :part_number="part_number"
  />
  <UDashboardModal
    v-if="part_number"
    v-model="isModalOpen"
    :title="$t('Новый инвойс')"
    :ui="{ width: 'sm:max-w-l' }"
  >
    <!-- ~/components/users/UsersForm.vue -->
    <OrderForm
      :initial="{}"
      :part_number="part_number"
      @close="modalClose"
    />
  </UDashboardModal>
</template>

<script>
import { useIFetch } from '~/plugins/useIFetch.js'

export default {
  name: 'OrderTableView',
  // eslint-disable-next-line vue/require-prop-types,vue/prop-name-casing
  props: ['status', 'part_number'],
  data() {
    return {
      isModalOpen: false,
      table: []
    }
  },
  async mounted() {
    await this.fetch_table()
  },
  methods: {
    async fetch_table() {
      const { data } = await useIFetch('cargo/order/admin/order/', { query: { status_: this.status, parts: this.part_number } })
      this.table = data.value
    },
    async modalClose() {
      this.isModalOpen = false
      await this.fetch_table()
    }
  }
}
</script>
