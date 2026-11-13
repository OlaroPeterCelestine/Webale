<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Alert,
  Badge,
  Button,
  PageHeader,
  PageHeaderTitle,
} from 'frappe-ui'
import { BarChart, DonutChart, NumberCard } from 'frappe-ui/charts'
import {
  channelMix,
  currentTenant,
  enterpriseKpis,
  isPlatformView,
  platform,
  platformKpis,
  scopedAuditLogs,
  scopedTransactions,
  session,
  tenants,
  volumeByDay,
} from '../data/platform'

const router = useRouter()
const kpis = platformKpis
const risk = enterpriseKpis
const recent = computed(() => scopedTransactions.value.slice(0, 5))
const recentLogs = computed(() => scopedAuditLogs.value.slice(0, 5))

function statusTheme(status: string) {
  if (status === 'Successful') return 'green'
  if (status === 'Pending') return 'amber'
  if (status === 'Failed') return 'red'
  return 'gray'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle
      :title="
        isPlatformView ? 'Platform overview' : currentTenant?.name || 'Tenant'
      "
    />
    <div class="flex flex-wrap gap-2">
      <Button
        icon-left="lucide-scan-search"
        label="Tenant 360"
        @click="
          router.push(
            session.tenantId ? `/tenants/${session.tenantId}` : '/tenants',
          )
        "
      />
      <Button
        icon-left="lucide-scroll-text"
        label="Audit logs"
        @click="router.push('/logs')"
      />
      <Button
        variant="solid"
        icon-left="lucide-arrow-left-right"
        label="Transactions"
        @click="router.push('/transactions')"
      />
    </div>
  </PageHeader>

  <div class="webale-page webale-page--workspace">
    <Alert
      v-if="kpis.pendingKyc > 0 && isPlatformView"
      theme="amber"
      :title="`${kpis.pendingKyc} tenant${kpis.pendingKyc === 1 ? '' : 's'} awaiting KYC`"
      description="Review business documents before enabling live collections."
      icon="lucide-shield-alert"
      :primary-action="{ label: 'Open tenants', route: '/tenants' }"
    />

    <section class="webale-hero">
      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide text-ink-gray-5">
          {{ platform.name }} ·
          {{ isPlatformView ? 'multi-tenant' : 'tenant desk' }} ·
          {{ session.environment }}
        </p>
        <h1 class="text-2xl-semibold text-ink-gray-9">
          {{
            isPlatformView
              ? 'Enterprise admin dashboard'
              : `${currentTenant?.name} dashboard`
          }}
        </h1>
        <p class="max-w-xl text-p-base text-ink-gray-6">
          {{ platform.tagline }}. Full ops desk — payments, KYC, disputes,
          audit logs, team RBAC and system health.
        </p>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <Badge
          :label="session.environment === 'live' ? 'Live mode' : 'Test mode'"
          :theme="session.environment === 'live' ? 'green' : 'amber'"
          variant="subtle"
        />
        <Badge
          :label="`${kpis.activeTenants} live tenants`"
          theme="blue"
          variant="subtle"
        />
        <Badge
          :label="`${risk.openDisputes} open disputes`"
          theme="amber"
          variant="subtle"
        />
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Key figures</h2>
      <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
        <NumberCard
          title="Tenants"
          :value="kpis.tenants"
          :delta="kpis.activeTenants"
          delta-caption="active"
        />
        <NumberCard
          title="Success rate"
          :value="kpis.successRate"
          suffix="%"
          :delta="0.3"
          delta-caption="pts"
        />
        <NumberCard
          title="KYC pending"
          :value="risk.kycPending"
          delta-caption="review queue"
        />
        <NumberCard
          title="Open disputes"
          :value="risk.openDisputes"
          negative-is-better
        />
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Charts</h2>
      <div class="webale-card-grid lg:grid-cols-2">
        <div class="webale-chart-card">
          <BarChart
            title="Platform volume index"
            subtitle="Relative daily volume"
            :data="volumeByDay"
            x="day"
            y="amount"
            class="min-h-[280px]"
          />
        </div>
        <div class="webale-chart-card">
          <DonutChart
            title="Channel mix"
            subtitle="All successful charges"
            :data="channelMix"
            category="channel"
            value="count"
            center-label="Mix"
            class="min-h-[280px]"
          />
        </div>
      </div>
    </section>

    <section v-if="isPlatformView" class="webale-section">
      <h2 class="webale-section-title">Tenants</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="t in tenants.slice(0, 6)"
          :key="t.id"
          type="button"
          class="webale-card space-y-2 text-left transition hover:border-outline-gray-3 hover:bg-surface-gray-1"
          @click="router.push('/tenants')"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm-semibold text-ink-gray-9">{{ t.name }}</p>
            <Badge
              :label="t.status"
              :theme="
                t.status === 'Active'
                  ? 'green'
                  : t.status === 'Pending KYC'
                    ? 'amber'
                    : 'red'
              "
              variant="subtle"
            />
          </div>
          <p class="text-sm text-ink-gray-6">
            {{ t.country }} · {{ t.industry }} · {{ t.plan }}
          </p>
        </button>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="webale-section">
        <div class="flex items-center justify-between gap-2">
          <h2 class="webale-section-title">Recent transactions</h2>
          <Button label="View all" @click="router.push('/transactions')" />
        </div>
        <div class="webale-panel">
          <div
            v-for="txn in recent"
            :key="txn.id"
            class="webale-panel-row items-center"
          >
            <div class="min-w-0 space-y-1">
              <p class="text-sm-medium text-ink-gray-9">{{ txn.reference }}</p>
              <p class="text-xs text-ink-gray-5">
                {{ txn.customer }} · {{ txn.channel }} · {{ txn.createdAt }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-sm-medium">
                {{ txn.currency }} {{ txn.amount.toLocaleString() }}
              </p>
              <Badge
                :label="txn.status"
                :theme="statusTheme(txn.status)"
                variant="subtle"
              />
            </div>
          </div>
          <p
            v-if="!recent.length"
            class="px-4 py-10 text-center text-sm text-ink-gray-5"
          >
            No transactions in this tenant / environment.
          </p>
        </div>
      </section>

      <section class="webale-section">
        <div class="flex items-center justify-between gap-2">
          <h2 class="webale-section-title">Audit trail</h2>
          <Button label="All logs" @click="router.push('/logs')" />
        </div>
        <div class="webale-panel">
          <div
            v-for="log in recentLogs"
            :key="log.id"
            class="webale-panel-row"
          >
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <Badge
                  :label="log.severity"
                  :theme="
                    log.severity === 'success'
                      ? 'green'
                      : log.severity === 'warning'
                        ? 'amber'
                        : log.severity === 'error'
                          ? 'red'
                          : 'blue'
                  "
                  variant="subtle"
                />
                <p class="font-mono text-xs text-ink-gray-9">{{ log.action }}</p>
              </div>
              <p class="text-sm text-ink-gray-7">{{ log.detail }}</p>
              <p class="text-xs text-ink-gray-5">
                {{ log.at }} · {{ log.actor }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="webale-section">
      <h2 class="webale-section-title">Jump to</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          v-for="link in [
            { label: 'KYC queue', desc: `${risk.kycPending} pending`, route: '/kyc', icon: 'lucide-badge-check' },
            { label: 'Disputes', desc: `${risk.openDisputes} open`, route: '/disputes', icon: 'lucide-shield-alert' },
            { label: 'Team & roles', desc: 'RBAC operators', route: '/team', icon: 'lucide-users' },
            { label: 'System health', desc: `${risk.degraded} degraded`, route: '/system', icon: 'lucide-activity' },
          ]"
          :key="link.route"
          type="button"
          class="webale-card flex flex-col gap-3 text-left transition hover:border-outline-gray-3 hover:bg-surface-gray-1"
          @click="router.push(link.route)"
        >
          <span
            class="flex size-10 items-center justify-center rounded-5 bg-surface-gray-2 text-ink-gray-7"
            aria-hidden="true"
          >
            <span :class="[link.icon, 'size-5']" />
          </span>
          <div class="space-y-1">
            <p class="text-sm-semibold text-ink-gray-9">{{ link.label }}</p>
            <p class="text-sm text-ink-gray-6">{{ link.desc }}</p>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>
