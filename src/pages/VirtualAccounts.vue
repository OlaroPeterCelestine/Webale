<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedVirtualAccounts } from '../data/features'
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Virtual accounts" />
    <Button variant="solid" icon-left="lucide-landmark" label="Issue VA" @click="toast.success('Demo: virtual account issued')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Dedicated bank accounts for inbound collections per tenant.</p>
    <div class="webale-panel">
      <div v-for="v in scopedVirtualAccounts" :key="v.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ v.accountName }}</p>
            <Badge :label="v.status" :theme="v.status === 'Active' ? 'green' : 'gray'" variant="subtle" />
          </div>
          <p class="font-mono text-sm text-ink-gray-7">{{ v.accountNumber }}</p>
          <p class="text-xs text-ink-gray-5">{{ v.bank }} · {{ v.currency }}<template v-if="isPlatformView"> · {{ tenantName(v.tenantId) }}</template></p>
        </div>
      </div>
    </div>
  </div>
</template>
