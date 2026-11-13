import { computed, reactive } from 'vue'

const STORAGE_KEY = 'webale-auth'

export interface AuthSession {
  email: string
  name: string
  role: string
}

const state = reactive({
  session: load() as AuthSession | null,
})

function load(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export const isAuthenticated = computed(() => Boolean(state.session))
export const authSession = computed(() => state.session)

export function login(email: string, password: string) {
  const e = email.trim().toLowerCase()
  if (!e) throw new Error('Email is required')
  if (!password) throw new Error('Password is required')
  if (!e.includes('@')) throw new Error('Enter a valid email')
  const session: AuthSession = {
    email: e,
    name: e.split('@')[0] || 'Admin',
    role: 'Platform Admin',
  }
  state.session = session
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  state.session = null
  localStorage.removeItem(STORAGE_KEY)
}
