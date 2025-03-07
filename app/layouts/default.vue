<script lang="ts">

export default {
  name: 'Default',
  computed: {
    groups() {
      return [{
        key: 'links',
        label: 'Go to',
        commands: this.links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
      }]
    },
    links() {
      return [
        {
          id: 'home',
          label: this.$t('Главная страница'),
          icon: 'i-heroicons-home',
          to: this.localPath('/'),
          tooltip: {
            text: this.$t('Главная страница'),
            shortcuts: ['G', 'H']
          }
        }, {
          id: 'parts',
          label: this.$t('Партия'),
          icon: 'i-heroicons-paper-airplane',
          to: this.localPath('/parts'),
          // badge: '4',
          tooltip: {
            text: this.$t('Партия'),
            shortcuts: ['G', 'I']
          }
        }, {
          id: 'session',
          label: this.$t('Qrcode Сессия'),
          icon: 'i-heroicons-arrow-down-on-square-stack',
          to: this.localPath('/session'),
          tooltip: {
            text: this.$t('Qrcode Сессия'),
            shortcuts: ['G', 'U']
          }
        }, {
          id: 'orders',
          label: this.$t('Инвойси'),
          icon: 'i-heroicons-square-3-stack-3d-solid',
          collapsible: true,
          children: Object.keys(statuses.value).reduce((acc: any, s: string) => {
            return [...acc, {
              label: statuses.value[s].name,
              to: `/orders?status_=${s}`,
              exact: true
            }]
          }, []),
          tooltip: {
            text: this.$t('Инвойси'),
            shortcuts: ['G', 'S']
          }
        }]
    }
  },
  async mounted() {
    const { data } = await this.$api(`/cargo/order/status/`)
    statuses.value = data.value
  },
  methods: {
    localPath: useLocalePath()
  }
}
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton :label="$t('Поиск')" />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
