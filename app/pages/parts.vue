<script lang="ts">

export default {
  name: 'Parts',
  data() {
    return {
      parts: [],
      selectedPart: null,
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
  async mounted() {
    const {data} = await this.$api('cargo/order/admin/part/')
    this.parts = data.value

  }
}
</script>

<template>
  <WithNavbar>
  <UDashboardPage>
    <UDashboardPanel :width="400" :resizable="{ min: 300, max: 500 }">
      <UDashboardNavbar :title="$t('Партия')" :badge="parts.length">
        <template #right>
          <UButton :label="$t('Создать')" />
        </template>
      </UDashboardNavbar>

      <!-- ~/components/inbox/InboxList.vue -->
      <PartsList v-model="selectedPart" :parts="parts" />
    </UDashboardPanel>

    <UDashboardPanel v-model="isOrderPanelOpen" collapsible grow side="right">
      <template v-if="selectedPart">
        orders
      </template>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</WithNavbar>
</template>
