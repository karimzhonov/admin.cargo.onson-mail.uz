<template>
  <UDashboardNavbar
    :title="$t('Инвойси')"
    :badge="table.length"
  >
    <template #toggle>
      <UIcon
        name="i-heroicons-square-3-stack-3d-solid"
        class="w-5 h-5"
      />
    </template>
  </UDashboardNavbar>

  <UDashboardToolbar>
    <template #left>
      <UInput
        ref="input"
        v-model="q"
        icon="i-heroicons-funnel"
        autocomplete="off"
        placeholder="Filter users..."
        class="lg:block"
        @keydown.esc="$event.target.blur()"
      >
        <template #trailing>
          <UKbd value="/" />
        </template>
      </UInput>
    </template>
    <template #right>
      <USelectMenu
        v-model="selectedColumns"
        icon="i-heroicons-adjustments-horizontal-solid"
        :options="defaultColumns"
        multiple
        class="lg:block"
      >
        <template #label>
          Display
        </template>
      </USelectMenu>
    </template>
  </UDashboardToolbar>

  <UTable
    v-if="table.length > 0"
    v-model="selected"
    :rows="table"
    :columns="columns"
    class="w-full"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
  >
    <template #pdf-data="{ row }">
      <UButton
        icon="i-heroicons-document-arrow-down-16-solid"
        size="sm"
        color="primary"
        square
        variant="solid"
        @click="download(row)"
      />
    </template>
  </UTable>
</template>

<script lang="ts">
import { useIFetch } from '~/plugins/useIFetch'

export default {
  name: 'OrderTable',
  props: ['table'],
  data() {
    const defaultColumns = [{
      key: 'number',
      label: '#'
    }, {
      key: 'name',
      label: 'Name'
    }, {
      key: 'parts',
      label: 'Part'
    }, {
      key: 'client.fio',
      label: 'FIO'
    }, {
      key: 'client.pnfl',
      label: 'PNFL'
    }, {
      key: 'client.passport',
      label: 'Passport'
    }, {
      key: 'weight',
      label: 'Weight'
    }, {
      key: 'status',
      label: 'Status'
    }, {
      key: 'pdf',
      label: 'Actions'
    }]
    return {
      q: '',
      selectedColumns: defaultColumns,
      defaultColumns,
      selected: []
    }
  },
  computed: {
    columns() {
      return this.defaultColumns.filter(column => this.selectedColumns.includes(column))
    }
  },
  methods: {
    download(row) {
      useIFetch(`cargo/order/admin/order/${row.id}/pdf/`)
        .then(response => response.data.value)
        .then((blob: any) => {
          const url = window.URL.createObjectURL(blob)
          window.open(url, '_blank')
        })
    }
  }
}
</script>
