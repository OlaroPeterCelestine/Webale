<script setup lang="ts">
import { Badge, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { isPlatformView, scopedBalances, tenantName } from '../data/platform'
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Balances" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Collection vs payout wallets per currency — settle or transfer from payout.
    </p>
    <section class="webale-section">
      <div class="webale-panel">
        <div v-for="b in scopedBalances" :key="b.id" class="webale-panel-row">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ b.currency }}</p>
              <Badge v-if="isPlatformView" :label="tenantName(b.tenantId)" theme="gray" variant="subtle" />
            </div>
            <p class="text-xs text-ink-gray-5">Pending settlement {{ b.pendingSettlement.toLocaleString() }}</p>
          </div>
          <div class="text-end text-sm">
            <p class="text-sm-medium">Collection {{ b.collection.toLocaleString() }}</p>
            <p class="text-ink-gray-5">Payout {{ b.payout.toLocaleString() }}</p>
          </div>
        </div>
        <p v-if="!scopedBalances.length" class="px-4 py-10 text-center text-sm text-ink-gray-5">No balances in scope.</p>
      </div>
    </section>
  </div>
</template>
