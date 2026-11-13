<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, scopedTransfers, tenantName } from '../data/platform'

function theme(s: string) {
  if (s === 'Successful') return 'green'
  if (s === 'Pending') return 'amber'
  return 'red'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Transfers" />
    <Button variant="solid" icon-left="lucide-send" label="New transfer" @click="toast.success('Demo: transfer initiated')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Outbound payouts to bank or mobile money beneficiaries.</p>
    <section class="webale-section">
      <div class="webale-panel">
        <div v-for="t in scopedTransfers" :key="t.id" class="webale-panel-row items-center">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ t.reference }}</p>
              <Badge :label="t.channel" theme="blue" variant="subtle" />
              <Badge :label="t.status" :theme="theme(t.status)" variant="subtle" />
            </div>
            <p class="text-sm text-ink-gray-7">{{ t.beneficiary }}</p>
            <p class="text-xs text-ink-gray-5">
              <template v-if="isPlatformView">{{ tenantName(t.tenantId) }} · </template>{{ t.createdAt }}
            </p>
          </div>
          <p class="text-sm-medium">{{ t.currency }} {{ t.amount.toLocaleString() }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
