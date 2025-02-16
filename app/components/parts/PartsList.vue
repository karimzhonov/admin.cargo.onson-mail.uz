<script setup lang="ts">
import { format, isToday } from 'date-fns'

const props = defineProps({
  modelValue: {
    type: Object as PropType<any | null>,
    default: null
  },
  parts: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const partsRefs = ref<Element[]>([])

const selectedPart = computed({
  get() {
    return props.modelValue
  },
  set(value: any | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedPart, () => {
  if (!selectedPart.value) {
    return
  }

  const ref = partsRefs.value[selectedPart.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.parts.findIndex(part => part.id === selectedPart.value?.id)

    if (index === -1) {
      selectedPart.value = props.parts[0]
    } else if (index < props.parts.length - 1) {
      selectedPart.value = props.parts[index + 1]
    }
  },
  arrowup: () => {
    const index = props.parts.findIndex(part => part.id === selectedPart.value?.id)

    if (index === -1) {
      selectedPart.value = props.parts[props.parts.length - 1]
    } else if (index > 0) {
      selectedPart.value = props.parts[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0 overflow-y-scroll">
    <div
      v-for="(part, index) in parts"
      :key="index"
      :ref="el => { partsRefs[part.id] = el as Element }"
    >
      <div
        class="p-4 text-sm cursor-pointer border-l-2"
        :class="[
          part.status == 'process_received_datetime' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
          selectedPart && selectedPart.id === part.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
        ]"
        @click="selectedPart = part"
      >
        <div
          class="flex items-center justify-between"
          :class="[part.status !== 'process_received_datetime' && 'font-semibold']"
        >
          <div class="flex items-center gap-3">
            {{ part.number }} - {{ $t('Партия') }}
            <UBadge v-if="part.status == 'process_received_datetime'">{{ $t('Доставлен') }}</UBadge>
          </div>

          <span v-if="part.date">{{ isToday(new Date(part.date)) ? format(new Date(part.date), 'HH:mm') : format(new Date(part.date), 'dd MMM') }}</span>
        </div>
        <p :class="[part.status == 'process_received_datetime' && 'font-semibold']">
          {{ part.country.name }} <UBadge color="orange">{{ part.country.code }}</UBadge>
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
