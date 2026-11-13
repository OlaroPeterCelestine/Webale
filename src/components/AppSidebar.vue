<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from 'frappe-ui'
import { authSession, logout } from '../data/auth'
import {
  currentTenant,
  isPlatformView,
  platform,
  platformNav,
} from '../data/platform'

const route = useRoute()
const router = useRouter()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  if (path === '/tenants') {
    return route.path === '/tenants' || route.path.startsWith('/tenants/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function group(title: string, routes: string[]) {
  return {
    title,
    items: platformNav.filter((i) => routes.includes(i.route)),
  }
}

const navGroups = [
  group('Operations', [
    '/',
    '/tenants',
    '/balances',
    '/transactions',
    '/refunds',
    '/transfers',
    '/customers',
    '/settlements',
    '/settlement-accounts',
  ]),
  group('Products', [
    '/invoices',
    '/subscriptions',
    '/virtual-accounts',
    '/beneficiaries',
    '/subaccounts',
    '/payment-links',
    '/checkout',
    '/fx',
  ]),
  group('Risk & compliance', [
    '/disputes',
    '/fraud',
    '/identity',
    '/kyc',
    '/logs',
  ]),
  group('Admin', [
    '/team',
    '/fees',
    '/notifications',
    '/reports',
    '/support',
    '/system',
  ]),
  group('Developers', [
    '/simulator',
    '/webhooks',
    '/events',
    '/api-keys',
    '/developers',
  ]),
]

function signOut() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <Sidebar
    :collapsible="true"
    width="17.5rem"
    collapsed-width="3.25rem"
    class="webale-sidebar border-e border-outline-gray-1"
  >
    <div class="webale-sidebar-header">
      <SidebarHeader
        :title="platform.name"
        :subtitle="
          isPlatformView
            ? 'Enterprise admin'
            : currentTenant?.slug || 'Tenant desk'
        "
        class="min-w-0 flex-1"
      >
        <template #prefix>
          <span class="webale-mark !size-8 text-sm">W</span>
        </template>
      </SidebarHeader>
    </div>

    <div class="webale-sidebar-scroll">
      <div
        v-for="groupItem in navGroups"
        :key="groupItem.title"
        class="webale-sidebar-group"
      >
        <SidebarLabel divider>{{ groupItem.title }}</SidebarLabel>
        <div class="webale-sidebar-items">
          <SidebarItem
            v-for="item in groupItem.items"
            :key="item.route"
            :label="item.label"
            :icon="item.icon"
            :route="item.route"
            :active="isActive(item.route)"
          />
        </div>
      </div>
    </div>

    <div class="webale-sidebar-footer">
      <SidebarItem
        :label="authSession?.name || 'Account'"
        icon="lucide-user-round"
        route="/more"
        :active="route.path === '/more'"
      />
      <SidebarItem label="Log out" icon="lucide-log-out" @click="signOut" />
    </div>
  </Sidebar>
</template>
