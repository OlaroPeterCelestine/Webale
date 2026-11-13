<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { notifications } from '../data/features'
const router = useRouter()
const items = ref(notifications.map((n) => ({ ...n })))
const unread = computed(() => items.value.filter((n) => !n.read).length)
function markAll() {
  items.value.forEach((n) => (n.read = true))
  toast.success('All notifications marked read')
}
function open(n: (typeof items.value)[0]) {
  n.read = true
  if (n.href) router.push(n.href)
}
function theme(s: string) {
  if (s === 'success') return 'green'
  if (s === 'warning') return 'amber'
  if (s === 'error') return 'red'
  return 'blue'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Notifications" />
    <Button label="Mark all read" :disabled="!unread" @click="markAll" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">{{ unread }} unread · ops alerts for KYC, failures, settlements.</p>
    <div class="webale-panel">
      <button v-for="n in items" :key="n.id" type="button" class="webale-panel-row w-full items-start text-start" @click="open(n)">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium" :class="n.read ? 'text-ink-gray-7' : 'text-ink-gray-9'">{{ n.title }}</p>
            <Badge :label="n.severity" :theme="theme(n.severity)" variant="subtle" />
            <Badge v-if="!n.read" label="New" theme="red" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-6">{{ n.body }}</p>
          <p class="text-xs text-ink-gray-5">{{ n.at }}</p>
        </div>
      </button>
    </div>
  </div>
</template>
