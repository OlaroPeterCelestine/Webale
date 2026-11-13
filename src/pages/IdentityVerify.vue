<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedIdentityChecks } from '../data/features'
function theme(s: string) {
  if (s === 'Matched') return 'green'
  if (s === 'Pending') return 'amber'
  return 'red'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Identity verify" />
    <Button variant="solid" icon-left="lucide-scan-face" label="Run check" @click="toast.success('Demo: NIN/BVN check queued')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">BVN, NIN, and passport verification for KYC and payouts.</p>
    <div class="webale-panel">
      <div v-for="c in scopedIdentityChecks" :key="c.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ c.subject }}</p>
            <Badge :label="c.type" theme="blue" variant="subtle" />
            <Badge :label="c.status" :theme="theme(c.status)" variant="subtle" />
          </div>
          <p class="font-mono text-xs text-ink-gray-5">{{ c.reference }}</p>
          <p class="text-xs text-ink-gray-5">{{ c.checkedAt }}<template v-if="isPlatformView"> · {{ tenantName(c.tenantId) }}</template></p>
        </div>
      </div>
    </div>
  </div>
</template>
