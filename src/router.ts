import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from './data/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/Login.vue'),
      meta: { public: true },
    },
    { path: '/', name: 'overview', component: () => import('./pages/Overview.vue') },
    { path: '/tenants', name: 'tenants', component: () => import('./pages/Tenants.vue') },
    {
      path: '/tenants/:id',
      name: 'tenant-360',
      component: () => import('./pages/Tenant360.vue'),
    },
    { path: '/balances', name: 'balances', component: () => import('./pages/Balances.vue') },
    { path: '/transactions', name: 'transactions', component: () => import('./pages/Transactions.vue') },
    { path: '/refunds', name: 'refunds', component: () => import('./pages/Refunds.vue') },
    { path: '/transfers', name: 'transfers', component: () => import('./pages/Transfers.vue') },
    { path: '/customers', name: 'customers', component: () => import('./pages/Customers.vue') },
    { path: '/invoices', name: 'invoices', component: () => import('./pages/Invoices.vue') },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: () => import('./pages/Subscriptions.vue'),
    },
    {
      path: '/virtual-accounts',
      name: 'virtual-accounts',
      component: () => import('./pages/VirtualAccounts.vue'),
    },
    {
      path: '/beneficiaries',
      name: 'beneficiaries',
      component: () => import('./pages/Beneficiaries.vue'),
    },
    { path: '/subaccounts', name: 'subaccounts', component: () => import('./pages/SubAccounts.vue') },
    { path: '/payment-links', name: 'payment-links', component: () => import('./pages/PaymentLinks.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('./pages/CheckoutBuilder.vue') },
    { path: '/settlements', name: 'settlements', component: () => import('./pages/Settlements.vue') },
    {
      path: '/settlement-accounts',
      name: 'settlement-accounts',
      component: () => import('./pages/SettlementAccounts.vue'),
    },
    { path: '/fx', name: 'fx', component: () => import('./pages/FxRates.vue') },
    { path: '/disputes', name: 'disputes', component: () => import('./pages/Disputes.vue') },
    { path: '/fraud', name: 'fraud', component: () => import('./pages/Fraud.vue') },
    { path: '/identity', name: 'identity', component: () => import('./pages/IdentityVerify.vue') },
    { path: '/kyc', name: 'kyc', component: () => import('./pages/KycQueue.vue') },
    { path: '/logs', name: 'logs', component: () => import('./pages/AuditLogs.vue') },
    { path: '/team', name: 'team', component: () => import('./pages/Team.vue') },
    { path: '/fees', name: 'fees', component: () => import('./pages/FeesPricing.vue') },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('./pages/Notifications.vue'),
    },
    { path: '/reports', name: 'reports', component: () => import('./pages/Reports.vue') },
    { path: '/support', name: 'support', component: () => import('./pages/SupportTickets.vue') },
    { path: '/system', name: 'system', component: () => import('./pages/SystemHealth.vue') },
    { path: '/simulator', name: 'simulator', component: () => import('./pages/Simulator.vue') },
    { path: '/webhooks', name: 'webhooks', component: () => import('./pages/Webhooks.vue') },
    { path: '/events', name: 'events', component: () => import('./pages/EventsCatalogue.vue') },
    { path: '/api-keys', name: 'api-keys', component: () => import('./pages/ApiKeys.vue') },
    { path: '/developers', name: 'developers', component: () => import('./pages/Developers.vue') },
    { path: '/more', name: 'more', component: () => import('./pages/More.vue') },
  ],
})

router.beforeEach((to) => {
  const isPublic = to.meta.public === true || to.name === 'login'
  if (!isAuthenticated.value && !isPublic) {
    return {
      name: 'login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    }
  }
  if (isAuthenticated.value && to.name === 'login') return { path: '/' }
  return true
})
