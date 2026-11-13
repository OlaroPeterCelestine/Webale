<script setup lang="ts">
import { NumberCard } from 'frappe-ui/charts'

export type StatCard = {
  title: string
  value: number
  caption?: string
  suffix?: string
  delta?: number | null
  negativeIsBetter?: boolean
}

defineProps<{
  stats: StatCard[]
}>()
</script>

<template>
  <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
    <NumberCard
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :suffix="stat.suffix"
      :delta="stat.delta ?? null"
      :delta-caption="stat.caption || ''"
      :negative-is-better="stat.negativeIsBetter"
    />
  </div>
</template>
