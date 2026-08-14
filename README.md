# Clinico — Enterprise Healthcare & Telehealth Platform

Clinico is an enterprise-grade, production-ready Healthcare and Telehealth platform built from scratch using Next.js 14 (App Router, Server Actions), TypeScript (Strict Mode), Tailwind CSS, Framer Motion, Prisma ORM with PostgreSQL (Supabase), NextAuth.js v5 (Auth.js) with Role-Based Access Control (`PATIENT`, `DOCTOR`, `ADMIN`), Stripe payment integration, and `@react-pdf/renderer` for instant digital prescription PDFs.

---

## 🎯 Architecture & Features Overview

```
                        ┌────────────────────────────────────────────────────────┐
                        │                   Clinico Next.js 14                   │
                        │                 App Router Architecture                │
                        └───────────────────────────┬────────────────────────────┘
                                                    │
             ┌──────────────────────────────────────┼──────────────────────────────────────┐
             ▼                                      ▼                                      ▼
  ┌──────────────────────┐               ┌──────────────────────┐               ┌──────────────────────┐
  │  Public & Booking    │               │ Role Dashboards      │               │ Server Actions & API │
  │  - / landing page    │               │ - /dashboard/admin   │               │ - lib/actions/*      │
  │  - /doctors          │               │ - /dashboard/doctor  │               │ - api/auth/*         │
  │  - /doctors/[id]     │               │ - /dashboard/patient │               │ - api/webhooks/*     │
  └──────────┬───────────┘               └──────────┬───────────┘               └──────────┬───────────┘
             │                                      │                                      │
             └──────────────────────────────────────┼──────────────────────────────────────┘
                                                    │
                                                    ▼
                                    ┌──────────────────────────────┐
                                    │   Prisma ORM & PostgreSQL    │
                                    │     (Supabase + PgBouncer)   │
                                    │  User | Doctor | Patient |   │
                                    │  Appointment | Prescription  │
                                    └──────────────────────────────┘
```

### Key Capabilities
1. **Public Doctor Directory & Booking Engine (`/doctors`)**:
   - Filter doctors by specialty, price range, and name search.
   - Dynamic 7-day time slot calendar with double-booking prevention and transient slot lock.
   - Support for both HD Video Telehealth consultations and In-Person visits.
2. **Doctor Workspace (`/dashboard/doctor`)**:
   - Dynamic Schedule Modifier to toggle available slots and active/inactive status.
   - Interactive E-Prescription Builder with medicine array adder and instant `@react-pdf/renderer` PDF generation.
3. **Patient Portal (`/dashboard/patient`)**:
   - Metrics overview (upcoming visits, history, digital prescriptions).
   - Tabbed view for upcoming vs past visits.
   - Diagnostic medical report upload drawer.
   - One-click PDF Prescription Download.
   - Live P2P encrypted virtual video call launcher stub.
4. **Admin Executive Control Center (`/dashboard/admin`)**:
   - Platform KPIs: Total Revenue, Total Bookings, Active Doctors, Total Patients.
   - Specialist Onboarding CRUD interface.
   - System activity table and status overrides.
5. **Security & RBAC Middleware**:
   - Role-Based Access Control enforcing strict JWT-based route access (`/admin`, `/doctor`, `/patient`).

---

## 📁 Directory Structure Layout

```
clinico/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── admin/page.tsx
│   │   ├── doctor/page.tsx
│   │   └── patient/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── prescriptions/[id]/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── doctors/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # Shadcn UI primitives (Button, Card, Dialog, Badge, Input)
│   ├── dashboard/             # Admin, Doctor, Patient interactive client components
│   ├── booking/               # 7-Day Calendar slot picker & payment drawer
│   ├── prescription/          # React-PDF Document template & interactive builder
│   ├── navbar.tsx             # Dynamic navigation bar with role auth dropdown
│   ├── footer.tsx             # Platform footer & compliance links
│   └── providers.tsx          # NextAuth SessionProvider wrapper
├── lib/
│   ├── actions/               # Next.js Server Actions (auth, appointments, doctors, prescriptions)
│   ├── db.ts                  # Database connection client (Prisma)
│   ├── auth.ts                # NextAuth configuration & credentials helper
│   └── validations/           # Zod boundary validation schemas
├── middleware.ts              # Route protection & role redirection middleware
├── netlify.toml               # Netlify build configuration & plugin setup
├── prisma/
│   ├── schema.prisma          # Data Models (PostgreSQL provider & directUrl)
│   └── seed.ts                # Database seed script for test accounts & sample data
├── types/                     # NextAuth TypeScript type definitions
├── .env.example
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Local Setup Guide

### 1. Prerequisites
- Node.js 18.x or 20.x installed
- npm or yarn
- PostgreSQL database (e.g. Supabase, Neon, or local PostgreSQL instance)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
# Database Connections (Supabase PostgreSQL / PgBouncer)
DATABASE_URL="postgresql://postgres.ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.ref.supabase.co:5432/postgres"

# NextAuth Authentication
NEXTAUTH_SECRET="clinico_super_secret_jwt_key_2026_production_grade"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Payments Integration
STRIPE_SECRET_KEY="sk_test_mock_key"
STRIPE_WEBHOOK_SECRET="whsec_mock_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_mock_key"
```

> **Note on Special Characters in Database Passwords:**
> If your database password contains `@` or other URI special characters, URL-encode them (e.g., `@` becomes `%40`).

### 4. Database Schema Sync & Seeding
Push the Prisma schema to your PostgreSQL database and seed demo accounts:
```bash
npx prisma db push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Path |
| :--- | :--- | :--- | :--- |
| **Patient Demo** | `patient@clinico.com` | `password123` | `/dashboard/patient` |
| **Doctor Demo** | `doctor@clinico.com` | `password123` | `/dashboard/doctor` |
| **Admin Demo** | `admin@clinico.com` | `password123` | `/dashboard/admin` |

*(Quick-login buttons are also available directly on the `/login` page for one-click access).*

---

## 🚀 Netlify Deployment Guide

Clinico is configured for seamless deployment on **Netlify** using Next.js 14 Serverless Functions and `@netlify/plugin-nextjs`.

### 1. `netlify.toml` Setup
Your repository includes a pre-configured `netlify.toml`:
```toml
[build]
  command = "prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. Netlify Environment Variables
In your **Netlify Dashboard** (**Site configuration > Environment variables**), set the following key-value pairs:

| Variable | Example / Description |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres.ref:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres:password@db.ref.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | `your_production_nextauth_secret` |
| `NEXTAUTH_URL` | `https://your-site-name.netlify.app` |
| `NODE_VERSION` | `20` |

### 3. Key Deployment Best Practices
- **Supabase Connection Pooling**: Use the **Transaction Pooler** URL (port `6543` with `?pgbouncer=true`) for `DATABASE_URL` in Netlify to prevent connection exhaustion.
- **Dynamic Pre-rendering**: The homepage includes `export const dynamic = "force-dynamic"` to ensure Next.js defers database queries to request runtime rather than build time.
