<script setup lang="ts">
import {
  Badge,
  Button,
  PageHeader,
  PageHeaderTitle,
  toast,
} from 'frappe-ui'
import { kycCases, tenantName } from '../data/platform'

function statusTheme(status: string) {
  if (status === 'Approved') return 'green'
  if (status === 'In review') return 'blue'
  if (status === 'Needs info') return 'amber'
  return 'red'
}

function riskTheme(risk: string) {
  if (risk === 'Low') return 'green'
  if (risk === 'Medium') return 'amber'
  return 'red'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="KYC queue" />
    <Button
      variant="solid"
      icon-left="lucide-badge-check"
      label="Review next"
      @click="toast.success('Demo: opened next KYC case')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Compliance onboarding — documents, risk scoring and go-live approval for
      each tenant.
    </p>

    <section class="webale-section">
      <div class="webale-panel">
        <div
          v-for="c in kycCases"
          :key="c.id"
          class="webale-panel-row"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium text-ink-gray-9">{{ c.business }}</p>
              <Badge
                :label="c.status"
                :theme="statusTheme(c.status)"
                variant="subtle"
              />
              <Badge
                :label="`Risk ${c.risk}`"
                :theme="riskTheme(c.risk)"
                variant="subtle"
              />
            </div>
            <p class="text-sm text-ink-gray-7">
              {{ c.country }} · {{ tenantName(c.tenantId) }}
            </p>
            <p class="text-xs text-ink-gray-5">
              {{ c.documents }} · submitted {{ c.submittedAt }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <Button
              v-if="c.status === 'In review' || c.status === 'Needs info'"
              variant="solid"
              label="Approve"
              @click="toast.success(`Demo: approved ${c.business}`)"
            />
            <Button
              label="Open"
              @click="toast.info(`Demo: case ${c.id}`)"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
