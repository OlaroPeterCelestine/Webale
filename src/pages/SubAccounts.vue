<script setup lang="ts">
import { Badge, PageHeader, PageHeaderTitle } from 'frappe-ui'
import {
  isPlatformView,
  scopedSubAccounts,
  tenantName,
} from '../data/platform'
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Subaccounts" />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Split settlements to partner banks (marketplace / platform model).
    </p>

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="s in scopedSubAccounts"
        :key="s.id"
        class="flex flex-wrap items-center justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <div>
          <div class="mb-1 flex flex-wrap items-center gap-2">
            <p class="text-sm-medium text-ink-gray-9">{{ s.name }}</p>
            <Badge
              :label="s.status"
              :theme="s.status === 'Active' ? 'green' : 'gray'"
              variant="subtle"
            />
          </div>
          <p class="text-xs text-ink-gray-5">
            <template v-if="isPlatformView"
              >{{ tenantName(s.tenantId) }} ·
            </template>
            {{ s.bank }} · {{ s.account }}
          </p>
        </div>
        <p class="text-sm-medium">{{ s.splitPercent }}% split</p>
      </div>
      <p
        v-if="!scopedSubAccounts.length"
        class="px-4 py-12 text-center text-sm text-ink-gray-5"
      >
        No subaccounts in this scope.
      </p>
    </div>
  </div>
</template>
