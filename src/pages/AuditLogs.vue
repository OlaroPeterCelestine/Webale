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
  scopedAuditLogs,
  tenantName,
  type AuditSeverity,
} from '../data/platform'

const tab = ref('all')
const query = ref('')

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
]

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return scopedAuditLogs.value.filter((l) => {
    if (tab.value !== 'all' && l.severity !== tab.value) return false
    if (!q) return true
    return [l.actor, l.action, l.resource, l.detail, l.ip]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
})

function severityTheme(s: AuditSeverity) {
  if (s === 'success') return 'green'
  if (s === 'warning') return 'amber'
  if (s === 'error') return 'red'
  return 'blue'
}

function exportCsv() {
  const header = 'at,actor,action,resource,severity,detail,ip'
  const lines = filtered.value.map(
    (l) =>
      `"${l.at}","${l.actor}","${l.action}","${l.resource}","${l.severity}","${l.detail}","${l.ip}"`,
  )
  const blob = new Blob([[header, ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `webale-audit-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Audit log exported')
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Audit logs" />
    <Button
      variant="solid"
      icon-left="lucide-download"
      label="Export CSV"
      @click="exportCsv"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Immutable enterprise activity trail — API calls, KYC, settlements, key
      rotation and compliance actions
      {{ isPlatformView ? 'across all tenants' : 'for this tenant' }}.
    </p>

    <section class="webale-section">
      <TabButtons v-model="tab" :options="tabs" />
      <FormControl
        v-model="query"
        class="max-w-md"
        label="Search"
        placeholder="Actor, action, resource, IP…"
      />
    </section>

    <section class="webale-section">
      <div class="webale-panel">
        <div
          v-for="log in filtered"
          :key="log.id"
          class="webale-panel-row"
        >
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <Badge
                :label="log.severity"
                :theme="severityTheme(log.severity)"
                variant="subtle"
              />
              <p class="font-mono text-sm text-ink-gray-9">{{ log.action }}</p>
            </div>
            <p class="text-sm text-ink-gray-7">{{ log.detail }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ log.at }} · {{ log.actor }} · {{ log.resource }}
              <template v-if="isPlatformView && log.tenantId">
                · {{ tenantName(log.tenantId) }}
              </template>
              · IP {{ log.ip }}
            </p>
          </div>
        </div>
        <p
          v-if="!filtered.length"
          class="px-4 py-12 text-center text-sm text-ink-gray-5"
        >
          No log entries match.
        </p>
      </div>
    </section>
  </div>
</template>
