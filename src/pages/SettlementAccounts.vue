<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedSettlementAccounts } from '../data/features'
function theme(s: string) {
  if (s === 'Verified') return 'green'
  if (s === 'Pending') return 'amber'
  return 'red'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Settlement accounts" />
    <Button variant="solid" icon-left="lucide-plus" label="Add account" @click="toast.success('Demo: settlement account submitted')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Bank accounts used for payouts and settlement batches.</p>
    <div class="webale-panel">
      <div v-for="a in scopedSettlementAccounts" :key="a.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ a.bank }} · {{ a.accountNumber }}</p>
            <Badge :label="a.status" :theme="theme(a.status)" variant="subtle" />
            <Badge v-if="a.primary" label="Primary" theme="blue" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">{{ a.accountName }} · {{ a.currency }}</p>
          <p v-if="isPlatformView" class="text-xs text-ink-gray-5">{{ tenantName(a.tenantId) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
