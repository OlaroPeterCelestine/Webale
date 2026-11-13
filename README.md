# Webale

Enterprise **multi-tenant payment gateway** admin console (Flutterwave / Paystack style).

Standalone project at `~/Desktop/Webale` — not linked to the school desk.

## Modules

**Operations** — Overview, Tenants, Transactions, Subaccounts, Payment links, Settlements  

**Risk & compliance** — Disputes / chargebacks, KYC queue, Audit logs (CSV export)  

**Admin** — Team & roles (RBAC), System health  

**Developers** — Webhooks, API keys, REST API reference (`api.webale.io/v1`)

## Run

```bash
cd ~/Desktop/Webale
npm install
npm run dev
```

[http://localhost:5180](http://localhost:5180)
