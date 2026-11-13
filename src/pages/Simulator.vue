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
import { NumberCard } from 'frappe-ui/charts'
import { apiBase, session } from '../data/platform'
import StatCards from '../components/StatCards.vue'

const tab = ref('charge')
const tabs = [
  { label: 'Sandbox charge', value: 'charge' },
  { label: 'MTN vs Airtel benchmark', value: 'benchmark' },
]

const amount = ref('15000')
const currency = ref('UGX')
const channel = ref('mobilemoneyuganda')
const email = ref('test@customer.com')
const phone = ref('+256700000001')
const lastResult = ref('')

const channelOptions = [
  { label: 'MTN MoMo UG', value: 'mobilemoneyuganda' },
  { label: 'Airtel Money UG', value: 'mobilemoneyairtel' },
  { label: 'Card', value: 'card' },
  { label: 'Bank transfer', value: 'banktransfer' },
]

type ProviderKey = 'mtn' | 'airtel'

type BenchRow = {
  provider: string
  key: ProviderKey
  runs: number
  success: number
  failed: number
  successRate: number
  avgMs: number
  p50Ms: number
  p95Ms: number
  minMs: number
  maxMs: number
  samples: number[]
}

const benchCount = ref('50')
const benchAmount = ref('10000')
const running = ref(false)
const progress = ref(0)
const results = ref<BenchRow[]>([])
const history = ref<
  { at: string; mtnAvg: number; airtelAvg: number; winner: string }[]
>([])

const winner = computed(() => {
  if (results.value.length < 2) return null
  const [a, b] = results.value
  if (a.avgMs === b.avgMs) return 'Tie'
  return a.avgMs < b.avgMs ? a.provider : b.provider
})

const compareStats = computed(() => {
  if (results.value.length < 2) return []
  const mtn = results.value.find((r) => r.key === 'mtn')!
  const airtel = results.value.find((r) => r.key === 'airtel')!
  return [
    {
      title: 'MTN avg',
      value: mtn.avgMs,
      suffix: 'ms',
      caption: `${mtn.successRate}% ok`,
    },
    {
      title: 'Airtel avg',
      value: airtel.avgMs,
      suffix: 'ms',
      caption: `${airtel.successRate}% ok`,
    },
    {
      title: 'MTN p95',
      value: mtn.p95Ms,
      suffix: 'ms',
      caption: 'tail latency',
    },
    {
      title: 'Airtel p95',
      value: airtel.p95Ms,
      suffix: 'ms',
      caption: 'tail latency',
    },
  ]
})

function run() {
  const refId = `WB-SIM-${Date.now().toString().slice(-6)}`
  const provider =
    channel.value === 'mobilemoneyairtel'
      ? 'Airtel Money UG'
      : channel.value === 'mobilemoneyuganda'
        ? 'MTN MoMo UG'
        : channel.value
  lastResult.value = JSON.stringify(
    {
      status: 'success',
      message: 'Sandbox charge created',
      data: {
        id: `txn_sim_${refId}`,
        tx_ref: refId,
        amount: Number(amount.value),
        currency: currency.value,
        payment_type: channel.value,
        provider,
        customer: { email: email.value, phone: phone.value },
        environment: 'test',
        mode: 'sandbox_simulator',
        latency_ms: Math.round(180 + Math.random() * 220),
      },
    },
    null,
    2,
  )
  toast.success(`Sandbox ${provider} charge simulated`)
}

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1),
  )
  return sorted[idx]
}

/** Deterministic-ish sandbox latency profiles for UG MoMo rails. */
function sampleLatency(provider: ProviderKey) {
  // MTN: slightly faster mean, tighter spread; Airtel: higher mean + more tail
  if (provider === 'mtn') {
    const base = 160 + Math.random() * 140
    const spike = Math.random() < 0.06 ? 180 + Math.random() * 220 : 0
    return Math.round(base + spike)
  }
  const base = 210 + Math.random() * 180
  const spike = Math.random() < 0.1 ? 250 + Math.random() * 350 : 0
  return Math.round(base + spike)
}

function sampleSuccess(provider: ProviderKey) {
  // Sandbox success rates — MTN slightly higher in this demo profile
  const rate = provider === 'mtn' ? 0.972 : 0.958
  return Math.random() < rate
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms))
}

async function runBenchmark() {
  const n = Math.min(200, Math.max(10, Number(benchCount.value) || 50))
  running.value = true
  progress.value = 0
  results.value = []

  const providers: { key: ProviderKey; label: string; payment_type: string }[] =
    [
      {
        key: 'mtn',
        label: 'MTN MoMo UG',
        payment_type: 'mobilemoneyuganda',
      },
      {
        key: 'airtel',
        label: 'Airtel Money UG',
        payment_type: 'mobilemoneyairtel',
      },
    ]

  const collected: BenchRow[] = []
  const totalSteps = n * providers.length
  let done = 0

  for (const p of providers) {
    const samples: number[] = []
    let success = 0
    let failed = 0

    for (let i = 0; i < n; i++) {
      const ok = sampleSuccess(p.key)
      const ms = sampleLatency(p.key)
      // Simulate network wait scaled down so UI stays snappy
      await sleep(Math.min(18, Math.round(ms / 40)))
      samples.push(ms)
      if (ok) success += 1
      else failed += 1
      done += 1
      progress.value = Math.round((done / totalSteps) * 100)
    }

    const sorted = [...samples].sort((a, b) => a - b)
    const avg = Math.round(samples.reduce((s, v) => s + v, 0) / samples.length)
    collected.push({
      provider: p.label,
      key: p.key,
      runs: n,
      success,
      failed,
      successRate: Math.round((success / n) * 1000) / 10,
      avgMs: avg,
      p50Ms: percentile(sorted, 50),
      p95Ms: percentile(sorted, 95),
      minMs: sorted[0],
      maxMs: sorted[sorted.length - 1],
      samples,
    })
  }

  results.value = collected
  const mtn = collected.find((r) => r.key === 'mtn')!
  const airtel = collected.find((r) => r.key === 'airtel')!
  const w =
    mtn.avgMs === airtel.avgMs
      ? 'Tie'
      : mtn.avgMs < airtel.avgMs
        ? 'MTN'
        : 'Airtel'
  history.value.unshift({
    at: new Date().toLocaleString(),
    mtnAvg: mtn.avgMs,
    airtelAvg: airtel.avgMs,
    winner: w,
  })
  if (history.value.length > 8) history.value.pop()

  running.value = false
  toast.success(`Benchmark complete · faster rail: ${w}`)
}

function barWidth(ms: number) {
  const max = Math.max(...results.value.map((r) => r.p95Ms), 1)
  return `${Math.max(8, Math.round((ms / max) * 100))}%`
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Sandbox simulator" />
    <div class="flex flex-wrap gap-2">
      <Button
        v-if="tab === 'charge'"
        variant="solid"
        icon-left="lucide-play"
        label="Run charge"
        @click="run"
      />
      <Button
        v-else
        variant="solid"
        icon-left="lucide-gauge"
        :label="running ? `Running… ${progress}%` : 'Run MTN vs Airtel'"
        :disabled="running"
        @click="runBenchmark"
      />
    </div>
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Test sandbox against {{ apiBase }} without live rails — charge simulator
      plus MTN MoMo vs Airtel Money latency / success benchmarks (UGX).
    </p>

    <TabButtons v-model="tab" :options="tabs" />

    <section v-if="tab === 'charge'" class="webale-section">
      <div class="grid gap-3 sm:grid-cols-2">
        <FormControl v-model="amount" label="Amount (UGX)" />
        <FormControl v-model="currency" label="Currency" />
        <FormControl
          v-model="channel"
          type="select"
          label="Channel"
          :options="channelOptions"
        />
        <FormControl v-model="phone" label="MSISDN" />
        <FormControl
          v-model="email"
          class="sm:col-span-2"
          label="Customer email"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <Badge :label="`Env: ${session.environment}`" theme="amber" variant="subtle" />
        <Badge label="Sandbox only" theme="blue" variant="subtle" />
        <Badge label="UGX" theme="green" variant="subtle" />
      </div>
      <pre v-if="lastResult" class="webale-code">{{ lastResult }}</pre>
    </section>

    <section v-else class="webale-section">
      <div class="grid gap-3 sm:grid-cols-3">
        <FormControl
          v-model="benchCount"
          label="Charges per provider"
          type="number"
        />
        <FormControl v-model="benchAmount" label="Amount (UGX)" />
        <FormControl v-model="currency" label="Currency" />
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge label="MTN MoMo UG" theme="amber" variant="subtle" />
        <Badge label="Airtel Money UG" theme="red" variant="subtle" />
        <Badge label="Sandbox profiles" theme="blue" variant="subtle" />
      </div>

      <div
        v-if="running"
        class="overflow-hidden rounded-4 border border-outline-gray-1 bg-surface-white"
      >
        <div
          class="h-2 bg-teal-600 transition-all"
          :style="{ width: `${progress}%` }"
        />
        <p class="px-3 py-2 text-xs text-ink-gray-5">
          Running sandbox benchmark… {{ progress }}%
        </p>
      </div>

      <StatCards v-if="compareStats.length" :stats="compareStats" />

      <div
        v-if="winner"
        class="webale-card flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <p class="text-xs uppercase tracking-wide text-ink-gray-5">
            Faster average latency
          </p>
          <p class="text-lg font-semibold text-ink-gray-9">{{ winner }}</p>
        </div>
        <Badge
          :label="`${benchCount} × 2 providers`"
          theme="gray"
          variant="subtle"
        />
      </div>

      <div v-if="results.length" class="webale-panel">
        <div
          v-for="r in results"
          :key="r.key"
          class="webale-panel-row flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <div class="min-w-[10rem] space-y-1">
            <p class="text-sm-medium">{{ r.provider }}</p>
            <p class="text-xs text-ink-gray-5">
              {{ r.success }}/{{ r.runs }} ok · {{ r.successRate }}%
            </p>
          </div>
          <div class="min-w-0 flex-1 space-y-2">
            <div>
              <div class="mb-1 flex justify-between text-xs text-ink-gray-5">
                <span>Avg {{ r.avgMs }} ms</span>
                <span>p95 {{ r.p95Ms }} ms</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-surface-gray-2">
                <div
                  class="h-full rounded-full"
                  :class="r.key === 'mtn' ? 'bg-amber-500' : 'bg-rose-500'"
                  :style="{ width: barWidth(r.avgMs) }"
                />
              </div>
            </div>
            <div class="flex flex-wrap gap-3 text-xs text-ink-gray-6">
              <span>p50 {{ r.p50Ms }} ms</span>
              <span>min {{ r.minMs }} ms</span>
              <span>max {{ r.maxMs }} ms</span>
              <span>{{ Number(benchAmount).toLocaleString() }} UGX</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="results.length" class="grid gap-3 sm:grid-cols-2">
        <NumberCard
          v-for="r in results"
          :key="`${r.key}-rate`"
          :title="`${r.provider} success`"
          :value="r.successRate"
          suffix="%"
          :delta-caption="`${r.failed} failed`"
        />
      </div>

      <section v-if="history.length" class="webale-section">
        <h2 class="webale-section-title">Recent benchmark runs</h2>
        <div class="webale-panel">
          <div
            v-for="(h, i) in history"
            :key="i"
            class="webale-panel-row items-center"
          >
            <div>
              <p class="text-sm-medium">Winner · {{ h.winner }}</p>
              <p class="text-xs text-ink-gray-5">{{ h.at }}</p>
            </div>
            <p class="text-sm text-ink-gray-7">
              MTN {{ h.mtnAvg }} ms · Airtel {{ h.airtelAvg }} ms
            </p>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
