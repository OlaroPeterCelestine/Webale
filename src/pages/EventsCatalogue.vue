<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, FormControl, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { apiEvents } from '../data/features'
const q = ref('')
const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return apiEvents
  return apiEvents.filter((e) => [e.name, e.description, e.category].join(' ').toLowerCase().includes(s))
})
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Event catalogue" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Searchable webhook / API event reference for integrators.</p>
    <FormControl v-model="q" class="max-w-md" label="Search events" placeholder="charge, refund, kyc…" />
    <div class="webale-panel">
      <div v-for="e in filtered" :key="e.name" class="webale-panel-row">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-mono text-sm-medium">{{ e.name }}</p>
            <Badge :label="e.category" theme="blue" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-6">{{ e.description }}</p>
        </div>
      </div>
      <p v-if="!filtered.length" class="px-4 py-8 text-center text-sm text-ink-gray-5">No events match.</p>
    </div>
  </div>
</template>
