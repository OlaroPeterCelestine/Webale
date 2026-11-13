<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from 'frappe-ui'
import {
  currentTenant,
  isPlatformView,
  platform,
  platformNav,
} from '../data/platform'

const route = useRoute()

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  if (path === '/tenants') {
    return route.path === '/tenants' || route.path.startsWith('/tenants/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function group(routes: string[]) {
  return platformNav.filter((i) => routes.includes(i.route))
}

const ops = group([
  '/',
  '/tenants',
  '/balances',
  '/transactions',
  '/refunds',
  '/transfers',
  '/customers',
  '/subaccounts',
  '/payment-links',
  '/settlements',
])
const risk = group(['/disputes', '/fraud', '/kyc', '/logs'])
const admin = group(['/team', '/system'])
const developers = group([
  '/simulator',
  '/webhooks',
  '/api-keys',
  '/developers',
])
</script>

<template>
  <Sidebar
    :collapsible="true"
    width="17.5rem"
    collapsed-width="3.25rem"
    class="webale-sidebar border-e border-outline-gray-1"
  >
    <SidebarHeader
      :title="platform.name"
      :subtitle="
        isPlatformView
          ? 'Enterprise admin'
          : currentTenant?.slug || 'Tenant desk'
      "
    >
      <template #prefix>
        <span class="webale-mark !size-8 text-sm">W</span>
      </template>
    </SidebarHeader>

    <div class="webale-sidebar-scroll">
      <div>
        <SidebarLabel divider>Operations</SidebarLabel>
        <SidebarItem
          v-for="item in ops"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          :active="isActive(item.route)"
        />
      </div>
      <div>
        <SidebarLabel divider>Risk & compliance</SidebarLabel>
        <SidebarItem
          v-for="item in risk"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          :active="isActive(item.route)"
        />
      </div>
      <div>
        <SidebarLabel divider>Admin</SidebarLabel>
        <SidebarItem
          v-for="item in admin"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          :active="isActive(item.route)"
        />
      </div>
      <div>
        <SidebarLabel divider>Developers</SidebarLabel>
        <SidebarItem
          v-for="item in developers"
          :key="item.route"
          :label="item.label"
          :icon="item.icon"
          :route="item.route"
          :active="isActive(item.route)"
        />
      </div>
    </div>
  </Sidebar>
</template>
