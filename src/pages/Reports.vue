<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { reportJobs } from '../data/features'
function theme(s: string) {
  if (s === 'Ready') return 'green'
  if (s === 'Running') return 'amber'
  return 'red'
}
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Reports" />
    <Button variant="solid" icon-left="lucide-download" label="New export" @click="toast.success('Demo: report job started')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">BI exports for collections, settlements, disputes, and FX.</p>
    <div class="webale-panel">
      <div v-for="r in reportJobs" :key="r.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ r.name }}</p>
            <Badge :label="r.status" :theme="theme(r.status)" variant="subtle" />
            <Badge :label="r.format" theme="gray" variant="subtle" />
          </div>
          <p class="text-xs text-ink-gray-5">{{ r.range }} · {{ r.createdAt }}</p>
        </div>
        <Button v-if="r.status === 'Ready'" label="Download" @click="toast.success('Demo: download started')" />
      </div>
    </div>
  </div>
</template>
