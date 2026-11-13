<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { isPlatformView, tenantName } from '../data/platform'
import { scopedCheckoutStores } from '../data/features'
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Checkout builder" />
    <Button variant="solid" icon-left="lucide-store" label="New store" @click="toast.success('Demo: checkout store created')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Online store / hosted checkout pages with products and branding.</p>
    <div class="webale-panel">
      <div v-for="s in scopedCheckoutStores" :key="s.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ s.name }}</p>
            <Badge :label="s.status" :theme="s.status === 'Live' ? 'green' : 'gray'" variant="subtle" />
          </div>
          <p class="font-mono text-xs text-ink-gray-5">{{ s.url }}</p>
          <p class="text-xs text-ink-gray-5">{{ s.products }} products<template v-if="isPlatformView"> · {{ tenantName(s.tenantId) }}</template></p>
        </div>
        <Button label="Edit" @click="toast.info('Demo: open builder canvas')" />
      </div>
    </div>
  </div>
</template>
