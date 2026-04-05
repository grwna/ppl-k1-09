# Midtrans Backend API

UNTUK LIHAT CONTOH API LANGSUNG KE LINE 100 saja
TOlong di bagian bawah pagenya dikasih tombol untuk pergi ke link simulator (link simulator akan didapat dari response api juga)

Base path:

- `/api/payments/midtrans`

---

## Architecture Summary

The payment flow now uses **payment intent first**:

1. Create `PaymentTransaction` (`PENDING`) after Midtrans charge is created.
2. Listen for settlement via webhook/status/simulate endpoints.
3. On settlement, create business rows and link them back to payment intent:
   - donation -> create `DonorFund` with `paymentTransactionId`
   - repayment -> create/update `Repayment` with `paymentTransactionId`

### Why this design

- Avoids circular dependency (business row does not need to exist before payment).
- Preserves all payment attempts (pending/failed/expired/success) in one ledger table.
- Keeps callback processing idempotent with unique `paymentTransactionId` links.

---

## Data Model (Current)

### `PaymentTransaction`

- Source of truth for provider transaction lifecycle.
- Stores `referenceId` + `category` as business intent reference.
- Does **not** directly FK to `DonorFund`/`Repayment`.

### `DonorFund`

- Has optional unique FK `paymentTransactionId` -> `PaymentTransaction.id`.
- Created on settlement for `DONATION` category.

### `Repayment`

- Has optional unique FK `paymentTransactionId` -> `PaymentTransaction.id`.
- Created or confirmed on settlement for `REPAYMENT` category.

---

## Settlement Fulfillment Service

Service file:

- `src/services/payment-fulfillment.service.ts`

Function:

- `createBusinessRecordFromSettledPayment(paymentTransaction)`

Behavior:

- Returns immediately if status is not `SETTLEMENT`.
- `DONATION`:
  - check `DonorFund` by `paymentTransactionId`
  - if missing, create `DonorFund` using:
    - `donorId = paymentTransaction.referenceId`
    - `amount = paymentTransaction.amount`
    - `remaining = paymentTransaction.amount`
- `REPAYMENT`:
  - check `Repayment` by `paymentTransactionId`
  - if missing, create `Repayment` using:
    - `loanId = paymentTransaction.referenceId`
    - `amount = paymentTransaction.amount`
    - `paidAt = now()`
    - `status = CONFIRMED`
  - if exists but status not `CONFIRMED`, update to `CONFIRMED`

This makes callback handling idempotent and safe for repeated notifications.

---

## Status Synchronization Rules

Status mapping (Midtrans -> local `TransactionStatus`):

- `settlement`, `capture` -> `SETTLEMENT`
- `pending` -> `PENDING`
- `expire` -> `EXPIRE`
- `deny`, `cancel`, `failure`, `refund`, `partial_refund`, `chargeback` -> `FAILURE`

Monotonic settlement rule (important):

- Once local status is `SETTLEMENT`, it will **not** be downgraded by later polling/webhook payloads.
- API responses still include `rawMidtransStatus` for transparency.

---

## 1) Create Payment

**POST** `/api/payments/midtrans/payments`

Creates Midtrans charge and stores `PaymentTransaction` with `PENDING` status.

### Request body (QRIS example)

```json
{
  "amount": 25000,
  "transactionType": "donation",
  "paymentMethod": "qris",
  "referenceId": "ee8a75f5-d26a-4a9c-828d-a18c770c2ad6",
  "customer": {
    "email": "user@example.com",
    "name": "User Name"
  },
  "metadata": {
    "source": "donation-service"
  }
}
```

### Request body (VA example)

```json
{
  "amount": 25000,
  "transactionType": "repayment",
  "paymentMethod": "va",
  "vaBank": "bca",
  "referenceId": "e8d39c8f-10b7-488e-b66f-d42f58c8cb79"
}
```

### Validation rules

- `amount` must be > 0
- `transactionType` must be `donation` or `repayment`
- `paymentMethod` must be `qris` or `va`
- `referenceId` is required UUID
- customer email and name are optional
- `customer.userId` is optional, but if provided it must be UUID
- `referenceId` semantic mapping:
  - `transactionType=donation` -> `referenceId` must be `users.id` (donor)
  - `transactionType=repayment` -> `referenceId` must be `loans.id`
- minimum QRIS amount: **1500**
- if `paymentMethod=va`, `vaBank` must be one of:
  - `bca`, `bri`, `bni`, `permata`, `cimb`, `mandiri_bill`, `danamon`, `bsi`, `seabank`

### Success response (QRIS example)

TOLONG DISPLAY GAMBAR QRISNYA dari url qrCodeImageUrl

```json
{
  "success": true,
  "data": {
    "paymentTransactionId": "440ca04e-0074-45a5-a534-0010867d9119",
    "orderId": "DONATION-1775329604286-1R2BC0",
    "transactionId": "30d7b184-9017-4d31-9566-b3c23374bfe3",
    "transactionType": "donation",
    "paymentMethod": "qris",
    "vaBank": null,
    "amount": 20000,
    "status": "pending",
    "expiryTime": "2026-04-05 03:06:44",
    "qris": {
      "qrCodeImageUrl": "https://api.sandbox.midtrans.com/..."
    },
    "va": {
      "bankCode": null,
      "vaNumber": null,
      "billerCode": null,
      "billKey": null
    },
    "simulator": {
      "url": "https://simulator.sandbox.midtrans.com/v2/qris/index"
    }
  }
}
```

### Success response (VA example - non Mandiri)
kalau ini display nomor VA nya

```json
{
  "success": true,
  "data": {
    "paymentTransactionId": "8f8ab5fc-8517-4771-8e91-e19aff9907e7",
    "orderId": "REPAYMENT-1775330439791-0HC2LW",
    "transactionId": "9249931e-e395-431c-abac-375e83b7986d",
    "transactionType": "repayment",
    "paymentMethod": "va",
    "vaBank": "bca",
    "amount": 25000,
    "status": "pending",
    "expiryTime": "2026-04-05 03:20:40",
    "qris": {
      "qrCodeImageUrl": null
    },
    "va": {
      "bankCode": "bca",
      "vaNumber": "88175239261128715546665",
      "billerCode": null,
      "billKey": null
    },
    "simulator": {
      "url": "https://simulator.sandbox.midtrans.com/bca/va/index"
    }
  }
}
```

### Success response (VA example - Mandiri)
kalau ini display billercode sama billkey

```json
{
  "success": true,
  "data": {
    "paymentTransactionId": "uuid",
    "orderId": "REPAYMENT-xxxx",
    "transactionId": "midtrans-transaction-id",
    "transactionType": "repayment",
    "paymentMethod": "va",
    "vaBank": "mandiri_bill",
    "amount": 25000,
    "status": "pending",
    "va": {
      "bankCode": "mandiri_bill",
      "vaNumber": null,
      "billerCode": "70012",
      "billKey": "123456789012"
    },
    "simulator": {
      "url": "https://simulator.sandbox.midtrans.com/openapi/va/index?bank=mandiri"
    }
  }
}
```

### VA values to display (important)

- Non-Mandiri VA (`bca`, `bri`, `bni`, `permata`, `cimb`, `danamon`, `bsi`, `seabank`):
  - show `bankCode`
  - show `vaNumber` (main payment number)
- Mandiri VA (`mandiri_bill`):
  - show `bankCode`
  - show `billerCode`
  - show `billKey`
  - `vaNumber` is expected to be null

### Response highlights

- Returns `paymentTransactionId`, `orderId`, `transactionId`, status, expiry, and payment channel details.
- `metadata.referenceId` mirrors request reference for traceability.

---

## 2) Get Payment Status / Detail

**GET** `/api/payments/midtrans/payments/{orderId}`

Behavior:

- Fetches latest status from Midtrans.
- Maps provider status to local enum.
- Updates local `PaymentTransaction`.
- Applies monotonic rule (won't downgrade settled payment).
- On settled transaction, triggers fulfillment service to create/update business row.

Key response fields:

- `status`: effective local status (monotonic)
- `rawMidtransStatus`: latest status returned by Midtrans

---

## 3) Get Midtrans Simulator Link

**GET** `/api/payments/midtrans/simulator-link?paymentMethod=qris|va&vaBank=...`

### Query params

- `paymentMethod` (required): `qris` or `va`
- `vaBank` (required if `paymentMethod=va`):
  - `bca`, `bri`, `bni`, `permata`, `cimb`, `mandiri_bill`, `danamon`, `bsi`, `seabank`

---

## 4) Webhook Endpoint

**POST** `/api/payments/midtrans/webhook`

Behavior:

- Verifies Midtrans signature.
- Updates `PaymentTransaction.status` (with monotonic settlement rule).
- Calls fulfillment service when effective status is `SETTLEMENT`.

Health check:

- **GET** `/api/payments/midtrans/webhook`

Also available for frontend compatibility:

- `POST /api/payments/midtrans/notification`

---

## Compatibility Endpoints

These routes are still kept for current frontend compatibility:

- `POST /api/payments/midtrans/charge`
- `GET /api/payments/midtrans/status/{transactionId}`
- `POST /api/payments/midtrans/notification`
- `POST /api/payments/midtrans/simulate`

---

## End-to-End Settlement Outcome

When a transaction reaches `SETTLEMENT`:

- `PaymentTransaction.status` becomes `SETTLEMENT`.
- Donation flow creates one `DonorFund` linked by `paymentTransactionId`.
- Repayment flow creates (or confirms) one `Repayment` linked by `paymentTransactionId`.
- Repeated callbacks/status polls stay safe and idempotent.