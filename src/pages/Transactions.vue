<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
} from 'frappe-ui'
import {
  currentTenant,
  isPlatformView,
  scopedTransactions,
  tenantName,
} from '../data/platform'

const tab = ref('all')
const query = ref('')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Successful', value: 'Successful' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return scopedTransactions.value.filter((t) => {
    if (tab.value !== 'all' && t.status !== tab.value) return false
    if (!q) return true
    return [t.reference, t.customer, t.email, t.channel, tenantName(t.tenantId)]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function statusTheme(status: string) {
  if (status === 'Successful') return 'green'
  if (status === 'Pending') return 'amber'
  if (status === 'Failed') return 'red'
  return 'gray'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Transactions" />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      {{
        isPlatformView
          ? 'All tenants · filtered by Live/Test toggle in the top bar.'
          : `${currentTenant?.name} · ${currentTenant?.slug}`
      }}
    </p>

    <section class="webale-section">
      <TabButtons v-model="tab" :options="tabs" />
      <FormControl
        v-model="query"
        class="max-w-md"
        label="Search"
        placeholder="Reference, customer, tenant…"
      />
    </section>

    <section class="webale-section">
      <div class="webale-panel">
        <div
          v-for="txn in filtered"
          :key="txn.id"
          class="webale-panel-row"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium text-ink-gray-9">{{ txn.reference }}</p>
              <Badge
                :label="txn.status"
                :theme="statusTheme(txn.status)"
                variant="subtle"
              />
              <Badge :label="txn.channel" theme="blue" variant="subtle" />
            </div>
            <p class="text-sm text-ink-gray-7">
              {{ txn.customer }} · {{ txn.email }}
            </p>
            <p class="text-xs text-ink-gray-5">
              <template v-if="isPlatformView"
                >{{ tenantName(txn.tenantId) }} ·
              </template>
              {{ txn.createdAt }} · {{ txn.id }}
            </p>
          </div>
          <p class="text-sm-medium text-ink-gray-9">
            {{ txn.currency }} {{ txn.amount.toLocaleString() }}
          </p>
        </div>
        <p
          v-if="!filtered.length"
          class="px-4 py-12 text-center text-sm text-ink-gray-5"
        >
          No transactions for this filter.
        </p>
      </div>
    </section>
  </div>
</template>
