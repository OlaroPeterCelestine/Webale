<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Badge,
  Button,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  toast,
} from 'frappe-ui'
import { setTenant, tenants } from '../data/platform'

const router = useRouter()
const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return tenants
  return tenants.filter((t) =>
    [t.name, t.slug, t.country, t.industry, t.email, t.status]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})

function statusTheme(status: string) {
  if (status === 'Active') return 'green'
  if (status === 'Pending KYC') return 'amber'
  return 'red'
}

function open360(id: string) {
  router.push(`/tenants/${id}`)
}

function enterTenant(id: string) {
  setTenant(id)
  toast.success('Switched tenant context')
  router.push('/')
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Tenants" />
    <Button
      variant="solid"
      icon-left="lucide-plus"
      label="Invite tenant"
      @click="toast.success('Demo: tenant invite sent')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Each tenant is an isolated business account. Open Tenant 360 for a full
      profile across payments, balances, risk, and developers.
    </p>

    <FormControl
      v-model="query"
      class="max-w-md"
      label="Search"
      placeholder="Name, country, industry…"
    />

    <div
      class="overflow-hidden rounded-6 border border-outline-gray-1 bg-surface-white"
    >
      <div
        v-for="t in filtered"
        :key="t.id"
        class="flex flex-wrap items-start justify-between gap-3 border-b border-outline-gray-1 px-4 py-4 last:border-b-0"
      >
        <button
          type="button"
          class="min-w-0 flex-1 space-y-1 text-start"
          @click="open360(t.id)"
        >
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium text-ink-gray-9">{{ t.name }}</p>
            <Badge
              :label="t.status"
              :theme="statusTheme(t.status)"
              variant="subtle"
            />
            <Badge :label="t.plan" theme="blue" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">
            {{ t.country }} · {{ t.industry }} · {{ t.slug }}
          </p>
          <p class="text-xs text-ink-gray-5">
            {{ t.email }} · since {{ t.createdAt }}
          </p>
        </button>
        <div class="flex flex-col items-stretch gap-2 sm:items-end">
          <p class="text-sm-medium text-ink-gray-9">
            Live UGX {{ t.liveVolume.toLocaleString() }}
          </p>
          <div class="flex flex-wrap gap-2">
            <Button
              label="Tenant 360"
              icon-left="lucide-scan-search"
              @click="open360(t.id)"
            />
            <Button label="Enter" @click="enterTenant(t.id)" />
          </div>
        </div>
      </div>
      <p
        v-if="!filtered.length"
        class="px-4 py-8 text-center text-sm text-ink-gray-5"
      >
        No tenants match your search.
      </p>
    </div>
  </div>
</template>
