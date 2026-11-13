import { computed } from 'vue'
import { session, tenantName } from './platform'

export { tenantName }

export interface SettlementAccount {
  id: string
  tenantId: string
  bank: string
  accountName: string
  accountNumber: string
  currency: string
  primary: boolean
  status: 'Verified' | 'Pending' | 'Rejected'
}

export interface LedgerEntry {
  id: string
  tenantId: string
  currency: string
  wallet: 'Collection' | 'Payout'
  type: 'Credit' | 'Debit'
  amount: number
  narration: string
  createdAt: string
}

export interface Invoice {
  id: string
  tenantId: string
  customer: string
  amount: number
  currency: string
  due: string
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue'
}

export interface Subscription {
  id: string
  tenantId: string
  plan: string
  customer: string
  amount: number
  currency: string
  interval: 'Monthly' | 'Yearly'
  status: 'Active' | 'Past due' | 'Cancelled'
  nextBilling: string
}

export interface VirtualAccount {
  id: string
  tenantId: string
  bank: string
  accountNumber: string
  accountName: string
  currency: string
  status: 'Active' | 'Closed'
}

export interface Beneficiary {
  id: string
  tenantId: string
  name: string
  channel: 'Bank' | 'MoMo'
  destination: string
  currency: string
  status: 'Active' | 'Disabled'
}

export interface FxRate {
  id: string
  pair: string
  buy: number
  sell: number
  updatedAt: string
}

export interface CheckoutStore {
  id: string
  tenantId: string
  name: string
  url: string
  products: number
  status: 'Live' | 'Draft'
}

export interface IdentityCheck {
  id: string
  tenantId: string
  subject: string
  type: 'NIN' | 'BVN' | 'Passport'
  reference: string
  status: 'Matched' | 'Mismatch' | 'Pending'
  checkedAt: string
}

export interface FeeRule {
  id: string
  channel: string
  country: string
  fee: string
  cap?: string
  status: 'Active' | 'Draft'
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  severity: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  at: string
  href?: string
}

export interface ReportJob {
  id: string
  name: string
  range: string
  format: 'CSV' | 'XLSX' | 'PDF'
  status: 'Ready' | 'Running' | 'Failed'
  createdAt: string
}

export interface SupportTicket {
  id: string
  tenantId: string
  subject: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'Pending' | 'Resolved'
  assignee: string
  updatedAt: string
}

export interface WebhookDelivery {
  id: string
  webhookId: string
  tenantId: string
  event: string
  status: 'Delivered' | 'Failed' | 'Retrying'
  attempts: number
  responseCode: number
  at: string
}

export interface DisputeEvidence {
  id: string
  disputeId: string
  fileName: string
  kind: 'Receipt' | 'Shipping' | 'Communication' | 'Other'
  uploadedAt: string
  status: 'Submitted' | 'Accepted' | 'Rejected'
}

export interface TxnTimelineEvent {
  at: string
  label: string
  detail: string
}

export interface ApiEvent {
  name: string
  description: string
  category: string
}

export const settlementAccounts: SettlementAccount[] = [
  {
    id: 'sa_01',
    tenantId: 'ten_01',
    bank: 'Stanbic UG',
    accountName: 'Nova Commerce Ltd',
    accountNumber: '•••• 4412',
    currency: 'UGX',
    primary: true,
    status: 'Verified',
  },
  {
    id: 'sa_02',
    tenantId: 'ten_02',
    bank: 'Equity KE',
    accountName: 'SafariFleet Ltd',
    accountNumber: '•••• 8821',
    currency: 'UGX',
    primary: true,
    status: 'Verified',
  },
  {
    id: 'sa_03',
    tenantId: 'ten_04',
    bank: 'BK Rwanda',
    accountName: 'Lakeview Stays',
    accountNumber: '•••• 1004',
    currency: 'UGX',
    primary: true,
    status: 'Pending',
  },
]

export const ledgerEntries: LedgerEntry[] = [
  {
    id: 'led_01',
    tenantId: 'ten_01',
    currency: 'UGX',
    wallet: 'Collection',
    type: 'Credit',
    amount: 75000,
    narration: 'Charge WB-NV-33012',
    createdAt: '2026-11-13 11:02',
  },
  {
    id: 'led_02',
    tenantId: 'ten_01',
    currency: 'UGX',
    wallet: 'Payout',
    type: 'Debit',
    amount: 500000,
    narration: 'Transfer WB-PAY-88',
    createdAt: '2026-11-13 08:15',
  },
  {
    id: 'led_03',
    tenantId: 'ten_02',
    currency: 'UGX',
    wallet: 'Collection',
    type: 'Credit',
    amount: 2400,
    narration: 'Charge WB-SF-55910',
    createdAt: '2026-11-13 10:40',
  },
  {
    id: 'led_04',
    tenantId: 'ten_04',
    currency: 'UGX',
    wallet: 'Collection',
    type: 'Credit',
    amount: 180000,
    narration: 'Charge WB-LV-22021',
    createdAt: '2026-11-13 09:55',
  },
]

export const invoices: Invoice[] = [
  {
    id: 'inv_01',
    tenantId: 'ten_01',
    customer: 'Amina K.',
    amount: 450000,
    currency: 'UGX',
    due: '2026-11-20',
    status: 'Sent',
  },
  {
    id: 'inv_02',
    tenantId: 'ten_02',
    customer: 'James O.',
    amount: 12500,
    currency: 'UGX',
    due: '2026-11-10',
    status: 'Overdue',
  },
  {
    id: 'inv_03',
    tenantId: 'ten_01',
    customer: 'Sarah N.',
    amount: 220000,
    currency: 'UGX',
    due: '2026-11-08',
    status: 'Paid',
  },
  {
    id: 'inv_04',
    tenantId: 'ten_04',
    customer: 'Guest checkout',
    amount: 98000,
    currency: 'UGX',
    due: '2026-11-25',
    status: 'Draft',
  },
]

export const subscriptions: Subscription[] = [
  {
    id: 'subp_01',
    tenantId: 'ten_01',
    plan: 'Growth',
    customer: 'Nova Marketplace',
    amount: 250000,
    currency: 'UGX',
    interval: 'Monthly',
    status: 'Active',
    nextBilling: '2026-12-01',
  },
  {
    id: 'subp_02',
    tenantId: 'ten_02',
    plan: 'Pro drivers',
    customer: 'SafariFleet Corp',
    amount: 8900,
    currency: 'UGX',
    interval: 'Monthly',
    status: 'Past due',
    nextBilling: '2026-11-05',
  },
  {
    id: 'subp_03',
    tenantId: 'ten_04',
    plan: 'Stays Plus',
    customer: 'Lakeview HQ',
    amount: 120000,
    currency: 'UGX',
    interval: 'Yearly',
    status: 'Active',
    nextBilling: '2027-01-15',
  },
]

export const virtualAccounts: VirtualAccount[] = [
  {
    id: 'va_01',
    tenantId: 'ten_01',
    bank: 'Webale VA · Centenary',
    accountNumber: '1002948812',
    accountName: 'Nova Commerce Collections',
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'va_02',
    tenantId: 'ten_02',
    bank: 'Webale VA · Equity',
    accountNumber: '8821994431',
    accountName: 'SafariFleet Inflows',
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'va_03',
    tenantId: 'ten_04',
    bank: 'Webale VA · BK',
    accountNumber: '4001128890',
    accountName: 'Lakeview Settlements',
    currency: 'UGX',
    status: 'Closed',
  },
]

export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben_01',
    tenantId: 'ten_01',
    name: 'Logistics partner',
    channel: 'Bank',
    destination: 'Stanbic ••4412',
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'ben_02',
    tenantId: 'ten_02',
    name: 'Driver pool MoMo',
    channel: 'MoMo',
    destination: '+254711***333',
    currency: 'UGX',
    status: 'Active',
  },
  {
    id: 'ben_03',
    tenantId: 'ten_01',
    name: 'Tax remittance',
    channel: 'Bank',
    destination: 'URA ••9001',
    currency: 'UGX',
    status: 'Disabled',
  },
]

export const fxRates: FxRate[] = [
  {
    id: 'fx_01',
    pair: 'USD/UGX',
    buy: 3680,
    sell: 3725,
    updatedAt: '2026-11-13 11:00',
  },
  {
    id: 'fx_02',
    pair: 'EUR/UGX',
    buy: 3980,
    sell: 4045,
    updatedAt: '2026-11-13 11:00',
  },
  {
    id: 'fx_03',
    pair: 'GBP/UGX',
    buy: 4620,
    sell: 4710,
    updatedAt: '2026-11-13 11:00',
  },
  {
    id: 'fx_04',
    pair: 'KES/UGX',
    buy: 28.5,
    sell: 29.1,
    updatedAt: '2026-11-13 10:45',
  },
]

export const checkoutStores: CheckoutStore[] = [
  {
    id: 'store_01',
    tenantId: 'ten_01',
    name: 'Nova Shop',
    url: 'pay.webale.io/nova-shop',
    products: 24,
    status: 'Live',
  },
  {
    id: 'store_02',
    tenantId: 'ten_04',
    name: 'Lakeview Bookings',
    url: 'pay.webale.io/lakeview',
    products: 8,
    status: 'Live',
  },
  {
    id: 'store_03',
    tenantId: 'ten_02',
    name: 'Safari tips',
    url: 'pay.webale.io/safari-tips',
    products: 3,
    status: 'Draft',
  },
]

export const identityChecks: IdentityCheck[] = [
  {
    id: 'idv_01',
    tenantId: 'ten_01',
    subject: 'Nova director',
    type: 'NIN',
    reference: 'CM••••8821',
    status: 'Matched',
    checkedAt: '2026-11-10 14:20',
  },
  {
    id: 'idv_02',
    tenantId: 'ten_02',
    subject: 'Fleet owner',
    type: 'BVN',
    reference: '22••••1098',
    status: 'Pending',
    checkedAt: '2026-11-13 09:00',
  },
  {
    id: 'idv_03',
    tenantId: 'ten_04',
    subject: 'GM passport',
    type: 'Passport',
    reference: 'PC••••441',
    status: 'Mismatch',
    checkedAt: '2026-11-12 16:10',
  },
]

export const feeRules: FeeRule[] = [
  {
    id: 'fee_01',
    channel: 'Mobile money',
    country: 'UG',
    fee: '1.5%',
    cap: 'UGX 5,000',
    status: 'Active',
  },
  {
    id: 'fee_02',
    channel: 'Card',
    country: 'KE',
    fee: '2.9% + 30',
    status: 'Active',
  },
  {
    id: 'fee_03',
    channel: 'Bank transfer',
    country: 'RW',
    fee: 'Flat 500',
    status: 'Active',
  },
  {
    id: 'fee_04',
    channel: 'Transfers outbound',
    country: 'UG',
    fee: '0.5%',
    cap: 'UGX 10,000',
    status: 'Draft',
  },
]

export const notifications: NotificationItem[] = [
  {
    id: 'nt_01',
    title: 'KYC pending',
    body: '2 tenants awaiting document review',
    severity: 'warning',
    read: false,
    at: '2026-11-13 10:55',
    href: '/kyc',
  },
  {
    id: 'nt_02',
    title: 'Failed charges spike',
    body: 'FailedToday above threshold on Live',
    severity: 'error',
    read: false,
    at: '2026-11-13 10:40',
    href: '/transactions',
  },
  {
    id: 'nt_03',
    title: 'Settlement paid',
    body: 'Nova Commerce UGX 12.4M settled',
    severity: 'success',
    read: true,
    at: '2026-11-13 08:20',
    href: '/settlements',
  },
  {
    id: 'nt_04',
    title: 'Webhook failing',
    body: 'Lakeview endpoint 5xx for charge.success',
    severity: 'warning',
    read: false,
    at: '2026-11-13 07:50',
    href: '/webhooks',
  },
]

export const reportJobs: ReportJob[] = [
  {
    id: 'rep_01',
    name: 'Daily collections',
    range: '2026-11-12',
    format: 'CSV',
    status: 'Ready',
    createdAt: '2026-11-13 06:00',
  },
  {
    id: 'rep_02',
    name: 'Settlement register',
    range: 'Nov 2026 MTD',
    format: 'XLSX',
    status: 'Ready',
    createdAt: '2026-11-13 06:05',
  },
  {
    id: 'rep_03',
    name: 'Dispute aging',
    range: 'Last 30 days',
    format: 'PDF',
    status: 'Running',
    createdAt: '2026-11-13 11:00',
  },
  {
    id: 'rep_04',
    name: 'FX ledger',
    range: 'Week 45',
    format: 'CSV',
    status: 'Failed',
    createdAt: '2026-11-12 22:10',
  },
]

export const supportTickets: SupportTicket[] = [
  {
    id: 'tkt_01',
    tenantId: 'ten_02',
    subject: 'Delayed driver payouts',
    priority: 'High',
    status: 'Open',
    assignee: 'Support · Leah',
    updatedAt: '2026-11-13 10:12',
  },
  {
    id: 'tkt_02',
    tenantId: 'ten_01',
    subject: 'Refund API 422',
    priority: 'Medium',
    status: 'Pending',
    assignee: 'DevRel · Sam',
    updatedAt: '2026-11-13 09:40',
  },
  {
    id: 'tkt_03',
    tenantId: 'ten_04',
    subject: 'VA statement copy',
    priority: 'Low',
    status: 'Resolved',
    assignee: 'Support · Leah',
    updatedAt: '2026-11-12 18:00',
  },
]

export const webhookDeliveries: WebhookDelivery[] = [
  {
    id: 'wd_01',
    webhookId: 'wh_01',
    tenantId: 'ten_01',
    event: 'charge.success',
    status: 'Delivered',
    attempts: 1,
    responseCode: 200,
    at: '2026-11-13 11:02',
  },
  {
    id: 'wd_02',
    webhookId: 'wh_02',
    tenantId: 'ten_04',
    event: 'charge.success',
    status: 'Failed',
    attempts: 4,
    responseCode: 503,
    at: '2026-11-13 10:55',
  },
  {
    id: 'wd_03',
    webhookId: 'wh_02',
    tenantId: 'ten_04',
    event: 'transfer.success',
    status: 'Retrying',
    attempts: 2,
    responseCode: 502,
    at: '2026-11-13 10:50',
  },
  {
    id: 'wd_04',
    webhookId: 'wh_01',
    tenantId: 'ten_01',
    event: 'refund.completed',
    status: 'Delivered',
    attempts: 1,
    responseCode: 200,
    at: '2026-11-13 09:15',
  },
]

export const disputeEvidence: DisputeEvidence[] = [
  {
    id: 'ev_01',
    disputeId: 'dsp_01',
    fileName: 'receipt-wb-nv.pdf',
    kind: 'Receipt',
    uploadedAt: '2026-11-12 15:20',
    status: 'Submitted',
  },
  {
    id: 'ev_02',
    disputeId: 'dsp_01',
    fileName: 'chat-transcript.txt',
    kind: 'Communication',
    uploadedAt: '2026-11-12 15:22',
    status: 'Accepted',
  },
  {
    id: 'ev_03',
    disputeId: 'dsp_02',
    fileName: 'delivery-proof.jpg',
    kind: 'Shipping',
    uploadedAt: '2026-11-11 11:05',
    status: 'Rejected',
  },
]

export const txnTimelines: Record<string, TxnTimelineEvent[]> = {
  default: [
    { at: 'Created', label: 'Initiated', detail: 'Customer started checkout' },
    { at: '+2s', label: 'Authorized', detail: 'Provider accepted charge' },
    { at: '+4s', label: 'Captured', detail: 'Funds confirmed' },
    { at: '+6s', label: 'Webhook', detail: 'charge.success delivered' },
  ],
}

export const apiEvents: ApiEvent[] = [
  {
    name: 'charge.success',
    description: 'A charge completed successfully',
    category: 'Charges',
  },
  {
    name: 'charge.failed',
    description: 'A charge failed or was declined',
    category: 'Charges',
  },
  {
    name: 'refund.completed',
    description: 'A refund finished posting',
    category: 'Refunds',
  },
  {
    name: 'transfer.success',
    description: 'Outbound transfer paid',
    category: 'Transfers',
  },
  {
    name: 'subscription.renewed',
    description: 'Recurring plan billed',
    category: 'Subscriptions',
  },
  {
    name: 'dispute.opened',
    description: 'Chargeback / dispute opened',
    category: 'Risk',
  },
  {
    name: 'kyc.approved',
    description: 'Tenant KYC approved for live',
    category: 'Compliance',
  },
  {
    name: 'settlement.paid',
    description: 'Settlement batch paid out',
    category: 'Settlements',
  },
]

function scopedByTenant<T extends { tenantId: string }>(rows: T[]) {
  return computed(() =>
    rows.filter((r) => !session.tenantId || r.tenantId === session.tenantId),
  )
}

export const scopedSettlementAccounts = scopedByTenant(settlementAccounts)
export const scopedLedger = scopedByTenant(ledgerEntries)
export const scopedInvoices = scopedByTenant(invoices)
export const scopedSubscriptions = scopedByTenant(subscriptions)
export const scopedVirtualAccounts = scopedByTenant(virtualAccounts)
export const scopedBeneficiaries = scopedByTenant(beneficiaries)
export const scopedCheckoutStores = scopedByTenant(checkoutStores)
export const scopedIdentityChecks = scopedByTenant(identityChecks)
export const scopedSupportTickets = scopedByTenant(supportTickets)
export const scopedWebhookDeliveries = scopedByTenant(webhookDeliveries)

export const unreadNotifications = computed(
  () => notifications.filter((n) => !n.read).length,
)
