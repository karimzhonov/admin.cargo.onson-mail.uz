<template>
  <with-navbar>
    <UDashboardPage>
      <UDashboardPanel grow>
        <OrderTableView
          :key="useRoute().query.status"
          :status="useRoute().query.status ?? '0'"
        />
      </UDashboardPanel>
    </UDashboardPage>
  </with-navbar>
</template>
