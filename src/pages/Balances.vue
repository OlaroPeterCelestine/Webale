<script setup lang="ts">
import { Badge, PageHeader, PageHeaderTitle, TabButtons } from 'frappe-ui'
import { computed, ref } from 'vue'
import { isPlatformView, scopedBalances, tenantName } from '../data/platform'
import StatCards from '../components/StatCards.vue'
import { scopedLedger } from '../data/features'

const tab = ref('wallets')
const tabs = [
  { label: 'Wallets', value: 'wallets' },
  { label: 'Ledger', value: 'ledger' },
]

const stats = computed(() => {
  const rows = scopedBalances.value
  return [
    { title: 'Wallets', value: rows.length, caption: 'currencies' },
    { title: 'Collection', value: Math.round(rows.reduce((n, b) => n + b.collection, 0) / 1_000_000), suffix: 'M UGX' },
    { title: 'Payout', value: Math.round(rows.reduce((n, b) => n + b.payout, 0) / 1_000_000), suffix: 'M UGX' },
    { title: 'Pending', value: Math.round(rows.reduce((n, b) => n + b.pendingSettlement, 0) / 1_000_000), suffix: 'M UGX' },
  ]
})

</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Balances" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <StatCards :stats="stats" />

    <p class="text-p-base text-ink-gray-6">
      Collection vs payout wallets plus the wallet ledger for credits and
      debits.
    </p>
    <TabButtons v-model="tab" :options="tabs" />

    <section v-if="tab === 'wallets'" class="webale-section">
      <div class="webale-panel">
        <div v-for="b in scopedBalances" :key="b.id" class="webale-panel-row">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ b.currency }}</p>
              <Badge
                v-if="isPlatformView"
                :label="tenantName(b.tenantId)"
                theme="gray"
                variant="subtle"
              />
            </div>
            <p class="text-xs text-ink-gray-5">
              Pending settlement {{ b.pendingSettlement.toLocaleString() }}
            </p>
          </div>
          <div class="text-end text-sm">
            <p class="text-sm-medium">
              Collection {{ b.collection.toLocaleString() }}
            </p>
            <p class="text-ink-gray-5">
              Payout {{ b.payout.toLocaleString() }}
            </p>
          </div>
        </div>
        <p
          v-if="!scopedBalances.length"
          class="px-4 py-10 text-center text-sm text-ink-gray-5"
        >
          No balances in scope.
        </p>
      </div>
    </section>

    <section v-else class="webale-section">
      <div class="webale-panel">
        <div
          v-for="e in scopedLedger"
          :key="e.id"
          class="webale-panel-row items-center"
        >
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ e.narration }}</p>
              <Badge :label="e.wallet" theme="blue" variant="subtle" />
              <Badge
                :label="e.type"
                :theme="e.type === 'Credit' ? 'green' : 'amber'"
                variant="subtle"
              />
            </div>
            <p class="text-xs text-ink-gray-5">
              {{ e.createdAt }}
              <template v-if="isPlatformView">
                · {{ tenantName(e.tenantId) }}
              </template>
            </p>
          </div>
          <p
            class="text-sm-medium"
            :class="e.type === 'Credit' ? 'text-green-700' : 'text-ink-gray-9'"
          >
            {{ e.type === 'Credit' ? '+' : '−' }}{{ e.currency }}
            {{ e.amount.toLocaleString() }}
          </p>
        </div>
        <p
          v-if="!scopedLedger.length"
          class="px-4 py-10 text-center text-sm text-ink-gray-5"
        >
          No ledger entries.
        </p>
      </div>
    </section>
  </div>
</template>
