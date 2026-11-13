<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, FormControl, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { isPlatformView, scopedCustomers, tenantName } from '../data/platform'
import StatCards from '../components/StatCards.vue'

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return scopedCustomers.value
  return scopedCustomers.value.filter((c) =>
    [c.name, c.email, c.phone, tenantName(c.tenantId)].join(' ').toLowerCase().includes(q),
  )
})

const stats = computed(() => {
  const rows = scopedCustomers.value
  return [
    { title: 'Customers', value: rows.length, caption: 'in scope' },
    { title: 'Active', value: rows.filter((c) => c.status === 'Active').length },
    { title: 'Blocked', value: rows.filter((c) => c.status === 'Blocked').length },
    { title: 'Volume', value: Math.round(rows.reduce((n, c) => n + c.volume, 0) / 1000), suffix: 'K UGX' },
  ]
})

</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Customers" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <StatCards :stats="stats" />

    <p class="text-p-base text-ink-gray-6">Payers across tenants — volume, contact and block status.</p>
    <FormControl v-model="query" class="max-w-md" label="Search" placeholder="Name, email, phone…" />
    <section class="webale-section">
      <div class="webale-panel">
        <div v-for="c in filtered" :key="c.id" class="webale-panel-row items-center">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ c.name }}</p>
              <Badge :label="c.status" :theme="c.status === 'Active' ? 'green' : 'red'" variant="subtle" />
            </div>
            <p class="text-sm text-ink-gray-7">{{ c.email }} · {{ c.phone }}</p>
            <p class="text-xs text-ink-gray-5">
              <template v-if="isPlatformView">{{ tenantName(c.tenantId) }} · </template>{{ c.country }} · {{ c.payments }} payments
            </p>
          </div>
          <p class="text-sm-medium">{{ c.currency }} {{ c.volume.toLocaleString() }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
