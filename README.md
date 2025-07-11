# 📧 Resilient Email Sending Service (Mock Providers)

A robust, fault-tolerant email dispatching API built with TypeScript and Express.js. Designed with retry logic, fallback providers, circuit breakers, idempotency, and basic rate-limiting — ready for cloud deployment on Vercel.

---

## 🚀 Features

- ✅ Retry with exponential backoff
- 🔁 Fallback between multiple email providers
- 🔐 Idempotency support to prevent duplicate sends
- 🚦 Basic rate limiting (token-based)
- 🧠 Circuit breaker pattern
- 🧾 Simple in-memory queueing
- 📈 Status tracking & logging
- 🌐 API-first, deployable via Vercel

---

## 📦 Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Deployment**: Vercel (serverless function)
- **Testing**: Jest (optional extension)

---

## 📁 Project Structure
```
email-service-vercel-template/
├── src/
│   ├── server.ts               # Express API entry point
│   ├── EmailService.ts         # Core logic for sending emails
│   ├── providers/              # Mock email providers A & B
│   │   ├── MockProviderA.ts
│   │   └── MockProviderB.ts
│   ├── utils/                  # Logger and CircuitBreaker utilities
│   │   ├── Logger.ts
│   │   └── CircuitBreaker.ts
│   └── types/
│       └── Email.ts            # Shared type definitions
├── vercel.json                 # Vercel deployment configuration
├── package.json                # NPM dependencies and scripts
├── tsconfig.json               # TypeScript compiler configuration

```

---

## 📬 API Endpoint

### `POST /api/send-email`

Sends an email via available providers with retry/fallback support.

#### 🔸 Request Body

```json
{
  "to": "user@example.com",
  "subject": "Test Email",
  "body": "This is a mock email sent via resilient service.",
  "idempotencyKey": "email-unique-id-123"
}
```

🔸 Response
```json
{
  "status": "success",
  "provider": "MockProviderA",
  "attempts": 1
}
```

1. Install dependencies
```
npm install
```
2. Run locally
```
npm run dev
```
The service will run at http://localhost:3000


## ✅ Assumptions
-This project uses mock providers to simulate failures and success.

-The idempotencyKey is expected to be globally unique per email request.

-State (rate limits, email cache) is stored in-memory — suitable for serverless demos, not production.

-Email sending simulates ~70%/50% failure rate for retry testing.


## 👤 Author
-Built by [Busa Viraj] — feel free to fork and extend this for your own email backend or service reliability use case!
