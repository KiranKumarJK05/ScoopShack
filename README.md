# ScoopShack 🍦

A modern ice cream parlour management system built with React, TypeScript, and Java Spring Boot.

Features:
- Interactive menu browsing
- Cart and checkout
- Order management
- Automated billing with student discounts and GST
- Inventory and stock tracking
- Bill lookup
- Staff sales dashboard

## Run Locally

**Prerequisite:** Node.js and Java 25.

### 1. Start the frontend

```bash
npm install
npm run dev
```

### 2. Configure the backend

The frontend uses the backend URL configured in `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Start the Java backend

Open a separate terminal:

```powershell
cd backend/backend
.\mvnw.cmd spring-boot:run
```

The frontend runs at `http://localhost:3000` and the backend at `http://localhost:8080`.

The final ScoopShack Website link : https://scoopshack.vercel.app/
