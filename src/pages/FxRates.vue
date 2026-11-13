<script setup lang="ts">
import { PageHeader, PageHeaderTitle, Button, toast } from 'frappe-ui'
import { fxRates } from '../data/features'
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="FX rates" />
    <Button icon-left="lucide-refresh-cw" label="Refresh" @click="toast.success('Demo: FX book refreshed')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Multi-currency ledger mid-market buy/sell for conversions and settlements.</p>
    <div class="webale-panel">
      <div v-for="r in fxRates" :key="r.id" class="webale-panel-row items-center">
        <div>
          <p class="text-sm-medium">{{ r.pair }}</p>
          <p class="text-xs text-ink-gray-5">Updated {{ r.updatedAt }}</p>
        </div>
        <div class="text-end text-sm">
          <p>Buy {{ r.buy.toLocaleString() }}</p>
          <p class="text-ink-gray-5">Sell {{ r.sell.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
