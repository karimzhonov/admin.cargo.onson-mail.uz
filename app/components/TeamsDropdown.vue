<script setup lang="ts">
import { useIFetch } from '~/plugins/useIFetch'
import company from '~/composables/company'

const teams = ref([])

onMounted(async () => {
  const { data } = await useIFetch(('company/company/'))
  teams.value = data.value
  company.value = teams.value[0]
})

// const actions = [{
//   label: 'Create team',
//   icon: 'i-heroicons-plus-circle'
// }, {
//   label: 'Manage teams',
//   icon: 'i-heroicons-cog-8-tooth'
// }]

const team = computed(() => company.value)
</script>

<template>
  <UDropdown
    mode="hover"
    :items="[teams]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar
        :src="team.img"
        size="md"
      />
      <span class="mb-0 font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#8cd66a]">{{ team.name }}</span>
    </UButton>
    <template #item="{ item }">
      <UAvatar
        :src="item.img"
        size="2xs"
      />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{ item.name }}</span>
    </template>
  </UDropdown>
</template>
