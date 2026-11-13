import { computed, reactive } from 'vue'

/** Webale = multi-tenant payment platform (Flutterwave-style). Independent of any school app. */

export type Environment = 'live' | 'test'
export type TenantStatus = 'Active' | 'Pending KYC' | 'Suspended'
export type TxnStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded'

export interface Tenant {
  id: string
  name: string
  slug: string
  country: string
  industry: string
  email: string
  status: TenantStatus
  plan: 'Starter' | 'Growth' | 'Enterprise'
  createdAt: string
  liveVolume: number
  testVolume: number
}

export interface SubAccount {
  id: string
  tenantId: string
  name: string
  bank: string
  account: string
  splitPercent: number
  status: 'Active' | 'Inactive'
}

export interface Transaction {
  id: string
  tenantId: string
  reference: string
  customer: string
  email: string
  channel: 'card' | 'mobile_money' | 'bank_transfer' | 'ussd'
  amount: number
  currency: string
  status: TxnStatus
  environment: Environment
  createdAt: string
}

export interface PaymentLink {
  id: string
  tenantId: string
  title: string
  amount: number
  currency: string
  url: string
  status: 'Active' | 'Disabled'
  payments: number
}

export interface WebhookEndpoint {
  id: string
  tenantId: string
  url: string
  events: string
  status: 'Active' | 'Failing'
  lastDelivery: string
}

export interface Settlement {
  id: string
  tenantId: string
  amount: number
  currency: string
  status: 'Queued' | 'Processing' | 'Paid'
  due: string
}

export const platform = {
  name: 'Webale',
  tagline: 'Multi-tenant payments for Africa',
  supportEmail: 'support@webale.io',
}

export const tenants: Tenant[] = [
  {
    id: 'ten_01',
    name: 'Nova Commerce Ltd',
    slug: 'nova-commerce',
    country: 'Uganda',
    industry: 'E-commerce',
    email: 'ops@novacommerce.ug',
    status: 'Active',
    plan: 'Growth',
    createdAt: '2025-04-12',
    liveVolume: 182_400_000,
    testVolume: 4_200_000,
  },
  {
    id: 'ten_02',
    name: 'Safari Rides',
    slug: 'safari-rides',
    country: 'Kenya',
    industry: 'Mobility',
    email: 'finance@safarirides.ke',
    status: 'Active',
    plan: 'Enterprise',
    createdAt: '2024-11-02',
    liveVolume: 640_000_000,
    testVolume: 12_000_000,
  },
  {
    id: 'ten_03',
    name: 'Bright Clinics',
    slug: 'bright-clinics',
    country: 'Uganda',
    industry: 'Healthcare',
    email: 'billing@brightclinics.ug',
    status: 'Pending KYC',
    plan: 'Starter',
    createdAt: '2026-10-28',
    liveVolume: 0,
    testVolume: 890_000,
  },
  {
    id: 'ten_04',
    name: 'Lakeview Hotels',
    slug: 'lakeview-hotels',
    country: 'Rwanda',
    industry: 'Hospitality',
    email: 'payments@lakeview.rw',
    status: 'Active',
    plan: 'Growth',
    createdAt: '2025-08-19',
    liveVolume: 96_500_000,
    testVolume: 2_100_000,
  },
  {
    id: 'ten_05',
    name: 'PayGo Utilities',
    slug: 'paygo-utilities',
    country: 'Tanzania',
    industry: 'Utilities',
    email: 'api@paygo.tz',
    status: 'Suspended',
    plan: 'Growth',
    createdAt: '2025-01-09',
    liveVolume: 12_000_000,
    testVolume: 0,
  },
]

export const subAccounts: SubAccount[] = [
  {
    id: 'sub_01',
    tenantId: 'ten_01',
    name: 'Nova Marketplace',
    bank: 'Stanbic UG',
    account: '•••• 4412',
    splitPercent: 85,
    status: 'Active',
  },
  {
    id: 'sub_02',
    tenantId: 'ten_01',
    name: 'Nova Logistics partners',
    bank: 'Centenary',
    account: '•••• 8821',
    splitPercent: 10,
    status: 'Active',
  },
  {
    id: 'sub_03',
    tenantId: 'ten_02',
    name: 'Driver payouts',
    bank: 'Equity KE',
    account: '•••• 2209',
    splitPercent: 70,
    status: 'Active',
  },
  {
    id: 'sub_04',
    tenantId: 'ten_04',
    name: 'Kigali property',
    bank: 'BK Rwanda',
    account: '•••• 1004',
    splitPercent: 100,
    status: 'Inactive',
  },
]

export const transactions: Transaction[] = [
  {
    id: 'txn_9001',
    tenantId: 'ten_01',
    reference: 'WB-NV-77421',
    customer: 'Amina K.',
    email: 'amina@email.com',
    channel: 'mobile_money',
    amount: 85000,
    currency: 'UGX',
    status: 'Successful',
    environment: 'live',
    createdAt: '2026-11-13 09:22',
  },
  {
    id: 'txn_9002',
    tenantId: 'ten_02',
    reference: 'WB-SF-88201',
    customer: 'James O.',
    email: 'james@email.com',
    channel: 'card',
    amount: 1200,
    currency: 'UGX',
    status: 'Successful',
    environment: 'live',
    createdAt: '2026-11-13 09:40',
  },
  {
    id: 'txn_9003',
    tenantId: 'ten_01',
    reference: 'WB-NV-44110',
    customer: 'Sarah N.',
    email: 'sarah@email.com',
    channel: 'bank_transfer',
    amount: 420000,
    currency: 'UGX',
    status: 'Pending',
    environment: 'live',
    createdAt: '2026-11-13 10:05',
  },
  {
    id: 'txn_9004',
    tenantId: 'ten_04',
    reference: 'WB-LV-22019',
    customer: 'Guest checkout',
    email: 'guest@lakeview.rw',
    channel: 'card',
    amount: 180000,
    currency: 'UGX',
    status: 'Failed',
    environment: 'live',
    createdAt: '2026-11-13 10:18',
  },
  {
    id: 'txn_9005',
    tenantId: 'ten_03',
    reference: 'WB-BC-TEST-01',
    customer: 'Test patient',
    email: 'test@brightclinics.ug',
    channel: 'mobile_money',
    amount: 25000,
    currency: 'UGX',
    status: 'Successful',
    environment: 'test',
    createdAt: '2026-11-13 08:11',
  },
  {
    id: 'txn_9006',
    tenantId: 'ten_02',
    reference: 'WB-SF-55902',
    customer: 'Ride #4412',
    email: 'rider@safarirides.ke',
    channel: 'mobile_money',
    amount: 650,
    currency: 'UGX',
    status: 'Refunded',
    environment: 'live',
    createdAt: '2026-11-12 16:30',
  },
  {
    id: 'txn_9007',
    tenantId: 'ten_01',
    reference: 'WB-NV-10088',
    customer: 'Corporate PO',
    email: 'ap@corp.ug',
    channel: 'ussd',
    amount: 2_500_000,
    currency: 'UGX',
    status: 'Successful',
    environment: 'live',
    createdAt: '2026-11-13 08:55',
  },
]

export const paymentLinks: PaymentLink[] = [
  {
    id: 'plink_01',
    tenantId: 'ten_01',
    title: 'Checkout · cart',
    amount: 0,
    currency: 'UGX',
    url: 'https://pay.webale.io/l/nova-cart',
    status: 'Active',
    payments: 1284,
  },
  {
    id: 'plink_02',
    tenantId: 'ten_04',
    title: 'Room deposit',
    amount: 150000,
    currency: 'UGX',
    url: 'https://pay.webale.io/l/lakeview-deposit',
    status: 'Active',
    payments: 86,
  },
  {
    id: 'plink_03',
    tenantId: 'ten_03',
    title: 'Consultation fee (test)',
    amount: 30000,
    currency: 'UGX',
    url: 'https://pay.webale.io/l/bright-consult',
    status: 'Disabled',
    payments: 12,
  },
]

export const webhooks: WebhookEndpoint[] = [
  {
    id: 'wh_01',
    tenantId: 'ten_01',
    url: 'https://api.novacommerce.ug/webhooks/webale',
    events: 'charge.completed, transfer.completed',
    status: 'Active',
    lastDelivery: '2026-11-13 10:01',
  },
  {
    id: 'wh_02',
    tenantId: 'ten_02',
    url: 'https://hooks.safarirides.ke/webale',
    events: 'charge.completed, charge.failed',
    status: 'Failing',
    lastDelivery: '2026-11-13 09:12',
  },
  {
    id: 'wh_03',
    tenantId: 'ten_04',
    url: 'https://lakeview.rw/api/payments/hook',
    events: 'charge.completed',
    status: 'Active',
    lastDelivery: '2026-11-12 22:40',
  },
]

export const settlements: Settlement[] = [
  {
    id: 'set_01',
    tenantId: 'ten_01',
    amount: 12_400_000,
    currency: 'UGX',
    status: 'Queued',
    due: '2026-11-14',
  },
  {
    id: 'set_02',
    tenantId: 'ten_02',
    amount: 2_850_000,
    currency: 'UGX',
    status: 'Paid',
    due: '2026-11-12',
  },
  {
    id: 'set_03',
    tenantId: 'ten_04',
    amount: 4_100_000,
    currency: 'UGX',
    status: 'Processing',
    due: '2026-11-13',
  },
]

/** Session: platform ops can view all tenants, or scope into one. */
export const session = reactive({
  /** null = platform (all tenants) view */
  tenantId: null as string | null,
  environment: 'live' as Environment,
  role: 'Platform Admin' as string,
})

export function setTenant(id: string | null) {
  session.tenantId = id
}

export function setEnvironment(env: Environment) {
  session.environment = env
}

export const currentTenant = computed(() =>
  session.tenantId
    ? tenants.find((t) => t.id === session.tenantId) || null
    : null,
)

export const isPlatformView = computed(() => !session.tenantId)

export const scopedTransactions = computed(() =>
  transactions.filter((t) => {
    if (session.tenantId && t.tenantId !== session.tenantId) return false
    if (t.environment !== session.environment) return false
    return true
  }),
)

export const scopedSubAccounts = computed(() =>
  subAccounts.filter(
    (s) => !session.tenantId || s.tenantId === session.tenantId,
  ),
)

export const scopedLinks = computed(() =>
  paymentLinks.filter(
    (l) => !session.tenantId || l.tenantId === session.tenantId,
  ),
)

export const scopedWebhooks = computed(() =>
  webhooks.filter((w) => !session.tenantId || w.tenantId === session.tenantId),
)

export const scopedSettlements = computed(() =>
  settlements.filter(
    (s) => !session.tenantId || s.tenantId === session.tenantId,
  ),
)

export const platformKpis = computed(() => {
  const active = tenants.filter((t) => t.status === 'Active').length
  const pendingKyc = tenants.filter((t) => t.status === 'Pending KYC').length
  const liveTxns = transactions.filter(
    (t) => t.environment === 'live' && t.status === 'Successful',
  )
  const volume = liveTxns.reduce((n, t) => n + t.amount, 0)
  const failed = transactions.filter(
    (t) => t.environment === session.environment && t.status === 'Failed',
  ).length
  return {
    tenants: tenants.length,
    activeTenants: active,
    pendingKyc,
    liveVolumeApprox: volume,
    successRate: 97.2,
    failedToday: failed,
  }
})

export const volumeByDay = [
  { day: 'Mon', amount: 42 },
  { day: 'Tue', amount: 48 },
  { day: 'Wed', amount: 55 },
  { day: 'Thu', amount: 51 },
  { day: 'Fri', amount: 68 },
  { day: 'Sat', amount: 61 },
  { day: 'Sun', amount: 49 },
]

export const channelMix = [
  { channel: 'Mobile money', count: 48 },
  { channel: 'Card', count: 28 },
  { channel: 'Bank transfer', count: 16 },
  { channel: 'USSD', count: 8 },
]

export const platformNav = [
  { label: 'Overview', icon: 'lucide-layout-dashboard', route: '/' },
  { label: 'Tenants', icon: 'lucide-building-2', route: '/tenants' },
  { label: 'Balances', icon: 'lucide-wallet', route: '/balances' },
  { label: 'Transactions', icon: 'lucide-arrow-left-right', route: '/transactions' },
  { label: 'Refunds', icon: 'lucide-undo-2', route: '/refunds' },
  { label: 'Transfers', icon: 'lucide-send', route: '/transfers' },
  { label: 'Customers', icon: 'lucide-contact', route: '/customers' },
  { label: 'Invoices', icon: 'lucide-file-text', route: '/invoices' },
  { label: 'Subscriptions', icon: 'lucide-repeat', route: '/subscriptions' },
  { label: 'Virtual accounts', icon: 'lucide-landmark', route: '/virtual-accounts' },
  { label: 'Beneficiaries', icon: 'lucide-users-round', route: '/beneficiaries' },
  { label: 'Subaccounts', icon: 'lucide-git-branch', route: '/subaccounts' },
  { label: 'Payment links', icon: 'lucide-link', route: '/payment-links' },
  { label: 'Checkout', icon: 'lucide-store', route: '/checkout' },
  { label: 'Settlements', icon: 'lucide-banknote', route: '/settlements' },
  { label: 'Settlement accounts', icon: 'lucide-building', route: '/settlement-accounts' },
  { label: 'FX rates', icon: 'lucide-coins', route: '/fx' },
  { label: 'Disputes', icon: 'lucide-shield-alert', route: '/disputes' },
  { label: 'Fraud rules', icon: 'lucide-shield', route: '/fraud' },
  { label: 'Identity verify', icon: 'lucide-scan-face', route: '/identity' },
  { label: 'KYC queue', icon: 'lucide-badge-check', route: '/kyc' },
  { label: 'Audit logs', icon: 'lucide-scroll-text', route: '/logs' },
  { label: 'Team', icon: 'lucide-users', route: '/team' },
  { label: 'Fees & pricing', icon: 'lucide-percent', route: '/fees' },
  { label: 'Notifications', icon: 'lucide-bell', route: '/notifications' },
  { label: 'Reports', icon: 'lucide-bar-chart-3', route: '/reports' },
  { label: 'Support', icon: 'lucide-life-buoy', route: '/support' },
  { label: 'System', icon: 'lucide-activity', route: '/system' },
  { label: 'Simulator', icon: 'lucide-flask-conical', route: '/simulator' },
  { label: 'Webhooks', icon: 'lucide-webhook', route: '/webhooks' },
  { label: 'Events', icon: 'lucide-book-open', route: '/events' },
  { label: 'API keys', icon: 'lucide-key-round', route: '/api-keys' },
  { label: 'Developers', icon: 'lucide-code-2', route: '/developers' },
]

export type AuditSeverity = 'info' | 'success' | 'warning' | 'error'

export interface AuditLog {
  id: string
  at: string
  actor: string
  action: string
  resource: string
  tenantId?: string
  ip: string
  severity: AuditSeverity
  detail: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Finance' | 'Support' | 'Developer' | 'Viewer'
  status: 'Active' | 'Invited' | 'Disabled'
  lastActive: string
}

export interface KycCase {
  id: string
  tenantId: string
  business: string
  country: string
  documents: string
  risk: 'Low' | 'Medium' | 'High'
  status: 'In review' | 'Needs info' | 'Approved' | 'Rejected'
  submittedAt: string
}

export interface Dispute {
  id: string
  tenantId: string
  reference: string
  amount: number
  currency: string
  reason: string
  status: 'Open' | 'Under review' | 'Won' | 'Lost'
  openedAt: string
}

export interface SystemService {
  id: string
  name: string
  region: string
  latencyMs: number
  uptime: number
  status: 'Operational' | 'Degraded' | 'Outage'
}

export const auditLogs: AuditLog[] = [
  {
    id: 'log_01',
    at: '2026-11-13 10:42:11',
    actor: 'amina.ops@webale.io',
    action: 'tenant.kyc.approved',
    resource: 'ten_04',
    tenantId: 'ten_04',
    ip: '102.84.12.44',
    severity: 'success',
    detail: 'KYC approved for Lakeview Hotels',
  },
  {
    id: 'log_02',
    at: '2026-11-13 10:38:02',
    actor: 'api:nova-commerce',
    action: 'charge.create',
    resource: 'txn_9007',
    tenantId: 'ten_01',
    ip: '41.210.18.9',
    severity: 'info',
    detail: 'Live charge UGX 2,500,000 via ussd',
  },
  {
    id: 'log_03',
    at: '2026-11-13 10:21:55',
    actor: 'james.support@webale.io',
    action: 'dispute.opened',
    resource: 'dsp_02',
    tenantId: 'ten_02',
    ip: '105.27.3.18',
    severity: 'warning',
    detail: 'Card chargeback opened · UGX 1,200',
  },
  {
    id: 'log_04',
    at: '2026-11-13 09:55:40',
    actor: 'system',
    action: 'settlement.batch.queued',
    resource: 'set_01',
    tenantId: 'ten_01',
    ip: '—',
    severity: 'info',
    detail: 'T+1 settlement batch queued (UGX 12.4M)',
  },
  {
    id: 'log_05',
    at: '2026-11-13 09:12:08',
    actor: 'api:safari-rides',
    action: 'webhook.delivery.failed',
    resource: 'wh_02',
    tenantId: 'ten_02',
    ip: '197.232.1.4',
    severity: 'error',
    detail: 'Webhook 502 from hooks.safarirides.ke',
  },
  {
    id: 'log_06',
    at: '2026-11-13 08:44:19',
    actor: 'sara.admin@webale.io',
    action: 'api_key.rotated',
    resource: 'wb_live_sk',
    tenantId: 'ten_01',
    ip: '102.84.12.44',
    severity: 'warning',
    detail: 'Live secret rotated for Nova Commerce',
  },
  {
    id: 'log_07',
    at: '2026-11-13 08:10:00',
    actor: 'system',
    action: 'provider.health.check',
    resource: 'mtn_momo_ug',
    ip: '—',
    severity: 'success',
    detail: 'MTN MoMo UG latency 210ms · healthy',
  },
  {
    id: 'log_08',
    at: '2026-11-12 22:05:33',
    actor: 'amina.ops@webale.io',
    action: 'tenant.suspended',
    resource: 'ten_05',
    tenantId: 'ten_05',
    ip: '102.84.12.44',
    severity: 'error',
    detail: 'PayGo Utilities suspended · compliance hold',
  },
  {
    id: 'log_09',
    at: '2026-11-12 18:22:01',
    actor: 'dev.portal',
    action: 'user.login',
    resource: 'usr_03',
    ip: '41.75.88.2',
    severity: 'info',
    detail: 'Developer portal login · MFA ok',
  },
  {
    id: 'log_10',
    at: '2026-11-12 16:40:12',
    actor: 'system',
    action: 'refund.completed',
    resource: 'txn_9006',
    tenantId: 'ten_02',
    ip: '—',
    severity: 'success',
    detail: 'Refund completed for WB-SF-55902',
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: 'usr_01',
    name: 'Amina Okello',
    email: 'amina.ops@webale.io',
    role: 'Owner',
    status: 'Active',
    lastActive: '2026-11-13 10:42',
  },
  {
    id: 'usr_02',
    name: 'Sara Namuli',
    email: 'sara.admin@webale.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '2026-11-13 09:55',
  },
  {
    id: 'usr_03',
    name: 'James Kato',
    email: 'james.support@webale.io',
    role: 'Support',
    status: 'Active',
    lastActive: '2026-11-13 10:21',
  },
  {
    id: 'usr_04',
    name: 'Priya Shah',
    email: 'priya.finance@webale.io',
    role: 'Finance',
    status: 'Active',
    lastActive: '2026-11-13 08:02',
  },
  {
    id: 'usr_05',
    name: 'David Mugisha',
    email: 'david.dev@webale.io',
    role: 'Developer',
    status: 'Active',
    lastActive: '2026-11-12 22:10',
  },
  {
    id: 'usr_06',
    name: 'Board Viewer',
    email: 'board@webale.io',
    role: 'Viewer',
    status: 'Invited',
    lastActive: '—',
  },
]

export const kycCases: KycCase[] = [
  {
    id: 'kyc_01',
    tenantId: 'ten_03',
    business: 'Bright Clinics',
    country: 'Uganda',
    documents: 'Certificate of incorp · Directors IDs',
    risk: 'Medium',
    status: 'In review',
    submittedAt: '2026-11-10',
  },
  {
    id: 'kyc_02',
    tenantId: 'ten_01',
    business: 'Nova Commerce Ltd',
    country: 'Uganda',
    documents: 'TIN · Bank letter · UBOs',
    risk: 'Low',
    status: 'Approved',
    submittedAt: '2025-04-08',
  },
  {
    id: 'kyc_03',
    tenantId: 'ten_05',
    business: 'PayGo Utilities',
    country: 'Tanzania',
    documents: 'License · AML policy',
    risk: 'High',
    status: 'Rejected',
    submittedAt: '2026-10-02',
  },
  {
    id: 'kyc_04',
    tenantId: 'ten_02',
    business: 'Safari Rides',
    country: 'Kenya',
    documents: 'Renewal pack · updated directors',
    risk: 'Low',
    status: 'Needs info',
    submittedAt: '2026-11-11',
  },
]

export const disputes: Dispute[] = [
  {
    id: 'dsp_01',
    tenantId: 'ten_01',
    reference: 'WB-NV-44110',
    amount: 420000,
    currency: 'UGX',
    reason: 'Product not received',
    status: 'Open',
    openedAt: '2026-11-13',
  },
  {
    id: 'dsp_02',
    tenantId: 'ten_02',
    reference: 'WB-SF-88201',
    amount: 1200,
    currency: 'UGX',
    reason: 'Fraudulent card',
    status: 'Under review',
    openedAt: '2026-11-13',
  },
  {
    id: 'dsp_03',
    tenantId: 'ten_04',
    reference: 'WB-LV-11820',
    amount: 95000,
    currency: 'UGX',
    reason: 'Duplicate charge',
    status: 'Won',
    openedAt: '2026-11-05',
  },
  {
    id: 'dsp_04',
    tenantId: 'ten_01',
    reference: 'WB-NV-33001',
    amount: 75000,
    currency: 'UGX',
    reason: 'Service not as described',
    status: 'Lost',
    openedAt: '2026-10-28',
  },
]

export const systemServices: SystemService[] = [
  {
    id: 'svc_api',
    name: 'Payments API',
    region: 'Kampala · af-east-1',
    latencyMs: 48,
    uptime: 99.98,
    status: 'Operational',
  },
  {
    id: 'svc_mtn',
    name: 'MTN MoMo UG',
    region: 'Uganda',
    latencyMs: 210,
    uptime: 99.91,
    status: 'Operational',
  },
  {
    id: 'svc_airtel',
    name: 'Airtel Money UG',
    region: 'Uganda',
    latencyMs: 265,
    uptime: 99.85,
    status: 'Degraded',
  },
  {
    id: 'svc_card',
    name: 'Card acquiring',
    region: 'Multi-region',
    latencyMs: 320,
    uptime: 99.97,
    status: 'Operational',
  },
  {
    id: 'svc_wh',
    name: 'Webhook delivery',
    region: 'af-east-1',
    latencyMs: 95,
    uptime: 99.9,
    status: 'Operational',
  },
  {
    id: 'svc_settle',
    name: 'Settlement engine',
    region: 'af-east-1',
    latencyMs: 120,
    uptime: 100,
    status: 'Operational',
  },
]

export const scopedDisputes = computed(() =>
  disputes.filter((d) => !session.tenantId || d.tenantId === session.tenantId),
)

export const scopedAuditLogs = computed(() =>
  auditLogs.filter((l) => !session.tenantId || l.tenantId === session.tenantId),
)

export const enterpriseKpis = computed(() => {
  const openDisputes = disputes.filter(
    (d) => d.status === 'Open' || d.status === 'Under review',
  ).length
  const kycPending = kycCases.filter(
    (k) => k.status === 'In review' || k.status === 'Needs info',
  ).length
  const errorLogs = auditLogs.filter((l) => l.severity === 'error').length
  const degraded = systemServices.filter((s) => s.status !== 'Operational').length
  return { openDisputes, kycPending, errorLogs, degraded }
})

/** Public REST surface — developer-facing (Flutterwave-style). */
export const apiBase = 'https://api.webale.io/v1'

export const apiEndpoints = [
  {
    method: 'POST',
    path: '/charges',
    summary: 'Create a charge (card, MoMo, bank)',
    body: `{
  "tx_ref": "WB-ORD-1001",
  "amount": 15000,
  "currency": "UGX",
  "payment_options": "mobilemoneyuganda,card",
  "customer": {
    "email": "customer@email.com",
    "name": "Amina K."
  },
  "redirect_url": "https://merchant.app/return"
}`,
  },
  {
    method: 'GET',
    path: '/transactions/:id',
    summary: 'Verify a transaction',
    body: null,
  },
  {
    method: 'POST',
    path: '/transfers',
    summary: 'Payout to bank or MoMo',
    body: `{
  "account_bank": "MPS",
  "account_number": "256700000000",
  "amount": 50000,
  "currency": "UGX",
  "narration": "Vendor payout",
  "reference": "WB-PAY-88"
}`,
  },
  {
    method: 'POST',
    path: '/payment-links',
    summary: 'Create a hosted payment link',
    body: `{
  "title": "Invoice #442",
  "amount": 250000,
  "currency": "UGX",
  "redirect_url": "https://merchant.app/thanks"
}`,
  },
  {
    method: 'POST',
    path: '/subaccounts',
    summary: 'Create a split subaccount',
    body: `{
  "account_bank": "STA",
  "account_number": "9030012345",
  "business_name": "Partner Store",
  "split_type": "percentage",
  "split_value": 15
}`,
  },
  {
    method: 'GET',
    path: '/settlements',
    summary: 'List settlement batches',
    body: null,
  },
]

export const sdkSnippets = [
  {
    lang: 'cURL',
    code: `curl -X POST ${apiBase}/charges \\
  -H "Authorization: Bearer wb_live_sk_***" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tx_ref": "WB-ORD-1001",
    "amount": 15000,
    "currency": "UGX",
    "payment_options": "mobilemoneyuganda",
    "customer": { "email": "a@email.com", "name": "Amina" }
  }'`,
  },
  {
    lang: 'Node.js',
    code: `import Webale from 'webale-node'

const webale = new Webale({ secretKey: process.env.WEBALE_SECRET })

const charge = await webale.charges.create({
  tx_ref: 'WB-ORD-1001',
  amount: 15000,
  currency: 'UGX',
  payment_options: 'mobilemoneyuganda,card',
  customer: { email: 'a@email.com', name: 'Amina' },
  redirect_url: 'https://merchant.app/return',
})`,
  },
  {
    lang: 'Python',
    code: `from webale import Client

client = Client(secret_key=os.environ["WEBALE_SECRET"])

charge = client.charges.create(
    tx_ref="WB-ORD-1001",
    amount=15000,
    currency="UGX",
    payment_options="mobilemoneyuganda,card",
    customer={"email": "a@email.com", "name": "Amina"},
)`,
  },
]

export function tenantName(id: string) {
  return tenants.find((t) => t.id === id)?.name || id
}

export interface Customer {
  id: string
  tenantId: string
  name: string
  email: string
  phone: string
  country: string
  payments: number
  volume: number
  currency: string
  status: 'Active' | 'Blocked'
}

export interface BalanceRow {
  id: string
  tenantId: string
  currency: string
  collection: number
  payout: number
  pendingSettlement: number
}

export interface Refund {
  id: string
  tenantId: string
  reference: string
  amount: number
  currency: string
  reason: string
  status: 'Pending' | 'Completed' | 'Failed'
  createdAt: string
}

export interface Transfer {
  id: string
  tenantId: string
  reference: string
  beneficiary: string
  channel: 'Bank' | 'MoMo'
  amount: number
  currency: string
  status: 'Successful' | 'Pending' | 'Failed'
  createdAt: string
}

export interface FraudRule {
  id: string
  name: string
  condition: string
  action: 'Block' | 'Review' | 'Allow'
  status: 'Active' | 'Disabled'
  hits: number
}

export const customers: Customer[] = [
  {
    id: 'cus_01',
    tenantId: 'ten_01',
    name: 'Amina K.',
    email: 'amina@email.com',
    phone: '+256700111222',
    country: 'UG',
    payments: 14,
    volume: 1_250_000,
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'cus_02',
    tenantId: 'ten_02',
    name: 'James O.',
    email: 'james@email.com',
    phone: '+254711222333',
    country: 'KE',
    payments: 32,
    volume: 48_500,
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'cus_03',
    tenantId: 'ten_01',
    name: 'Sarah N.',
    email: 'sarah@email.com',
    phone: '+256772333444',
    country: 'UG',
    payments: 3,
    volume: 420000,
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'cus_04',
    tenantId: 'ten_04',
    name: 'Guest checkout',
    email: 'guest@lakeview.rw',
    phone: '+250788000111',
    country: 'RW',
    payments: 1,
    volume: 180000,
    currency: 'UGX',
    status: 'Blocked',
  },
]

export const balances: BalanceRow[] = [
  {
    id: 'bal_01',
    tenantId: 'ten_01',
    currency: 'UGX',
    collection: 18_400_000,
    payout: 6_200_000,
    pendingSettlement: 12_400_000,
  },
  {
    id: 'bal_02',
    tenantId: 'ten_02',
    currency: 'UGX',
    collection: 4_850_000,
    payout: 1_200_000,
    pendingSettlement: 2_850_000,
  },
  {
    id: 'bal_03',
    tenantId: 'ten_04',
    currency: 'UGX',
    collection: 9_100_000,
    payout: 3_000_000,
    pendingSettlement: 4_100_000,
  },
]

export const refunds: Refund[] = [
  {
    id: 'ref_01',
    tenantId: 'ten_02',
    reference: 'WB-SF-55902',
    amount: 650,
    currency: 'UGX',
    reason: 'Customer cancelled ride',
    status: 'Completed',
    createdAt: '2026-11-12 16:40',
  },
  {
    id: 'ref_02',
    tenantId: 'ten_01',
    reference: 'WB-NV-33001',
    amount: 75000,
    currency: 'UGX',
    reason: 'Duplicate charge',
    status: 'Pending',
    createdAt: '2026-11-13 09:10',
  },
  {
    id: 'ref_03',
    tenantId: 'ten_04',
    reference: 'WB-LV-22019',
    amount: 180000,
    currency: 'UGX',
    reason: 'Failed booking',
    status: 'Failed',
    createdAt: '2026-11-13 10:20',
  },
]

export const transfers: Transfer[] = [
  {
    id: 'tr_01',
    tenantId: 'ten_01',
    reference: 'WB-PAY-88',
    beneficiary: 'Vendor · Stanbic ••4412',
    channel: 'Bank',
    amount: 500000,
    currency: 'UGX',
    status: 'Successful',
    createdAt: '2026-11-13 08:15',
  },
  {
    id: 'tr_02',
    tenantId: 'ten_02',
    reference: 'WB-DRV-4412',
    beneficiary: 'Driver payout · MoMo',
    channel: 'MoMo',
    amount: 2400,
    currency: 'UGX',
    status: 'Pending',
    createdAt: '2026-11-13 10:05',
  },
  {
    id: 'tr_03',
    tenantId: 'ten_04',
    reference: 'WB-LV-OUT-12',
    beneficiary: 'BK Rwanda ••1004',
    channel: 'Bank',
    amount: 1_200_000,
    currency: 'UGX',
    status: 'Successful',
    createdAt: '2026-11-12 17:00',
  },
]

export const fraudRules: FraudRule[] = [
  {
    id: 'fr_01',
    name: 'High velocity MoMo',
    condition: '> 5 charges / 10 min same phone',
    action: 'Review',
    status: 'Active',
    hits: 28,
  },
  {
    id: 'fr_02',
    name: 'Blocked BIN list',
    condition: 'Card BIN in denylist',
    action: 'Block',
    status: 'Active',
    hits: 6,
  },
  {
    id: 'fr_03',
    name: 'New device + high amount',
    condition: 'First seen device & amount > 1M UGX',
    action: 'Review',
    status: 'Active',
    hits: 11,
  },
  {
    id: 'fr_04',
    name: 'Allowlist partners',
    condition: 'Corporate payer email domain',
    action: 'Allow',
    status: 'Disabled',
    hits: 0,
  },
]

export const scopedCustomers = computed(() =>
  customers.filter((c) => !session.tenantId || c.tenantId === session.tenantId),
)
export const scopedBalances = computed(() =>
  balances.filter((b) => !session.tenantId || b.tenantId === session.tenantId),
)
export const scopedRefunds = computed(() =>
  refunds.filter((r) => !session.tenantId || r.tenantId === session.tenantId),
)
export const scopedTransfers = computed(() =>
  transfers.filter((t) => !session.tenantId || t.tenantId === session.tenantId),
)

/** Tenant 360 bundle — same idea as school Student 360. */
export function getTenant360(id: string) {
  const tenant = tenants.find((t) => t.id === id)
  if (!tenant) return null
  return {
    tenant,
    transactions: transactions.filter((t) => t.tenantId === id),
    balances: balances.filter((b) => b.tenantId === id),
    settlements: settlements.filter((s) => s.tenantId === id),
    disputes: disputes.filter((d) => d.tenantId === id),
    customers: customers.filter((c) => c.tenantId === id),
    refunds: refunds.filter((r) => r.tenantId === id),
    transfers: transfers.filter((t) => t.tenantId === id),
    subAccounts: subAccounts.filter((s) => s.tenantId === id),
    links: paymentLinks.filter((l) => l.tenantId === id),
    webhooks: webhooks.filter((w) => w.tenantId === id),
    logs: auditLogs.filter((l) => l.tenantId === id),
    kyc: kycCases.filter((k) => k.tenantId === id),
  }
}
