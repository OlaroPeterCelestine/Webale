<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedSupportTickets } from '../data/features'
function statusTheme(s: string) {
  if (s === 'Resolved') return 'green'
  if (s === 'Pending') return 'amber'
  return 'blue'
}
function priTheme(s: string) {
  if (s === 'High') return 'red'
  if (s === 'Medium') return 'amber'
  return 'gray'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Support tickets" />
    <Button variant="solid" icon-left="lucide-life-buoy" label="New ticket" @click="toast.success('Demo: ticket opened')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Tenant support queue for payouts, API, and onboarding issues.</p>
    <div class="webale-panel">
      <div v-for="t in scopedSupportTickets" :key="t.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ t.subject }}</p>
            <Badge :label="t.status" :theme="statusTheme(t.status)" variant="subtle" />
            <Badge :label="t.priority" :theme="priTheme(t.priority)" variant="subtle" />
          </div>
          <p class="text-xs text-ink-gray-5">{{ t.assignee }} · {{ t.updatedAt }}<template v-if="isPlatformView"> · {{ tenantName(t.tenantId) }}</template></p>
        </div>
        <Button label="Open" @click="toast.info('Demo: ticket thread')" />
      </div>
    </div>
  </div>
</template>
