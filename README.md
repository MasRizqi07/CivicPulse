# CivicPulse - Public Service Workflow Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## Overview

**CivicPulse** is a modern, comprehensive platform that connects citizens with government agencies to streamline public service issue reporting and resolution. Citizens can report problems, track progress, and communicate with officials, while agencies and officers can efficiently manage, assign, and resolve reports.

## ✨ Key Features

### For Citizens

- 📝 Create detailed public service reports with location
- 📱 Track report status (refresh page for latest updates)
- 💬 Add comments and attachments to reports
- 📊 View dashboard with report statistics
- 🔔 Receive status update notifications

### For Officers

- 📥 Manage and assign reports within your agency
- 🔄 Update report status (Draft → Submitted → Assigned → In Progress → Resolved → Closed)
- 💬 Communicate with citizens via comments
- 📋 View report history and audit trails

### For Administrators

- 🏛️ Manage government agencies
- 👥 Administer users and roles
- 📊 View comprehensive reports and analytics
- 📝 Access audit logs for compliance

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 with App Router (React 19)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

### Backend & Infrastructure

- **API**: Next.js Route Handlers
- **ORM**: Prisma 6.5
- **Database**: PostgreSQL 16
- **Authentication**: Better Auth
- **Queue System**: BullMQ + Redis 7
- **Storage**: AWS S3 / MinIO
- **Logging**: Pino
- **Error Tracking**: Sentry

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (via Next.js config)
- **Database Studio**: Prisma Studio

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have these installed:

- **Node.js**: v20 or later
- **PostgreSQL**: v16 or later
- **Redis**: v7 or later
- **npm**: v10 or later

### Installation

1. **Clone or navigate to the project**

   ```bash
   cd "d:\MY CODE\TRAE IDE\COMPFEST-UI-SOFTWARE-ENGINEERING\CivicPulse"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy the example file:

     ```bash
     cp .env.example .env
     ```

   - Update `.env` with your configuration:

     ```env
     # Database
     DATABASE_URL="postgresql://postgres:your-password@localhost:5432/civicpulse?schema=public"

     # Redis
     REDIS_URL="redis://localhost:6379"

     # Better Auth
     BETTER_AUTH_SECRET="your-super-secret-key-at-least-32-characters-long"
     BETTER_AUTH_URL="http://localhost:3000"

     # S3 Storage (MinIO for local dev)
     S3_ENDPOINT="http://localhost:9000"
     S3_ACCESS_KEY="minioadmin"
     S3_SECRET_KEY="minioadmin"
     S3_BUCKET="civicpulse"

     # Sentry (optional)
     SENTRY_DSN=""
     ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed with sample data
   npm run db:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to `http://localhost:3000` in your browser.

## 👤 Default Users (from Seed)

Use these credentials to test different roles:

| Email | Password | Role |
| ------- | ---------- | ------ |
| `admin@civicpulse.id` | `password123` | SUPER_ADMIN |
| `officer@civicpulse.id` | `password123` | OFFICER |
| `citizen@civicpulse.id` | `password123` | CITIZEN |

## 📁 Project Structure

### Root Directory

```
CivicPulse/
├── prisma/                   # Database layer
│   ├── schema.prisma         # Prisma database schema
│   └── seed.ts               # Database seeding script
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   ├── modules/              # Feature modules (DDD-style)
│   ├── server/               # Server utilities
│   ├── lib/                  # Shared utilities
│   └── middleware.ts         # Next.js middleware
├── .env.example              # Environment variables template
├── .env                      # Local environment variables
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── DESIGN.md                 # Design system & architecture docs
└── README.md                 # This file
```

### Source Code (`src/`)

#### `src/app/` - Next.js App Router

```
app/
├── api/                      # API routes
│   ├── auth/[...slug]/       # Better Auth endpoints
│   └── v1/                   # REST API v1
│       ├── agencies/
│       ├── comments/
│       ├── reports/
│       └── ...
├── dashboard/                # Dashboard pages
│   ├── layout.tsx
│   └── page.tsx
├── login/                    # Login page
├── register/                 # Register page
├── reports/                  # Report management
│   ├── page.tsx              # List reports
│   ├── new/                  # Create report
│   └── [id]/                 # Report detail
├── admin/                    # Admin panel
├── notifications/            # Notifications page
├── settings/                 # Settings page
├── layout.tsx                # Root layout
├── page.tsx                  # Home page
└── globals.css               # Global styles
```

#### `src/modules/` - Feature Modules

Each module follows a consistent pattern:

```
modules/
├── reports/
│   ├── repositories/         # Data access layer
│   │   └── report.repository.ts
│   ├── services/             # Business logic
│   │   ├── create-report.service.ts
│   │   ├── update-report-status.service.ts
│   │   └── ...
│   ├── types/                # TypeScript types & DTOs
│   │   └── index.ts
│   └── validators/           # Zod validation schemas
│       └── create-report.schema.ts
├── agencies/
├── comments/
├── histories/
└── ...
```

#### `src/server/` - Server Utilities

```
server/
├── auth.ts                   # Better Auth configuration
├── base-repository.ts        # Abstract repository class (CRUD)
├── db.ts                     # Prisma client singleton
├── queue.ts                  # BullMQ queue setup
├── cache.ts                  # Redis cache setup
└── storage.ts                # S3 storage configuration
```

#### `src/lib/` - Shared Utilities

```
lib/
├── logger.ts                 # Pino logger configuration
└── utils.ts                  # Helper functions
```

## 🏗️ Architecture

### Design Principles

1. **Modular Monolith**: Single codebase, organized by feature modules
2. **Separation of Concerns**: Clear layers (API → Service → Repository → Database)
3. **Repository Pattern**: Abstract base class for common CRUD operations
4. **Type Safety**: Full TypeScript coverage with Zod validation
5. **Testability**: Business logic in services, easy to unit test

### Data Flow

```text
User Action → Next.js Page → API Route → Service → Repository → Database
              ↓
           [Optional: Queue Job → Worker → Notification]
```

### Core Services

#### Report Service Flow
1. **Create Report**: Validates input, generates report number, creates DB record, adds history, queues notifications
2. **Update Status**: Validates transition, updates report, creates history record, queues notification
3. **Assign Report**: Validates officer belongs to agency, assigns, updates status to ASSIGNED

For detailed architecture, see [DESIGN.md](./DESIGN.md).

## 🗄️ Database Schema

### Core Entities

- **User**: Citizens, officers, and admins with roles
- **Agency**: Government agencies responsible for resolving reports
- **Location**: Geographic location of reports
- **Report**: Public service issue report with status, category, priority
- **ReportComment**: Comments on reports
- **ReportHistory**: Status change history for reports
- **ReportAttachment**: File attachments for reports
- **Notification**: User notifications
- **AuditLog**: System audit trail

See [prisma/schema.prisma](./prisma/schema.prisma) for full schema.

## 🔐 Authentication & Authorization

- **Authentication**: Better Auth (email/password)
- **Authorization**: Role-Based Access Control (RBAC)
  - CITIZEN: Create and view own reports
  - OFFICER: Manage agency reports
  - SUPER_ADMIN: Full system access
- **Middleware**: Next.js middleware protects routes based on authentication and role

## 📡 API Reference

### Reports Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/reports` | List all reports |
| POST | `/api/v1/reports` | Create new report |
| GET | `/api/v1/reports/:id` | Get single report |
| PUT | `/api/v1/reports/:id` | Update report |
| PATCH | `/api/v1/reports/:id` | Patch status or assignment |
| DELETE | `/api/v1/reports/:id` | Delete report |

### Other Endpoints
- `/api/v1/agencies` - Agency management
- `/api/v1/comments` - Comment management
- `/api/v1/notifications` - Notifications
- `/api/v1/audit-logs` - Audit logs (admin only)

All endpoints return JSON with `{ data }` for success or `{ error }` for failures.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## 📱 Pages & Routes

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/` | Home page | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/dashboard` | User dashboard | ✅ |
| `/reports` | Reports list | ✅ |
| `/reports/new` | Create report | ✅ |
| `/reports/:id` | Report detail | ✅ |
| `/notifications` | Notifications | ✅ |
| `/settings` | Settings | ✅ |
| `/admin` | Admin panel | ✅ (Admin) |

## 🎨 Design System

CivicPulse uses a clean, modern design with:
- Blue primary color palette
- Clear status indicators with distinct colors
- Responsive mobile-first layout
- Accessible design following WCAG guidelines

Full design documentation in [DESIGN.md](./DESIGN.md).

## 🚀 Deployment

### Production Checklist
1. Set up PostgreSQL database (e.g., Railway, Supabase, AWS RDS)
2. Set up Redis instance (e.g., Upstash, Redis Labs)
3. Set up S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
4. Configure environment variables
5. Run database migrations
6. Build and deploy!

### Platform Recommendations
- **Vercel**: Excellent for Next.js
- **Railway/Supabase**: Easy PostgreSQL
- **Upstash**: Serverless Redis
- **Cloudflare R2**: S3-compatible storage

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Commit Message Format

Follow conventional commits:

```text
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code refactoring
- test: Testing
- chore: Build/tooling changes
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if present).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Auth by [Better Auth](https://better-auth.com/)
- ORM by [Prisma](https://www.prisma.io/)
- UI by [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For questions or issues, please open a GitHub issue or reach out!
