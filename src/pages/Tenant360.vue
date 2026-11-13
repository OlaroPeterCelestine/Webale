<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Badge,
  Button,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
  toast,
} from 'frappe-ui'
import { NumberCard } from 'frappe-ui/charts'
import { getTenant360, setTenant } from '../data/platform'

const route = useRoute()
const router = useRouter()
const tab = ref('overview')

const id = computed(() => String(route.params.id || ''))
const bundle = computed(() => getTenant360(id.value))

/** Tabs mirror app features available on the platform for this tenant. */
const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Transactions', value: 'transactions' },
  { label: 'Balances', value: 'balances' },
  { label: 'Refunds', value: 'refunds' },
  { label: 'Transfers', value: 'transfers' },
  { label: 'Customers', value: 'customers' },
  { label: 'Settlements', value: 'settlements' },
  { label: 'Subaccounts', value: 'subaccounts' },
  { label: 'Risk', value: 'risk' },
  { label: 'Developers', value: 'developers' },
  { label: 'Logs', value: 'logs' },
]

function statusTheme(s?: string) {
  if (!s) return 'gray'
  if (
    [
      'Active',
      'Successful',
      'Completed',
      'Approved',
      'Paid',
      'Live',
      'Won',
    ].includes(s)
  )
    return 'green'
  if (
    [
      'Pending',
      'Queued',
      'In review',
      'Needs info',
      'Under review',
      'Open',
      'Processing',
    ].includes(s)
  )
    return 'amber'
  if (
    ['Failed', 'Rejected', 'Blocked', 'Lost', 'Suspended', 'Failing'].includes(
      s,
    )
  )
    return 'red'
  return 'blue'
}

function enterContext() {
  if (!bundle.value) return
  setTenant(bundle.value.tenant.id)
  toast.success(`Scoped to ${bundle.value.tenant.name}`)
  router.push('/')
}

function goFeature(path: string) {
  if (!bundle.value) return
  setTenant(bundle.value.tenant.id)
  router.push(path)
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle :title="bundle?.tenant.name || 'Tenant'" />
    <div class="flex flex-wrap gap-2">
      <Button label="Back" @click="router.push('/tenants')" />
      <Button
        v-if="bundle"
        variant="solid"
        icon-left="lucide-log-in"
        label="Enter tenant"
        @click="enterContext"
      />
    </div>
  </PageHeader>

  <div v-if="!bundle" class="webale-page">
    <p class="text-ink-gray-5">Tenant not found.</p>
  </div>

  <div v-else class="webale-page webale-page--workspace">
    <section class="webale-hero">
      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide text-ink-gray-5">
          Tenant 360 · {{ bundle.tenant.slug }}
        </p>
        <h1 class="text-2xl-semibold text-ink-gray-9">
          {{ bundle.tenant.name }}
        </h1>
        <p class="max-w-xl text-p-base text-ink-gray-6">
          {{ bundle.tenant.industry }} · {{ bundle.tenant.country }} ·
          {{ bundle.tenant.email }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Badge
          :label="bundle.tenant.status"
          :theme="statusTheme(bundle.tenant.status)"
          variant="subtle"
        />
        <Badge :label="bundle.tenant.plan" theme="blue" variant="subtle" />
        <Badge
          :label="`Since ${bundle.tenant.createdAt}`"
          theme="gray"
          variant="subtle"
        />
      </div>
    </section>

    <div class="webale-tabs-scroll">
      <TabButtons v-model="tab" :options="tabs" />
    </div>

    <section v-if="tab === 'overview'" class="webale-section">
      <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
        <NumberCard
          title="Live volume"
          :value="Math.round(bundle.tenant.liveVolume / 1_000_000)"
          suffix="M"
        />
        <NumberCard title="Transactions" :value="bundle.transactions.length" />
        <NumberCard title="Customers" :value="bundle.customers.length" />
        <NumberCard
          title="Open disputes"
          :value="
            bundle.disputes.filter(
              (d) => d.status === 'Open' || d.status === 'Under review',
            ).length
          "
          negative-is-better
        />
      </div>
      <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
        <NumberCard title="Refunds" :value="bundle.refunds.length" />
        <NumberCard title="Transfers" :value="bundle.transfers.length" />
        <NumberCard title="Subaccounts" :value="bundle.subAccounts.length" />
        <NumberCard title="Payment links" :value="bundle.links.length" />
      </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="webale-card space-y-2">
          <p class="text-sm-semibold">Profile</p>
          <p class="text-sm text-ink-gray-7">Plan {{ bundle.tenant.plan }}</p>
          <p class="text-sm text-ink-gray-7">
            Test volume {{ bundle.tenant.testVolume.toLocaleString() }}
          </p>
          <p class="text-sm text-ink-gray-7">KYC cases {{ bundle.kyc.length }}</p>
          <p class="text-sm text-ink-gray-7">
            Settlements {{ bundle.settlements.length }}
          </p>
        </div>
        <div class="webale-card space-y-3">
          <p class="text-sm-semibold">Jump to desk features</p>
          <div class="flex flex-wrap gap-2">
            <Button
              label="Balances"
              @click="goFeature('/balances')"
            />
            <Button
              label="Refunds"
              @click="goFeature('/refunds')"
            />
            <Button
              label="Transfers"
              @click="goFeature('/transfers')"
            />
            <Button
              label="Customers"
              @click="goFeature('/customers')"
            />
            <Button
              label="Fraud rules"
              @click="goFeature('/fraud')"
            />
            <Button
              label="Simulator"
              @click="goFeature('/simulator')"
            />
            <Button
              label="Developers"
              @click="goFeature('/developers')"
            />
          </div>
        </div>
      </div>
    </section>

    <section v-else-if="tab === 'transactions'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="t in bundle.transactions"
          :key="t.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ t.reference }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ t.channel }} · {{ t.createdAt }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm-medium"
              >{{ t.currency }} {{ t.amount.toLocaleString() }}</span
            >
            <Badge
              :label="t.status"
              :theme="statusTheme(t.status)"
              variant="subtle"
            />
          </div>
        </div>
        <p
          v-if="!bundle.transactions.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No transactions.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'balances'" class="webale-section">
      <div class="webale-panel">
        <div v-for="b in bundle.balances" :key="b.id" class="webale-panel-row">
          <p class="text-sm-medium">{{ b.currency }}</p>
          <div class="text-end text-sm">
            <p>Collection {{ b.collection.toLocaleString() }}</p>
            <p class="text-ink-gray-5">
              Payout {{ b.payout.toLocaleString() }} · Pending
              {{ b.pendingSettlement.toLocaleString() }}
            </p>
          </div>
        </div>
        <p
          v-if="!bundle.balances.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No balances.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'refunds'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="r in bundle.refunds"
          :key="r.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ r.reference }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ r.reason }} · {{ r.createdAt }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm-medium"
              >{{ r.currency }} {{ r.amount.toLocaleString() }}</span
            >
            <Badge
              :label="r.status"
              :theme="statusTheme(r.status)"
              variant="subtle"
            />
          </div>
        </div>
        <p
          v-if="!bundle.refunds.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No refunds.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'transfers'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="t in bundle.transfers"
          :key="t.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ t.beneficiary }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ t.reference }} · {{ t.channel }} · {{ t.createdAt }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm-medium"
              >{{ t.currency }} {{ t.amount.toLocaleString() }}</span
            >
            <Badge
              :label="t.status"
              :theme="statusTheme(t.status)"
              variant="subtle"
            />
          </div>
        </div>
        <p
          v-if="!bundle.transfers.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No transfers.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'customers'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="c in bundle.customers"
          :key="c.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ c.name }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ c.email }} · {{ c.phone }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ c.payments }} pays</span>
            <Badge
              :label="c.status"
              :theme="statusTheme(c.status)"
              variant="subtle"
            />
          </div>
        </div>
        <p
          v-if="!bundle.customers.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No customers.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'settlements'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="s in bundle.settlements"
          :key="s.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ s.id }}</p>
            <p class="text-xs text-ink-gray-5">Due {{ s.due }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm-medium"
              >{{ s.currency }} {{ s.amount.toLocaleString() }}</span
            >
            <Badge
              :label="s.status"
              :theme="statusTheme(s.status)"
              variant="subtle"
            />
          </div>
        </div>
        <p
          v-if="!bundle.settlements.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No settlements.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'subaccounts'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="s in bundle.subAccounts"
          :key="s.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">{{ s.name }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ s.id }} · split {{ s.splitPercent }}%
            </p>
          </div>
          <Badge
            :label="s.status"
            :theme="statusTheme(s.status)"
            variant="subtle"
          />
        </div>
        <p
          v-if="!bundle.subAccounts.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No subaccounts.
        </p>
      </div>
    </section>

    <section v-else-if="tab === 'risk'" class="webale-section">
      <div class="webale-panel">
        <div
          v-for="d in bundle.disputes"
          :key="d.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">Dispute · {{ d.reference }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ d.reason }} ·
              {{ d.currency }} {{ d.amount.toLocaleString() }}
            </p>
          </div>
          <Badge
            :label="d.status"
            :theme="statusTheme(d.status)"
            variant="subtle"
          />
        </div>
        <div
          v-for="k in bundle.kyc"
          :key="k.id"
          class="webale-panel-row items-center"
        >
          <div>
            <p class="text-sm-medium">KYC · {{ k.business }}</p>
            <p class="text-xs text-ink-gray-5">
              Risk {{ k.risk }} · {{ k.submittedAt }}
            </p>
          </div>
          <Badge
            :label="k.status"
            :theme="statusTheme(k.status)"
            variant="subtle"
          />
        </div>
        <p
          v-if="!bundle.disputes.length && !bundle.kyc.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No risk items.
        </p>
      </div>
      <Button
        class="self-start"
        label="Open fraud rules"
        icon-left="lucide-shield"
        @click="goFeature('/fraud')"
      />
    </section>

    <section v-else-if="tab === 'developers'" class="webale-section">
      <div class="webale-panel">
        <div v-for="w in bundle.webhooks" :key="w.id" class="webale-panel-row">
          <div>
            <p class="font-mono text-xs">{{ w.url }}</p>
            <p class="text-xs text-ink-gray-5">{{ w.events }}</p>
          </div>
          <Badge
            :label="w.status"
            :theme="statusTheme(w.status === 'Active' ? 'Active' : 'Failed')"
            variant="subtle"
          />
        </div>
        <div v-for="l in bundle.links" :key="l.id" class="webale-panel-row">
          <div>
            <p class="text-sm-medium">{{ l.title }}</p>
            <p class="font-mono text-xs text-ink-gray-5">{{ l.url }}</p>
          </div>
          <Badge
            :label="l.status"
            :theme="statusTheme(l.status)"
            variant="subtle"
          />
        </div>
        <p
          v-if="!bundle.webhooks.length && !bundle.links.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No developer endpoints.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button label="API keys" @click="goFeature('/api-keys')" />
        <Button label="Simulator" @click="goFeature('/simulator')" />
        <Button label="Docs" @click="goFeature('/developers')" />
      </div>
    </section>

    <section v-else class="webale-section">
      <div class="webale-panel">
        <div v-for="log in bundle.logs" :key="log.id" class="webale-panel-row">
          <div>
            <p class="font-mono text-xs">{{ log.action }}</p>
            <p class="text-sm text-ink-gray-7">{{ log.detail }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ log.at }} · {{ log.actor }} · {{ log.resource }}
            </p>
          </div>
          <Badge
            :label="log.severity"
            :theme="
              log.severity === 'error'
                ? 'red'
                : log.severity === 'warning'
                  ? 'amber'
                  : log.severity === 'success'
                    ? 'green'
                    : 'gray'
            "
            variant="subtle"
          />
        </div>
        <p
          v-if="!bundle.logs.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No logs.
        </p>
      </div>
    </section>
  </div>
</template>
