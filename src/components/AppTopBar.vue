<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, Badge, Button, FormControl } from 'frappe-ui'
import { authSession, logout } from '../data/auth'
import {
  currentTenant,
  isPlatformView,
  platform,
  platformKpis,
  session,
  setEnvironment,
  setTenant,
  tenants,
  type Environment,
} from '../data/platform'

const router = useRouter()

const tenantOptions = computed(() => [
  { label: 'All tenants (Platform)', value: '' },
  ...tenants.map((t) => ({
    label: `${t.name} · ${t.country}`,
    value: t.id,
  })),
])

const envOptions = [
  { label: 'Live', value: 'live' },
  { label: 'Test', value: 'test' },
]

const tenantSelect = computed({
  get: () => session.tenantId || '',
  set: (v: string) => setTenant(v || null),
})

const envSelect = computed({
  get: () => session.environment,
  set: (v: string) => setEnvironment(v as Environment),
})

const badge = computed(() =>
  platformKpis.value.failedToday > 0
    ? String(Math.min(platformKpis.value.failedToday, 9))
    : '',
)

const displayName = computed(
  () => authSession.value?.name || 'Platform Admin',
)

function onLogout() {
  logout()
  router.push({ name: 'login' })
}

function openTenant360() {
  if (!session.tenantId) {
    router.push('/tenants')
    return
  }
  router.push(`/tenants/${session.tenantId}`)
}
</script>

<template>
  <header class="webale-topbar">
    <RouterLink to="/" class="webale-brand">
      <span class="webale-mark">W</span>
      <span class="webale-brand-text">
        <span class="block text-sm font-semibold text-ink-gray-9">{{
          platform.name
        }}</span>
        <span class="block text-xs text-ink-gray-5">{{
          isPlatformView
            ? 'Platform console'
            : currentTenant?.name || 'Tenant'
        }}</span>
      </span>
    </RouterLink>

    <div class="webale-topbar-controls">
      <FormControl
        v-model="tenantSelect"
        type="select"
        class="webale-topbar-tenant"
        :options="tenantOptions"
      />
      <FormControl
        v-model="envSelect"
        type="select"
        class="webale-topbar-env"
        :options="envOptions"
      />
    </div>

    <div class="webale-topbar-actions">
      <Badge
        :label="session.environment === 'live' ? 'Live' : 'Test'"
        :theme="session.environment === 'live' ? 'green' : 'amber'"
        variant="subtle"
        class="webale-topbar-badge"
      />
      <Button
        class="webale-topbar-hide-sm"
        label="360"
        icon-left="lucide-scan-search"
        @click="openTenant360"
      />
      <button
        type="button"
        class="relative inline-flex size-8 items-center justify-center rounded-4 text-ink-gray-7 hover:bg-surface-gray-2"
        aria-label="Notifications"
      >
        <span class="lucide-bell size-4" aria-hidden="true" />
        <span
          v-if="badge"
          class="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white"
        >
          {{ badge }}
        </span>
      </button>
      <Avatar :label="displayName" size="md" class="webale-topbar-hide-xs" />
      <Button
        class="webale-topbar-hide-md"
        label="Developers"
        icon-left="lucide-code-2"
        @click="$router.push('/developers')"
      />
      <Button
        label="Log out"
        icon-left="lucide-log-out"
        class="webale-topbar-logout"
        @click="onLogout"
      />
    </div>
  </header>
</template>
