<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  DesktopShell,
  FrappeUIProvider,
  MobileShell,
} from 'frappe-ui'
import AppTopBar from './components/AppTopBar.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppMobileNav from './components/AppMobileNav.vue'

const route = useRoute()
const isLogin = computed(
  () => route.name === 'login' || route.meta.public === true,
)

const isMobile = ref(false)
let mql: MediaQueryList | null = null

function syncViewport() {
  isMobile.value = Boolean(mql?.matches)
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 767px)')
  syncViewport()
  mql.addEventListener('change', syncViewport)
})

onUnmounted(() => {
  mql?.removeEventListener('change', syncViewport)
})
</script>

<template>
  <FrappeUIProvider>
    <RouterView v-if="isLogin" />
    <div
      v-else
      class="webale-shell flex h-screen flex-col bg-surface-base text-ink-gray-8"
    >
      <AppTopBar />
      <div class="relative min-h-0 flex-1">
        <MobileShell v-if="isMobile" class="webale-mobile-shell">
          <RouterView v-slot="{ Component, route: r }">
            <Suspense timeout="0">
              <component :is="Component" :key="r.path" />
              <template #fallback>
                <div class="webale-page-loading">Loading…</div>
              </template>
            </Suspense>
          </RouterView>
          <template #nav>
            <AppMobileNav />
          </template>
        </MobileShell>
        <DesktopShell v-else>
          <template #sidebar>
            <AppSidebar />
          </template>
          <RouterView v-slot="{ Component, route: r }">
            <Suspense timeout="0">
              <component :is="Component" :key="r.path" />
              <template #fallback>
                <div class="webale-page-loading">Loading…</div>
              </template>
            </Suspense>
          </RouterView>
        </DesktopShell>
      </div>
    </div>
  </FrappeUIProvider>
</template>
