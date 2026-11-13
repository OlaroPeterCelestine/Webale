<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  Button,
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
  type Transaction,
} from '../data/platform'
import StatCards from '../components/StatCards.vue'
import { txnTimelines } from '../data/features'

const tab = ref('all')

const stats = computed(() => {
  const rows = scopedTransactions.value
  const ok = rows.filter((t) => t.status === 'Successful')
  const vol = ok.reduce((n, t) => n + t.amount, 0)
  return [
    { title: 'Transactions', value: rows.length, caption: 'in scope' },
    { title: 'Successful', value: ok.length, caption: 'paid' },
    { title: 'Pending', value: rows.filter((t) => t.status === 'Pending').length },
    { title: 'Volume', value: Math.round(vol / 1000), suffix: 'K UGX', caption: 'successful' },
  ]
})

const query = ref('')
const selected = ref<Transaction | null>(null)

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

const timeline = computed(
  () => txnTimelines.default,
)

function statusTheme(status: string) {
  if (status === 'Successful') return 'green'
  if (status === 'Pending') return 'amber'
  if (status === 'Failed') return 'red'
  return 'gray'
}

function openDetail(txn: Transaction) {
  selected.value = txn
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Transactions" />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <StatCards :stats="stats" />

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

    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="webale-section">
        <div class="webale-panel">
          <button
            v-for="txn in filtered"
            :key="txn.id"
            type="button"
            class="webale-panel-row w-full text-start"
            :class="
              selected?.id === txn.id
                ? 'bg-surface-gray-1'
                : 'hover:bg-surface-gray-1'
            "
            @click="openDetail(txn)"
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
          </button>
          <p
            v-if="!filtered.length"
            class="px-4 py-12 text-center text-sm text-ink-gray-5"
          >
            No transactions for this filter.
          </p>
        </div>
      </section>

      <aside class="webale-card space-y-4 lg:sticky lg:top-4 lg:self-start">
        <template v-if="selected">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-wide text-ink-gray-5">
                Transaction detail
              </p>
              <p class="text-base font-semibold text-ink-gray-9">
                {{ selected.reference }}
              </p>
            </div>
            <Button label="Close" @click="selected = null" />
          </div>
          <div class="space-y-1 text-sm">
            <p>
              <span class="text-ink-gray-5">Amount</span>
              {{ selected.currency }} {{ selected.amount.toLocaleString() }}
            </p>
            <p>
              <span class="text-ink-gray-5">Customer</span>
              {{ selected.customer }}
            </p>
            <p>
              <span class="text-ink-gray-5">Channel</span>
              {{ selected.channel }}
            </p>
            <p>
              <span class="text-ink-gray-5">Status</span>
              {{ selected.status }}
            </p>
            <p>
              <span class="text-ink-gray-5">Created</span>
              {{ selected.createdAt }}
            </p>
          </div>
          <div>
            <p class="mb-2 text-sm-semibold">Timeline</p>
            <ol class="space-y-3 border-s border-outline-gray-2 ps-3">
              <li v-for="(ev, i) in timeline" :key="i" class="relative">
                <span
                  class="absolute -start-[0.41rem] top-1 size-2 rounded-full bg-teal-600"
                />
                <p class="text-sm-medium">{{ ev.label }}</p>
                <p class="text-xs text-ink-gray-5">
                  {{ ev.at }} · {{ ev.detail }}
                </p>
              </li>
            </ol>
          </div>
        </template>
        <p v-else class="text-sm text-ink-gray-5">
          Select a transaction to view the detail timeline.
        </p>
      </aside>
    </div>
  </div>
</template>
