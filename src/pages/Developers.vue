<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Badge,
  Button,
  PageHeader,
  PageHeaderTitle,
  TabButtons,
  toast,
} from 'frappe-ui'
import {
  apiBase,
  apiEndpoints,
  currentTenant,
  isPlatformView,
  sdkSnippets,
  session,
} from '../data/platform'

const router = useRouter()
const sdkTab = ref(sdkSnippets[0]?.lang || 'cURL')
const selectedPath = ref(apiEndpoints[0]?.path || '')

const tabs = sdkSnippets.map((s) => ({ label: s.lang, value: s.lang }))

const activeSdk = computed(
  () => sdkSnippets.find((s) => s.lang === sdkTab.value) || sdkSnippets[0],
)

const selected = computed(
  () =>
    apiEndpoints.find((e) => e.path === selectedPath.value) || apiEndpoints[0],
)

function methodTheme(method: string) {
  if (method === 'GET') return 'blue'
  if (method === 'POST') return 'green'
  if (method === 'DELETE') return 'red'
  return 'amber'
}

function copyBase() {
  void navigator.clipboard?.writeText(apiBase)
  toast.success('API base copied')
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Developers" />
    <div class="flex flex-wrap gap-2">
      <Button
        icon-left="lucide-key-round"
        label="API keys"
        @click="router.push('/api-keys')"
      />
      <Button
        variant="solid"
        icon-left="lucide-webhook"
        label="Webhooks"
        @click="router.push('/webhooks')"
      />
    </div>
  </PageHeader>

  <div class="webale-page webale-page--workspace">
    <section class="webale-hero">
      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-wide text-ink-gray-5">
          Webale API ·
          {{ isPlatformView ? 'platform' : currentTenant?.slug }} ·
          {{ session.environment }}
        </p>
        <h1 class="text-2xl-semibold text-ink-gray-9">Build on Webale</h1>
        <p class="max-w-xl text-p-base text-ink-gray-6">
          REST API for multi-tenant charges, transfers, payment links and
          webhooks — same developer workflow as Flutterwave / Paystack.
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Badge label="REST v1" theme="blue" variant="subtle" />
        <Badge label="MTN · Airtel · Card" theme="green" variant="subtle" />
        <Badge label="Webhooks" theme="gray" variant="subtle" />
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Base URL</h2>
      <div class="webale-panel">
        <div class="webale-panel-row items-center">
          <code class="font-mono text-sm text-ink-gray-9">{{ apiBase }}</code>
          <Button label="Copy" @click="copyBase" />
        </div>
        <div class="webale-panel-row">
          <p class="text-sm text-ink-gray-7">
            Auth header:
            <span class="font-mono text-xs"
              >Authorization: Bearer wb_{{ session.environment }}_sk_***</span
            >
          </p>
        </div>
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">Quickstart</h2>
      <TabButtons v-model="sdkTab" :options="tabs" />
      <pre class="webale-code">{{ activeSdk?.code }}</pre>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">API reference</h2>
      <div class="grid gap-4 lg:grid-cols-[minmax(0,14rem)_1fr]">
        <div class="webale-panel h-fit">
          <button
            v-for="ep in apiEndpoints"
            :key="ep.path"
            type="button"
            class="webale-panel-row w-full text-left transition hover:bg-surface-gray-1"
            :class="
              selectedPath === ep.path ? 'bg-surface-gray-1' : ''
            "
            @click="selectedPath = ep.path"
          >
            <div class="min-w-0 space-y-1">
              <Badge
                :label="ep.method"
                :theme="methodTheme(ep.method)"
                variant="subtle"
              />
              <p class="truncate font-mono text-xs text-ink-gray-8">
                {{ ep.path }}
              </p>
            </div>
          </button>
        </div>

        <div v-if="selected" class="webale-section">
          <div class="flex flex-wrap items-center gap-2">
            <Badge
              :label="selected.method"
              :theme="methodTheme(selected.method)"
              variant="subtle"
            />
            <code class="font-mono text-sm text-ink-gray-9"
              >{{ apiBase }}{{ selected.path }}</code
            >
          </div>
          <p class="text-p-base text-ink-gray-6">{{ selected.summary }}</p>
          <pre v-if="selected.body" class="webale-code">{{ selected.body }}</pre>
          <div v-else class="webale-card text-sm text-ink-gray-6">
            No request body — pass the resource id in the path.
          </div>
          <pre class="webale-code">{
  "status": "success",
  "message": "Charge initiated",
  "data": {
    "id": "txn_9001",
    "tx_ref": "WB-ORD-1001",
    "flw_ref": "WB-MM-77421",
    "status": "pending",
    "amount": 15000,
    "currency": "UGX",
    "payment_type": "mobilemoneyuganda"
  }
}</pre>
        </div>
      </div>
    </section>

    <section class="webale-section">
      <h2 class="webale-section-title">SDKs & tools</h2>
      <div class="webale-card-grid sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="sdk in [
            { name: 'Node.js', pkg: 'webale-node' },
            { name: 'Python', pkg: 'webale' },
            { name: 'PHP', pkg: 'webale/php' },
            { name: 'Go', pkg: 'github.com/webale/go' },
          ]"
          :key="sdk.name"
          class="webale-card space-y-2"
        >
          <p class="text-sm-semibold text-ink-gray-9">{{ sdk.name }}</p>
          <p class="font-mono text-xs text-ink-gray-5">{{ sdk.pkg }}</p>
          <Button
            label="Copy install"
            @click="
              toast.success(`Demo: ${sdk.pkg} install command copied`)
            "
          />
        </div>
      </div>
    </section>
  </div>
</template>
