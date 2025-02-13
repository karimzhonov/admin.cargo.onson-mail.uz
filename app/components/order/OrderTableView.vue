<template>
  <OrderTable :table="table" />
</template>

<script>
import { useIFetch } from '~/plugins/useIFetch.js'

export default {
  name: 'OrderTableView',
  // eslint-disable-next-line vue/require-prop-types
  props: ['status'],
  data() {
    return {
      table: []
    }
  },
  async mounted() {
    const response = await useIFetch('cargo/order/admin/order/', { query: { status: this.status } })
    this.table = response.data.value
  }
}
</script>
