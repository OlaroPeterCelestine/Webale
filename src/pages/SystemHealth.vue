<script setup lang="ts">
import { computed } from 'vue'
import {
  Badge,
  Button,
  PageHeader,
  PageHeaderTitle,
  toast,
} from 'frappe-ui'
import { NumberCard } from 'frappe-ui/charts'
import { auditLogs, systemServices } from '../data/platform'

function statusTheme(status: string) {
  if (status === 'Operational') return 'green'
  if (status === 'Degraded') return 'amber'
  return 'red'
}

const stats = computed(() => {
  const ops = systemServices.filter((s) => s.status === 'Operational').length
  const avgLatency = Math.round(
    systemServices.reduce((n, s) => n + s.latencyMs, 0) /
      Math.max(systemServices.length, 1),
  )
  const avgUptime =
    systemServices.reduce((n, s) => n + s.uptime, 0) /
    Math.max(systemServices.length, 1)
  return {
    ops,
    total: systemServices.length,
    avgLatency,
    avgUptime: Number(avgUptime.toFixed(2)),
    incidents: systemServices.filter((s) => s.status !== 'Operational').length,
  }
})

const recentErrors = computed(() =>
  auditLogs.filter((l) => l.severity === 'error' || l.severity === 'warning').slice(0, 5),
)
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="System health" />
    <Button
      variant="solid"
      icon-left="lucide-refresh-cw"
      label="Run checks"
      @click="toast.success('Demo: health checks refreshed')"
    />
  </PageHeader>

  <div class="webale-page webale-page--workspace">
    <p class="text-p-base text-ink-gray-6">
      Provider and platform status — API, MoMo rails, card acquiring, webhooks
      and settlement engine.
    </p>

    <section class="webale-section">
      <h2 class="webale-section-title">Key figures</h2>
      <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
        <NumberCard
          title="Services up"
          :value="stats.ops"
          :delta="stats.total"
          delta-caption="total"
        />
        <NumberCard
          title="Avg latency"
          :value="stats.avgLatency"
          suffix="ms"
        />
        <NumberCard
          title="Avg uptime"
          :value="stats.avgUptime"
          suffix="%"
        />
        <NumberCard
          title="Incidents"
          :value="stats.incidents"
          negative-is-better
        />
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Services</h2>
      <div class="webale-panel">
        <div
          v-for="s in systemServices"
          :key="s.id"
          class="webale-panel-row items-center"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium text-ink-gray-9">{{ s.name }}</p>
              <Badge
                :label="s.status"
                :theme="statusTheme(s.status)"
                variant="subtle"
              />
            </div>
            <p class="text-xs text-ink-gray-5">{{ s.region }} · {{ s.id }}</p>
          </div>
          <div class="text-end text-sm">
            <p class="text-sm-medium">{{ s.latencyMs }} ms</p>
            <p class="text-xs text-ink-gray-5">{{ s.uptime }}% uptime</p>
          </div>
        </div>
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Recent warnings & errors</h2>
      <div class="webale-panel">
        <div
          v-for="l in recentErrors"
          :key="l.id"
          class="webale-panel-row"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <Badge
                :label="l.severity"
                :theme="l.severity === 'error' ? 'red' : 'amber'"
                variant="subtle"
              />
              <p class="font-mono text-sm">{{ l.action }}</p>
            </div>
            <p class="text-sm text-ink-gray-7">{{ l.detail }}</p>
            <p class="text-xs text-ink-gray-5">{{ l.at }} · {{ l.actor }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
