<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import {
  isPlatformView,
  scopedSettlements,
  tenantName,
} from '../data/platform'

function statusTheme(status: string) {
  if (status === 'Paid') return 'green'
  if (status === 'Processing') return 'blue'
  return 'amber'
}

const stats = computed(() => {
  const rows = scopedSettlements.value
  const paid = rows.filter((s) => s.status === 'Paid')
  return [
    { title: 'Settlements', value: rows.length, caption: 'batches' },
    { title: 'Paid', value: paid.length },
    { title: 'Queued', value: rows.filter((s) => s.status === 'Queued').length },
    { title: 'Paid volume', value: Math.round(paid.reduce((n, s) => n + s.amount, 0) / 1_000_000), suffix: 'M UGX' },
  ]
})

</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Settlements" />
    <Button
      variant="solid"
      icon-left="lucide-banknote"
      label="Run payout batch"
      @click="toast.success('Demo: settlement batch queued')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <StatCards :stats="stats" />

    <p class="text-p-base text-ink-gray-6">
      Tenant payouts to settlement accounts (T+1 / T+2).
    </p>

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="s in scopedSettlements"
        :key="s.id"
        class="flex flex-wrap items-center justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <div>
          <p class="text-sm-medium text-ink-gray-9">
            {{ isPlatformView ? tenantName(s.tenantId) : s.id }}
          </p>
          <p class="text-xs text-ink-gray-5">{{ s.id }} · due {{ s.due }}</p>
        </div>
        <div class="flex items-center gap-3">
          <p class="text-sm-medium">
            {{ s.currency }} {{ s.amount.toLocaleString() }}
          </p>
          <Badge
            :label="s.status"
            :theme="statusTheme(s.status)"
            variant="subtle"
          />
        </div>
      </div>
    </div>
  </div>
</template>
