<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'frappe-ui'
import { login } from '../data/auth'
import { platform } from '../data/platform'

const router = useRouter()
const route = useRoute()
const email = ref('amina.ops@webale.io')
const password = ref('webale123')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    login(email.value, password.value)
    toast.success('Welcome to Webale')
    const redirect = String(route.query.redirect || '/')
    await router.replace(redirect.startsWith('/') ? redirect : '/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not sign in'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="webale-login">
    <div class="webale-login-card">
      <div class="mb-6 flex items-center gap-3">
        <span class="webale-mark !size-10 text-base">W</span>
        <div>
          <p class="text-base font-semibold text-ink-gray-9">{{ platform.name }}</p>
          <p class="text-xs text-ink-gray-5">Enterprise admin console</p>
        </div>
      </div>
      <h1 class="mb-1 text-xl font-semibold text-ink-gray-9">Sign in</h1>
      <p class="mb-6 text-sm text-ink-gray-6">
        Platform operators — tenants, payments, KYC and developer tools.
      </p>
      <form class="space-y-4" @submit.prevent="submit">
        <label class="block space-y-1.5">
          <span class="text-xs font-medium text-ink-gray-6">Email</span>
          <input
            v-model="email"
            type="email"
            required
            class="webale-input"
            autocomplete="username"
          />
        </label>
        <label class="block space-y-1.5">
          <span class="text-xs font-medium text-ink-gray-6">Password</span>
          <input
            v-model="password"
            type="password"
            required
            class="webale-input"
            autocomplete="current-password"
          />
        </label>
        <p v-if="error" class="text-sm text-ink-red-7">{{ error }}</p>
        <button type="submit" class="webale-login-btn" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Log in' }}
        </button>
      </form>
    </div>
  </div>
</template>
