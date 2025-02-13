<script setup lang="ts">
const route = useRoute()
const { isHelpSlideoverOpen } = useDashboard()
const i18n = useI18n()

let order_status = {
  departure_datetime: 'Yolga chiqdi',
  enter_uzb_datetime: 'UZBga keldi',
  process_customs_datetime: 'Tamojnada',
  process_local_datetime: 'Dastavkada',
  received_datetime: 'Yetkasib berildi'
}

order_status = Object.keys(order_status).reduce((acc: any, status: string) => {
  return [...acc, {
    label: order_status[status],
    to: `/orders?status=${status}`,
    exact: true
  }]
}, [])

const links = [{
  id: 'home',
  label: i18n.t('Главная страница'),
  icon: 'i-heroicons-home',
  to: '/',
  tooltip: {
    text: i18n.t('Главная страница'),
    shortcuts: ['G', 'H']
  }
}, {
  id: 'parts',
  label: i18n.t('Партия'),
  icon: 'i-heroicons-paper-airplane',
  to: '/inbox',
  // badge: '4',
  tooltip: {
    text: i18n.t('Партия'),
    shortcuts: ['G', 'I']
  }
}, {
  id: 'session',
  label: i18n.t('Qrcode Сессия'),
  icon: 'i-heroicons-arrow-down-on-square-stack',
  to: '/session',
  tooltip: {
    text: i18n.t('Qrcode Сессия'),
    shortcuts: ['G', 'U']
  }
}, {
  id: 'orders',
  label: i18n.t('Инвойси'),
  icon: 'i-heroicons-square-3-stack-3d-solid',
  children: order_status,
  tooltip: {
    text: i18n.t('Инвойси'),
    shortcuts: ['G', 'S']
  }
}]

const groups = [{
  key: 'links',
  label: 'Go to',
  commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
  key: 'code',
  label: 'Code',
  commands: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    click: () => {
      window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/v1/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
    }
  }]
}]

const localPath = useLocalePath()
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
          <NuxtLink
            :to="localPath('/')"
            class=" flex items-center gap-2"
          >
            <span class="flex">
              <img
                src="/logo.png"
                width="45"
                height="45"
                alt="logo"
              >
            </span>
            <span class="text-lg text-gray-700 dark:text-white">
              <p
                class="mb-0 font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#8cd66a]"
                style="line-height: 16px;"
              >ONSON MAIL</p>
              <p
                class="mb=0 font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#8cd66a]"
                style="font-size: 12px; line-height: 12px;"
              >CARGO ADMIN</p>
            </span>
          </NuxtLink>
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
