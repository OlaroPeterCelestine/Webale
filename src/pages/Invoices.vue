<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedInvoices } from '../data/features'
function theme(s: string) {
  if (s === 'Paid') return 'green'
  if (s === 'Sent') return 'blue'
  if (s === 'Overdue') return 'red'
  return 'gray'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Invoices" />
    <Button variant="solid" icon-left="lucide-file-plus" label="Create invoice" @click="toast.success('Demo: invoice drafted')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Bill customers and collect via hosted invoice checkout.</p>
    <div class="webale-panel">
      <div v-for="inv in scopedInvoices" :key="inv.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ inv.id }}</p>
            <Badge :label="inv.status" :theme="theme(inv.status)" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">{{ inv.customer }} · due {{ inv.due }}</p>
          <p v-if="isPlatformView" class="text-xs text-ink-gray-5">{{ tenantName(inv.tenantId) }}</p>
        </div>
        <p class="text-sm-medium">{{ inv.currency }} {{ inv.amount.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
