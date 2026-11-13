<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { feeRules } from '../data/features'
</script>
<template>
  <PageHeader>
    <PageHeaderTitle title="Fees & pricing" />
    <Button variant="solid" icon-left="lucide-percent" label="Add rule" @click="toast.success('Demo: fee rule saved')" />
  </PageHeader>
  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">Platform fee schedules by channel and country.</p>
    <div class="webale-panel">
      <div v-for="f in feeRules" :key="f.id" class="webale-panel-row items-center">
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm-medium">{{ f.channel }}</p>
            <Badge :label="f.country" theme="gray" variant="subtle" />
            <Badge :label="f.status" :theme="f.status === 'Active' ? 'green' : 'amber'" variant="subtle" />
          </div>
          <p class="text-sm text-ink-gray-7">{{ f.fee }}<template v-if="f.cap"> · cap {{ f.cap }}</template></p>
        </div>
      </div>
    </div>
  </div>
</template>
