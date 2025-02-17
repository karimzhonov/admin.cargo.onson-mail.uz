<script lang="ts">

export default {
  name: 'Settings',
  data() {
    return {
      links: [[{
        label: this.$t('Оснавной'),
        icon: 'i-heroicons-user-circle',
        to: '/settings',
        exact: true
      }], []]
    }
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Settings"/>

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links"/>
      </UDashboardToolbar>

      <NuxtPage/>
    </UDashboardPanel>
  </UDashboardPage>
</template>
