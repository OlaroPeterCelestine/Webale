<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedBeneficiaries } from '../data/features'
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Beneficiaries" />
    <div class="flex flex-wrap gap-2">
      <Button icon-left="lucide-upload" label="Bulk CSV" @click="toast.success('Demo: bulk beneficiaries queued')" />
      <Button variant="solid" icon-left="lucide-user-plus" label="Add beneficiary" @click="toast.success('Demo: beneficiary saved')" />
    </div>
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Saved payout destinations for single and bulk transfers.</p>
    <div class="webale-panel">
      <div v-for="b in scopedBeneficiaries" :key="b.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ b.name }}</p>
            <Badge :label="b.channel" theme="blue" variant="subtle" />
            <Badge :label="b.status" :theme="b.status === 'Active' ? 'green' : 'gray'" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">{{ b.destination }} · {{ b.currency }}</p>
          <p v-if="isPlatformView" class="text-xs text-ink-gray-5">{{ tenantName(b.tenantId) }}</p>
        </div>
        <Button label="Pay" @click="toast.success('Demo: transfer to beneficiary queued')" />
      </div>
    </div>
  </div>
</template>
