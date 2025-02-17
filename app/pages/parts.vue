<script lang="ts">
export default {
  name: 'Parts',
  data() {
    return {
      parts: [],
      selectedPart: null,
      tabs: [
        { label: 'Не доставлен', value: false },
        { label: 'Доставлен', value: true }
      ],
      selectedTab: 0
    }
  },
  computed: {
    isOrderPanelOpen: {
      get() {
        return !!this.selectedPart
      },
      set(value: boolean) {
        if (!value) {
          this.selectedPart = null
        }
      }
    }
  },
  watch: {
    selectedTab() {
      this.fetch_parts()
    }
  },
  async mounted() {
    await this.fetch_parts()
  },
  methods: {
    async fetch_parts() {
      const { data } = await this.$api('cargo/order/admin/part/', { query: { ended: this.tabs[this.selectedTab].value } })
      this.parts = data.value
    }
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel
      :width="500"
    >
      <UDashboardNavbar
        :title="$t('Партия')"
        :badge="parts.length"
      >
        <template #right>
          <UButton :label="$t('Создать')" />
        </template>
      </UDashboardNavbar>
      <UTabs
        v-model="selectedTab"
        class="sticky top-0"
        :items="tabs"
        :ui="{ wrapper: '', list: { height: 'h-9', tab: { height: 'h-7', size: 'text-[13px]' } } }"
      />
      <!-- ~/components/inbox/InboxList.vue -->
      <PartsList
        v-model="selectedPart"
        :parts="parts"
      />
    </UDashboardPanel>

    <UDashboardPanel
      v-model="isOrderPanelOpen"
      collapsible
      grow
      side="right"
    >
      <template v-if="selectedPart">
        <OrderTableView
          :key="selectedPart.number"
          :part_number="selectedPart.number"
        />
      </template>
      <div
        v-else
        class="flex-1 hidden lg:flex items-center justify-center"
      >
        <UIcon
          name="i-heroicons-inbox"
          class="w-32 h-32 text-gray-400 dark:text-gray-500"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>
