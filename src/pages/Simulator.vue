<script setup lang="ts">
import { ref } from 'vue'
import {
  Badge,
  Button,
  FormControl,
  PageHeader,
  PageHeaderTitle,
  toast,
} from 'frappe-ui'
import { apiBase, session } from '../data/platform'

const amount = ref('15000')
const currency = ref('UGX')
const channel = ref('mobilemoneyuganda')
const email = ref('test@customer.com')
const lastResult = ref('')

const channelOptions = [
  { label: 'MTN MoMo UG', value: 'mobilemoneyuganda' },
  { label: 'Airtel Money', value: 'mobilemoneyairtel' },
  { label: 'Card', value: 'card' },
  { label: 'Bank transfer', value: 'banktransfer' },
]

function run() {
  const refId = `WB-SIM-${Date.now().toString().slice(-6)}`
  lastResult.value = JSON.stringify(
    {
      status: 'success',
      message: 'Sandbox charge created',
      data: {
        id: `txn_sim_${refId}`,
        tx_ref: refId,
        amount: Number(amount.value),
        currency: currency.value,
        payment_type: channel.value,
        customer: { email: email.value },
        environment: session.environment,
        mode: 'sandbox_simulator',
      },
    },
    null,
    2,
  )
  toast.success('Sandbox payment simulated')
}
</script>

<template>
  <PageHeader>
    <PageHeaderTitle title="Sandbox simulator" />
    <Button variant="solid" icon-left="lucide-play" label="Run charge" @click="run" />
  </PageHeader>
  <div class="webale-page max-w-3xl">
    <p class="text-p-base text-ink-gray-6">
      Fire a fake {{ apiBase }} charge without touching live rails — for developers.
    </p>
    <section class="webale-section">
      <div class="grid gap-3 sm:grid-cols-2">
        <FormControl v-model="amount" label="Amount" />
        <FormControl v-model="currency" label="Currency" />
        <FormControl v-model="channel" type="select" label="Channel" :options="channelOptions" />
        <FormControl v-model="email" label="Customer email" />
      </div>
      <Badge :label="`Env: ${session.environment}`" theme="amber" variant="subtle" />
      <pre v-if="lastResult" class="webale-code">{{ lastResult }}</pre>
    </section>
  </div>
</template>
