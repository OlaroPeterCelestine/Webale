<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedSubscriptions } from '../data/features'
function theme(s: string) {
  if (s === 'Active') return 'green'
  if (s === 'Past due') return 'amber'
  return 'red'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Subscriptions" />
    <Button variant="solid" icon-left="lucide-repeat" label="New plan" @click="toast.success('Demo: subscription plan created')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Recurring billing plans, renewals, and past-due recovery.</p>
    <div class="webale-panel">
      <div v-for="s in scopedSubscriptions" :key="s.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ s.plan }}</p>
            <Badge :label="s.status" :theme="theme(s.status)" variant="subtle" />
            <Badge :label="s.interval" theme="blue" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">{{ s.customer }} · next {{ s.nextBilling }}</p>
          <p v-if="isPlatformView" class="text-xs text-ink-gray-5">{{ tenantName(s.tenantId) }}</p>
        </div>
        <p class="text-sm-medium">{{ s.currency }} {{ s.amount.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>
