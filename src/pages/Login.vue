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
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const step = ref<'credentials' | 'mfa'>('credentials')
const mfaCode = ref('123456')

async function submit() {
  error.value = ''
  if (step.value === 'credentials') {
    if (!email.value.trim() || !password.value) {
      error.value = 'Email and password are required'
      return
    }
    step.value = 'mfa'
    toast.info('Enter the 6-digit authenticator code')
    return
  }
  loading.value = true
  try {
    if (!/^\d{6}$/.test(mfaCode.value.trim())) {
      throw new Error('Enter a valid 6-digit MFA code')
    }
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

function forgotPassword() {
  toast.info('Contact platform ops to reset your password')
}

function requestAccess() {
  toast.info('Ask a Webale owner to invite you to the console')
}
</script>

<template>
  <div class="login-page">
    <div class="login-left">
      <header class="login-brand">
        <span class="login-mark">W</span>
        <div>
          <p class="login-brand-title">{{ platform.name }}</p>
          <p class="login-brand-sub">Payments OS</p>
        </div>
      </header>

      <div class="login-form-wrap">
        <div class="login-form-head">
          <h1>{{ step === 'mfa' ? 'Two-factor' : 'Welcome Back' }}</h1>
          <p>
            {{
              step === 'mfa'
                ? 'Enter the code from your authenticator app to finish sign-in.'
                : 'Enter your email and password to access the multi-tenant payments console.'
            }}
          </p>
        </div>

        <form class="login-form" @submit.prevent="submit">
          <template v-if="step === 'credentials'">
            <label class="login-field">
              <span>Email</span>
              <input
                v-model="email"
                type="email"
                autocomplete="username"
                placeholder="amina.ops@webale.io"
                required
              />
            </label>

            <label class="login-field">
              <span>Password</span>
              <div class="login-password">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  class="login-eye"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <span
                    :class="showPassword ? 'lucide-eye-off' : 'lucide-eye'"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </label>

            <div class="login-row">
              <label class="login-check">
                <input v-model="remember" type="checkbox" />
                <span>Remember Me</span>
              </label>
              <button type="button" class="login-link" @click="forgotPassword">
                Forgot Your Password?
              </button>
            </div>
          </template>

          <template v-else>
            <label class="login-field">
              <span>Authenticator code</span>
              <input
                v-model="mfaCode"
                inputmode="numeric"
                autocomplete="one-time-code"
                placeholder="123456"
                maxlength="6"
                required
              />
            </label>
            <button
              type="button"
              class="login-link"
              @click="step = 'credentials'"
            >
              ← Back to password
            </button>
          </template>

          <p v-if="error" class="login-error">{{ error }}</p>

          <button type="submit" class="login-submit" :disabled="loading">
            {{
              loading
                ? 'Signing in…'
                : step === 'mfa'
                  ? 'Verify & log in'
                  : 'Continue'
            }}
          </button>
        </form>

        <p class="login-help">
          Need an account?
          <button type="button" class="login-link-strong" @click="requestAccess">
            Request platform access.
          </button>
        </p>
      </div>

      <footer class="login-footer">
        Copyright © {{ new Date().getFullYear() }} {{ platform.name }}. All
        rights reserved.
      </footer>
    </div>

    <aside class="login-right" aria-hidden="true">
      <div class="login-panel">
        <div class="login-panel-copy">
          <h2>Run payments across every tenant from one desk.</h2>
          <p>
            Log in to manage collections, settlements, KYC, fraud rules, and
            developer keys — Live and Test.
          </p>
        </div>

        <div class="login-widgets">
          <div class="login-card">
            <p class="login-card-label">Live volume today</p>
            <p class="login-card-value">UGX 184M</p>
            <p class="login-card-up">+18% vs yesterday</p>
          </div>
          <div class="login-card">
            <p class="login-card-label">Success rate</p>
            <p class="login-card-value">98.4%</p>
            <p class="login-card-up">Healthy</p>
          </div>
          <div class="login-card">
            <p class="login-card-label">Settlements</p>
            <div class="login-bars" aria-hidden="true">
              <span style="height: 42%" />
              <span style="height: 58%" />
              <span style="height: 51%" />
              <span style="height: 74%" />
              <span style="height: 66%" />
              <span style="height: 88%" />
              <span style="height: 79%" />
            </div>
          </div>
          <div class="login-card login-card-donut">
            <p class="login-card-label">MoMo mix</p>
            <div class="login-donut-wrap">
              <div class="login-donut" />
              <p class="login-donut-value">62%</p>
            </div>
          </div>
          <div class="login-card login-card-wide">
            <p class="login-card-label">Recent activity</p>
            <ul>
              <li>
                <span class="dot teal" />
                Tenants
                <strong>2 KYC approvals</strong>
              </li>
              <li>
                <span class="dot green" />
                Payouts
                <strong>UGX 42M settled</strong>
              </li>
              <li>
                <span class="dot amber" />
                Risk
                <strong>1 dispute opened</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.login-page {
  --login-teal: #0f766e;
  --login-teal-deep: #115e59;
  --login-teal-bright: #0d9488;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  min-height: 100vh;
  background: #fff;
  color: #111827;
  font-family:
    'Inter',
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
}

.login-left {
  display: flex;
  flex-direction: column;
  padding: 1.75rem 2rem 1.25rem;
  min-height: 100vh;
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-mark {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.6rem;
  background: var(--login-teal);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
}

.login-brand-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.login-brand-sub {
  margin: 0;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.login-form-wrap {
  width: 100%;
  max-width: 24rem;
  margin: auto;
  padding: 1rem 0 2rem;
}

.login-form-head {
  text-align: center;
  margin-bottom: 1.75rem;
}

.login-form-head h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.login-form-head p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #6b7280;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login-field > span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.login-field input,
.login-password input {
  width: 100%;
  height: 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.7rem;
  padding: 0 0.9rem;
  font-size: 0.95rem;
  background: #fff;
  color: #0f172a;
  outline: none;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.login-field input:focus,
.login-password input:focus {
  border-color: var(--login-teal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--login-teal) 18%, white);
}

.login-password {
  position: relative;
}

.login-password input {
  padding-right: 2.75rem;
}

.login-eye {
  position: absolute;
  right: 0.55rem;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #9ca3af;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  border-radius: 0.4rem;
}

.login-eye:hover {
  color: #4b5563;
  background: #f3f4f6;
}

.login-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.login-check {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--login-teal);
  cursor: pointer;
  user-select: none;
}

.login-check input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--login-teal);
}

.login-link,
.login-link-strong {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: var(--login-teal);
}

.login-link {
  font-size: 0.875rem;
  font-weight: 600;
}

.login-link:hover,
.login-link-strong:hover {
  text-decoration: underline;
}

.login-link-strong {
  font-weight: 700;
}

.login-error {
  margin: 0;
  padding: 0.65rem 0.75rem;
  border-radius: 0.6rem;
  background: #fde8e9;
  color: #c41218;
  font-size: 0.85rem;
}

.login-submit {
  margin-top: 0.35rem;
  height: 2.9rem;
  border: 0;
  border-radius: 0.8rem;
  background: var(--login-teal);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--login-teal) 35%, transparent);
  transition:
    background 140ms ease,
    transform 140ms ease;
}

.login-submit:hover:not(:disabled) {
  background: var(--login-teal-deep);
}

.login-submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

.login-help {
  margin: 1.25rem 0 0;
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
}

.login-footer {
  margin-top: auto;
  font-size: 0.78rem;
  color: #9ca3af;
}

.login-right {
  padding: 1.25rem 1.25rem 1.25rem 0.5rem;
  min-height: 100vh;
}

.login-panel {
  height: 100%;
  min-height: calc(100vh - 2.5rem);
  border-radius: 1.75rem;
  background: linear-gradient(
    160deg,
    #14b8a6 0%,
    var(--login-teal-bright) 35%,
    var(--login-teal) 70%,
    var(--login-teal-deep) 100%
  );
  color: #fff;
  padding: 2.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.login-panel-copy h2 {
  margin: 0 0 0.85rem;
  max-width: 18ch;
  font-size: clamp(1.85rem, 2.8vw, 2.55rem);
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.login-panel-copy p {
  margin: 0;
  max-width: 36ch;
  font-size: 1rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
}

.login-widgets {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-top: auto;
}

.login-card {
  background: #fff;
  color: #0f172a;
  border-radius: 1rem;
  padding: 1rem 1.05rem;
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.12);
}

.login-card-wide {
  grid-column: 1 / -1;
}

.login-card-label {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
}

.login-card-value {
  margin: 0.45rem 0 0.2rem;
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.login-card-up {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #16a34a;
}

.login-bars {
  display: flex;
  align-items: flex-end;
  gap: 0.35rem;
  height: 4.5rem;
  margin-top: 0.75rem;
}

.login-bars span {
  flex: 1;
  border-radius: 0.35rem 0.35rem 0.15rem 0.15rem;
  background: linear-gradient(180deg, #2dd4bf, var(--login-teal));
}

.login-card-donut {
  display: flex;
  flex-direction: column;
}

.login-donut-wrap {
  position: relative;
  width: 4.75rem;
  height: 4.75rem;
  margin: 0.65rem auto 0;
}

.login-donut {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(var(--login-teal) 0 62%, #e5e7eb 62% 100%);
  mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0);
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 10px),
    #000 0
  );
}

.login-donut-value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.login-card-wide ul {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.login-card-wide li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: #475569;
}

.login-card-wide strong {
  margin-left: auto;
  color: #0f172a;
  font-weight: 600;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.dot.teal {
  background: var(--login-teal);
}
.dot.green {
  background: #16a34a;
}
.dot.amber {
  background: #f59e0b;
}

@media (max-width: 980px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-right {
    display: none;
  }

  .login-left {
    min-height: 100vh;
  }
}
</style>
