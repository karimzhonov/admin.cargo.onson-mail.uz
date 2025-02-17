<template>
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
    :rows="table"
    :columns="columns"
    class="w-full"
    :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
  >
    <template #status-data="{ row }">
      <UBadge
        class="mr-3"
        :color="statuses[row.status].color"
      >
        {{ statuses[row.status].name }}
      </UBadge>
    </template>
    <template #number-data="{ row }">
      <div @click="row_click(row)" class="cursor-pointer">
        <UBadge color="black">{{ row.number }}</UBadge>
      </div>
    </template>
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
  <UDashboardModal
    v-model="isModalOpen"
    :title="$t('Изменить инвойс')"
    :ui="{ width: 'sm:max-w-l' }"
  >
    <template #title>
      {{ $t('Изменить инвойс') }}:  <UBadge color="black">
        {{ selected.number }}
      </UBadge>
    </template>
    <!-- ~/components/users/UsersForm.vue -->
    <OrderForm
      :initial="selected"
      @close="isModalOpen = false"
    />
  </UDashboardModal>
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
      selectedColumns: [
        defaultColumns[0], defaultColumns[1], defaultColumns[2], defaultColumns[5], defaultColumns[6], defaultColumns[7]
      ],
      defaultColumns,
      selected: {},
      isModalOpen: false
    }
  },
  computed: {
    columns() {
      return this.defaultColumns.filter(column => this.selectedColumns.includes(column))
    }
  },
  methods: {
    download(row: any) {
      useIFetch(`cargo/order/admin/order/${row.id}/xlsx/`)
        .then((response) => {
          const blob = response.data.value
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `Invoice_${row.number}.xlsx`
          link.click()
        })
    },
    row_click(row: any) {
      this.selected = row
      this.isModalOpen = true
    }
  }
}
</script>
