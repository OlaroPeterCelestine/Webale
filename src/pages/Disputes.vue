<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  Button,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
  toast,
} from 'frappe-ui'
import {
  isPlatformView,
  scopedDisputes,
  tenantName,
  type Dispute,
} from '../data/platform'
import StatCards from '../components/StatCards.vue'
import { disputeEvidence } from '../data/features'

const tab = ref('all')
const query = ref('')
const selected = ref<Dispute | null>(null)

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

const evidence = computed(() =>
  selected.value
    ? disputeEvidence.filter((e) => e.disputeId === selected.value!.id)
    : [],
)

function statusTheme(status: string) {
  if (status === 'Won') return 'green'
  if (status === 'Open') return 'amber'
  if (status === 'Under review') return 'blue'
  return 'red'
}

function evidenceTheme(s: string) {
  if (s === 'Accepted') return 'green'
  if (s === 'Submitted') return 'blue'
  return 'red'
}

const stats = computed(() => {
  const rows = scopedDisputes.value
  return [
    { title: 'Disputes', value: rows.length, caption: 'in scope' },
    { title: 'Open', value: rows.filter((d) => d.status === 'Open' || d.status === 'Under review').length },
    { title: 'Won', value: rows.filter((d) => d.status === 'Won').length },
    { title: 'At risk', value: Math.round(rows.filter((d) => d.status === 'Open' || d.status === 'Under review').reduce((n, d) => n + d.amount, 0) / 1000), suffix: 'K UGX' },
  ]
})

</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Disputes & chargebacks" />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <StatCards :stats="stats" />

    <p class="text-p-base text-ink-gray-6">
      Chargeback workflow with evidence upload and review — scoped by tenant
      when selected.
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

    <div class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="webale-panel">
        <button
          v-for="d in filtered"
          :key="d.id"
          type="button"
          class="webale-panel-row w-full items-center text-start"
          :class="selected?.id === d.id ? 'bg-surface-gray-1' : ''"
          @click="selected = d"
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
        </button>
        <p
          v-if="!filtered.length"
          class="px-4 py-12 text-center text-sm text-ink-gray-5"
        >
          No disputes on this filter.
        </p>
      </div>

      <aside class="webale-card space-y-3 lg:sticky lg:top-4 lg:self-start">
        <template v-if="selected">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-wide text-ink-gray-5">
                Evidence
              </p>
              <p class="text-sm-semibold">{{ selected.reference }}</p>
            </div>
            <Button
              variant="solid"
              icon-left="lucide-upload"
              label="Upload"
              @click="toast.success('Demo: evidence uploaded')"
            />
          </div>
          <div v-if="evidence.length" class="space-y-2">
            <div
              v-for="e in evidence"
              :key="e.id"
              class="flex items-center justify-between gap-2 rounded-4 border border-outline-gray-1 px-3 py-2"
            >
              <div>
                <p class="text-sm-medium">{{ e.fileName }}</p>
                <p class="text-xs text-ink-gray-5">
                  {{ e.kind }} · {{ e.uploadedAt }}
                </p>
              </div>
              <Badge
                :label="e.status"
                :theme="evidenceTheme(e.status)"
                variant="subtle"
              />
            </div>
          </div>
          <p v-else class="text-sm text-ink-gray-5">
            No evidence yet — upload receipts, shipping, or chat logs.
          </p>
        </template>
        <p v-else class="text-sm text-ink-gray-5">
          Select a dispute to manage evidence.
        </p>
      </aside>
    </div>
  </div>
</template>
