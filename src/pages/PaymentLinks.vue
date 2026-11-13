<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import {
  isPlatformView,
  scopedLinks,
  tenantName,
} from '../data/platform'
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Payment links" />
    <Button
      variant="solid"
      icon-left="lucide-plus"
      label="Create link"
      @click="toast.success('Demo: payment link created')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Hosted checkout URLs per tenant — no code required.
    </p>

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="l in scopedLinks"
        :key="l.id"
        class="flex flex-wrap items-start justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium text-ink-gray-9">{{ l.title }}</p>
            <Badge
              :label="l.status"
              :theme="l.status === 'Active' ? 'green' : 'gray'"
              variant="subtle"
            />
          </div>
          <p class="font-mono text-xs text-ink-gray-6">{{ l.url }}</p>
          <p class="text-xs text-ink-gray-5">
            <template v-if="isPlatformView"
              >{{ tenantName(l.tenantId) }} ·
            </template>
            {{ l.payments }} payments
          </p>
        </div>
        <p class="text-sm-medium">
          {{
            l.amount
              ? `${l.currency} ${l.amount.toLocaleString()}`
              : 'Open amount'
          }}
        </p>
      </div>
    </div>
  </div>
</template>
