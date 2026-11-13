<script setup lang="ts">
import { computed } from 'vue'
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import {
  currentTenant,
  isPlatformView,
  session,
} from '../data/platform'

const keys = computed(() => {
  const env = session.environment
  const prefix = env === 'live' ? 'wb_live' : 'wb_test'
  const scope = currentTenant.value?.slug || 'platform'
  return [
    {
      name: `${env} secret`,
      prefix: `${prefix}_sk_••••${scope.slice(0, 4)}9f2a`,
      created: '2026-09-12',
      status: 'Active',
    },
    {
      name: `${env} public`,
      prefix: `${prefix}_pk_••••${scope.slice(0, 4)}44c1`,
      created: '2026-09-12',
      status: 'Active',
    },
    {
      name: 'Webhook secret',
      prefix: `wb_whsec_••••${scope.slice(0, 3)}aa`,
      created: '2026-08-01',
      status: 'Active',
    },
  ]
})
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="API keys" />
    <Button
      variant="solid"
      icon-left="lucide-plus"
      label="Create key"
      @click="toast.success('Demo: new API key issued')"
    />
  </PageHeader>

  <div class="webale-page max-w-3xl">
    <p class="text-p-base text-ink-gray-6">
      {{
        isPlatformView
          ? 'Platform-level keys. Switch into a tenant for merchant keys.'
          : `Keys for ${currentTenant?.name} · ${session.environment} mode`
      }}
    </p>

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="k in keys"
        :key="k.prefix"
        class="flex flex-wrap items-center justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <div>
          <p class="text-sm-medium text-ink-gray-9">{{ k.name }}</p>
          <p class="font-mono text-xs text-ink-gray-6">{{ k.prefix }}</p>
          <p class="text-xs text-ink-gray-5">Created {{ k.created }}</p>
        </div>
        <Badge :label="k.status" theme="green" variant="subtle" />
      </div>
    </div>
  </div>
</template>
