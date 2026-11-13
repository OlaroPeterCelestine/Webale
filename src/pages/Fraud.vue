<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { fraudRules } from '../data/platform'

function actionTheme(a: string) {
  if (a === 'Block') return 'red'
  if (a === 'Review') return 'amber'
  return 'green'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Fraud rules" />
    <Button variant="solid" icon-left="lucide-plus" label="Add rule" @click="toast.success('Demo: rule draft created')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Velocity, BIN and device rules that block or send charges for review.</p>
    <section class="webale-section">
      <div class="webale-panel">
        <div v-for="r in fraudRules" :key="r.id" class="webale-panel-row items-center">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium">{{ r.name }}</p>
              <Badge :label="r.action" :theme="actionTheme(r.action)" variant="subtle" />
              <Badge :label="r.status" :theme="r.status === 'Active' ? 'green' : 'gray'" variant="subtle" />
            </div>
            <p class="text-sm text-ink-gray-7">{{ r.condition }}</p>
            <p class="text-xs text-ink-gray-5">{{ r.hits }} hits · {{ r.id }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
