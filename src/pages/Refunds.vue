<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, scopedRefunds, tenantName } from '../data/platform'

function theme(s: string) {
  if (s === 'Completed') return 'green'
  if (s === 'Pending') return 'amber'
  return 'red'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Refunds" />
    <Button variant="solid" icon-left="lucide-undo-2" label="Issue refund" @click="toast.success('Demo: refund queued')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Single and bulk refunds against successful charges.</p>
    <section class="webale-section">
      <div class="webale-panel">
        <div v-for="r in scopedRefunds" :key="r.id" class="webale-panel-row items-center">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ r.reference }}</p>
              <Badge :label="r.status" :theme="theme(r.status)" variant="subtle" />
            </div>
            <p class="text-sm text-ink-gray-7">{{ r.reason }}</p>
            <p class="text-xs text-ink-gray-5">
              <template v-if="isPlatformView">{{ tenantName(r.tenantId) }} · </template>{{ r.createdAt }}
            </p>
          </div>
          <p class="text-sm-medium">{{ r.currency }} {{ r.amount.toLocaleString() }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
