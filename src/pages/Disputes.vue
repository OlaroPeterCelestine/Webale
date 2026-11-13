<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
} from 'frappe-ui'
import {
  isPlatformView,
  scopedDisputes,
  tenantName,
} from '../data/platform'

const tab = ref('all')
const query = ref('')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'Open' },
  { label: 'Under review', value: 'Under review' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return scopedDisputes.value.filter((d) => {
    if (tab.value !== 'all' && d.status !== tab.value) return false
    if (!q) return true
    return [d.reference, d.reason, tenantName(d.tenantId)]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function statusTheme(status: string) {
  if (status === 'Won') return 'green'
  if (status === 'Open') return 'amber'
  if (status === 'Under review') return 'blue'
  return 'red'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Disputes & chargebacks" />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Chargeback and dispute workflow with evidence deadlines — scoped by
      tenant when selected.
    </p>

    <section class="webale-section">
      <TabButtons v-model="tab" :options="tabs" />
      <FormControl
        v-model="query"
        class="max-w-md"
        label="Search"
        placeholder="Reference, reason, tenant…"
      />
    </section>

    <section class="webale-section">
      <div class="webale-panel">
        <div
          v-for="d in filtered"
          :key="d.id"
          class="webale-panel-row items-center"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium text-ink-gray-9">{{ d.reference }}</p>
              <Badge
                :label="d.status"
                :theme="statusTheme(d.status)"
                variant="subtle"
              />
            </div>
            <p class="text-sm text-ink-gray-7">{{ d.reason }}</p>
            <p class="text-xs text-ink-gray-5">
              <template v-if="isPlatformView"
                >{{ tenantName(d.tenantId) }} ·
              </template>
              opened {{ d.openedAt }} · {{ d.id }}
            </p>
          </div>
          <p class="text-sm-medium">
            {{ d.currency }} {{ d.amount.toLocaleString() }}
          </p>
        </div>
        <p
          v-if="!filtered.length"
          class="px-4 py-12 text-center text-sm text-ink-gray-5"
        >
          No disputes on this filter.
        </p>
      </div>
    </section>
  </div>
</template>
