<script setup lang="ts">
import { useRoute } from 'vue-router'
import { MobileNav, MobileNavItem } from 'frappe-ui'
import { session } from '../data/platform'

const route = useRoute()

function active(path: string) {
  if (path === '/') return route.path === '/'
  if (path === '/tenants') {
    return route.path === '/tenants' || route.path.startsWith('/tenants/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

const tenant360Route = () =>
  session.tenantId ? `/tenants/${session.tenantId}` : '/tenants'
</script>

<template>
  <MobileNav class="webale-mobile-nav">
    <MobileNavItem
      label="Home"
      icon="lucide-layout-dashboard"
      route="/"
      :active="active('/')"
    />
    <MobileNavItem
      label="Tenants"
      icon="lucide-building-2"
      route="/tenants"
      :active="active('/tenants')"
    />
    <MobileNavItem
      label="360"
      icon="lucide-scan-search"
      :route="tenant360Route()"
      :active="route.path.startsWith('/tenants/')"
    />
    <MobileNavItem
      label="Payments"
      icon="lucide-arrow-left-right"
      route="/transactions"
      :active="active('/transactions')"
    />
    <MobileNavItem
      label="More"
      icon="lucide-ellipsis"
      route="/more"
      :active="active('/more') || active('/developers')"
    />
  </MobileNav>
</template>
