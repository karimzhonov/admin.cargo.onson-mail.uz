<template>
  <with-navbar>
    <UDashboardPage>
      <UDashboardPanel grow>
        <OrderTable :table="table" />
      </UDashboardPanel>
    </UDashboardPage>
  </with-navbar>
</template>

<script>
import { get_ws_api } from '~/utils.js'

export default {
  name: 'Session',
  data() {
    return {
      table: []
    }
  },

  async mounted() {
    const ws = new WebSocket(`${get_ws_api}cargo/order/admin/qrcode-session/?token=${token.value.access}`)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.table = [data, ...this.table]
    }
  }
}
</script>
