<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import {
  isPlatformView,
  scopedWebhooks,
  tenantName,
} from '../data/platform'
import { scopedWebhookDeliveries } from '../data/features'

const selectedId = ref(scopedWebhooks.value[0]?.id || '')

const deliveries = computed(() =>
  scopedWebhookDeliveries.value.filter(
    (d) => !selectedId.value || d.webhookId === selectedId.value,
  ),
)

function deliveryTheme(s: string) {
  if (s === 'Delivered') return 'green'
  if (s === 'Retrying') return 'amber'
  return 'red'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Webhooks" />
    <Button
      variant="solid"
      icon-left="lucide-plus"
      label="Add endpoint"
      @click="toast.success('Demo: webhook endpoint saved')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Per-tenant endpoints plus delivery attempts and retry controls.
    </p>

    <div class="webale-panel">
      <button
        v-for="w in scopedWebhooks"
        :key="w.id"
        type="button"
        class="webale-panel-row w-full items-start text-start"
        :class="selectedId === w.id ? 'bg-surface-gray-1' : ''"
        @click="selectedId = w.id"
      >
        <div class="min-w-0 space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="truncate font-mono text-sm text-ink-gray-9">{{ w.url }}</p>
            <Badge
              :label="w.status"
              :theme="w.status === 'Active' ? 'green' : 'red'"
              variant="subtle"
            />
          </div>
          <p class="text-xs text-ink-gray-6">{{ w.events }}</p>
          <p class="text-xs text-ink-gray-5">
            <template v-if="isPlatformView"
              >{{ tenantName(w.tenantId) }} ·
            </template>
            Last delivery {{ w.lastDelivery }}
          </p>
        </div>
      </button>
    </div>

    <section class="webale-section">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="webale-section-title">Delivery log</h2>
        <Button
          icon-left="lucide-rotate-cw"
          label="Retry failed"
          @click="toast.success('Demo: failed deliveries re-queued')"
        />
      </div>
      <div class="webale-panel">
        <div
          v-for="d in deliveries"
          :key="d.id"
          class="webale-panel-row items-center"
        >
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-mono text-sm-medium">{{ d.event }}</p>
              <Badge
                :label="d.status"
                :theme="deliveryTheme(d.status)"
                variant="subtle"
              />
            </div>
            <p class="text-xs text-ink-gray-5">
              HTTP {{ d.responseCode }} · {{ d.attempts }} attempt{{
                d.attempts === 1 ? '' : 's'
              }}
              · {{ d.at }}
              <template v-if="isPlatformView">
                · {{ tenantName(d.tenantId) }}
              </template>
            </p>
          </div>
          <Button
            v-if="d.status !== 'Delivered'"
            label="Retry"
            @click="toast.success(`Demo: retry ${d.event}`)"
          />
        </div>
        <p
          v-if="!deliveries.length"
          class="px-4 py-8 text-center text-sm text-ink-gray-5"
        >
          No deliveries for this endpoint.
        </p>
      </div>
    </section>
  </div>
</template>
