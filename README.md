# Clinico — Enterprise Healthcare & Telehealth Platform

Clinico is an enterprise-grade, production-ready Healthcare and Telehealth platform built from scratch using Next.js 14 (App Router, Server Actions), TypeScript (Strict Mode), Tailwind CSS, Framer Motion, Prisma ORM, NextAuth.js v5 (Auth.js) with Role-Based Access Control (`PATIENT`, `DOCTOR`, `ADMIN`), and `@react-pdf/renderer` for instant digital prescription PDFs.

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
                                    │    Prisma ORM & SQLite DB    │
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
├── prisma/
│   ├── schema.prisma          # Data Models (User, DoctorProfile, PatientProfile, Appointment, Prescription)
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
Default `.env` contents:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="clinico_super_secret_jwt_key_2026_production_grade"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_mock_key"
STRIPE_WEBHOOK_SECRET="whsec_mock_key"
```

### 4. Database Initialization & Seeding
Push the Prisma schema to create the SQLite database (`dev.db`) and seed demo accounts:
```bash
npm run db:push
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

## 🚀 Production Deployment (Vercel & PostgreSQL)

To deploy Clinico to production on **Vercel** with **PostgreSQL** (Supabase, Neon, or AWS RDS):

1. **Switch Database Provider in `prisma/schema.prisma`**:
   Change `provider = "sqlite"` to `provider = "postgresql"`.
2. **Push Schema & Build**:
   Set `DATABASE_URL` in Vercel Environment Variables to your PostgreSQL connection string.
3. **Run Prisma Migration**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Deploy**:
   ```bash
   vercel --prod
   ```
