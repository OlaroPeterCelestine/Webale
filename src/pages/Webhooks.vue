<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import {
  isPlatformView,
  scopedWebhooks,
  tenantName,
} from '../data/platform'
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Webhooks" />
    <Button
      variant="solid"
      icon-left="lucide-plus"
      label="Add endpoint"
      @click="toast.success('Demo: webhook endpoint saved')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Per-tenant event delivery for charge and transfer lifecycle.
    </p>

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="w in scopedWebhooks"
        :key="w.id"
        class="flex flex-wrap items-start justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="truncate font-mono text-sm text-ink-gray-9">{{ w.url }}</p>
            <Badge
              :label="w.status"
              :theme="w.status === 'Active' ? 'green' : 'red'"
              variant="subtle"
            />
          </div>
          <p class="text-xs text-ink-gray-6">{{ w.events }}</p>
          <p class="text-xs text-ink-gray-5">
            <template v-if="isPlatformView"
              >{{ tenantName(w.tenantId) }} ·
            </template>
            Last delivery {{ w.lastDelivery }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
