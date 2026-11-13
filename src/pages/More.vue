<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button, PageHeader, PageHeaderTitle } from 'frappe-ui'
import { platformNav, session } from '../data/platform'

const router = useRouter()

const groups = [
  {
    title: 'Operations',
    routes: [
      '/',
      '/tenants',
      '/balances',
      '/transactions',
      '/refunds',
      '/transfers',
      '/customers',
      '/settlements',
      '/settlement-accounts',
    ],
  },
  {
    title: 'Products',
    routes: [
      '/invoices',
      '/subscriptions',
      '/virtual-accounts',
      '/beneficiaries',
      '/subaccounts',
      '/payment-links',
      '/checkout',
      '/fx',
    ],
  },
  {
    title: 'Risk & compliance',
    routes: ['/disputes', '/fraud', '/identity', '/kyc', '/logs'],
  },
  {
    title: 'Admin',
    routes: [
      '/team',
      '/fees',
      '/notifications',
      '/reports',
      '/support',
      '/system',
    ],
  },
  {
    title: 'Developers',
    routes: [
      '/simulator',
      '/webhooks',
      '/events',
      '/api-keys',
      '/developers',
    ],
  },
]

function itemsFor(routes: string[]) {
  return platformNav.filter((i) => routes.includes(i.route))
}

function open360() {
  router.push(session.tenantId ? `/tenants/${session.tenantId}` : '/tenants')
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="All features" />
    <Button
      variant="solid"
      icon-left="lucide-scan-search"
      label="Tenant 360"
      @click="open360"
    />
  </PageHeader>

  <div class="webale-page max-w-3xl">
    <p class="text-p-base text-ink-gray-6">
      Full platform desk — same features as the sidebar, sized for mobile.
    </p>

    <section
      v-for="group in groups"
      :key="group.title"
      class="webale-section"
    >
      <h2 class="webale-section-title">{{ group.title }}</h2>
      <div class="webale-panel">
        <button
          v-for="item in itemsFor(group.routes)"
          :key="item.route"
          type="button"
          class="webale-panel-row w-full items-center text-start"
          @click="router.push(item.route)"
        >
          <span class="text-sm-medium text-ink-gray-9">{{ item.label }}</span>
          <span class="lucide-chevron-right size-4 text-ink-gray-4" />
        </button>
      </div>
    </section>
  </div>
</template>
