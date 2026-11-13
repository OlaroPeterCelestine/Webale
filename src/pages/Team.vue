<script setup lang="ts">
import { Badge, Button, PageHeader, PageHeaderTitle, toast } from 'frappe-ui'
import { teamMembers } from '../data/platform'

function statusTheme(status: string) {
  if (status === 'Active') return 'green'
  if (status === 'Invited') return 'amber'
  return 'gray'
}

function roleTheme(role: string) {
  if (role === 'Owner' || role === 'Admin') return 'blue'
  if (role === 'Finance') return 'green'
  if (role === 'Support') return 'amber'
  return 'gray'
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Team & roles" />
    <Button
      variant="solid"
      icon-left="lucide-user-plus"
      label="Invite member"
      @click="toast.success('Demo: invite sent')"
    />
  </PageHeader>

  <div class="webale-page max-w-5xl">
    <p class="text-p-base text-ink-gray-6">
      Enterprise RBAC for platform operators — Owner, Admin, Finance, Support,
      Developer, Viewer.
    </p>

    <section class="webale-section">
      <div class="webale-panel">
        <div
          v-for="m in teamMembers"
          :key="m.id"
          class="webale-panel-row items-center"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm-medium text-ink-gray-9">{{ m.name }}</p>
              <Badge
                :label="m.role"
                :theme="roleTheme(m.role)"
                variant="subtle"
              />
              <Badge
                :label="m.status"
                :theme="statusTheme(m.status)"
                variant="subtle"
              />
            </div>
            <p class="text-sm text-ink-gray-7">{{ m.email }}</p>
            <p class="text-xs text-ink-gray-5">
              Last active {{ m.lastActive }} · {{ m.id }}
            </p>
          </div>
          <Button
            label="Manage"
            @click="toast.info(`Demo: manage ${m.name}`)"
          />
        </div>
      </div>
    </section>
  </div>
</template>
