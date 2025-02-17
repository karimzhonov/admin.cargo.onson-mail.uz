<template>
    <UDashboardPage>
      <UDashboardPanel grow>
        <OrderTableView
          :key="useRoute().query.status_"
          :status="useRoute().query.status_ ?? '0'"
        />
      </UDashboardPanel>
    </UDashboardPage>
</template>
