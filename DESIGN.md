# CivicPulse Design System & Architecture

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Visual Design System](#visual-design-system)
   - [Color Palette](#color-palette)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Components](#components)
3. [UI/UX Patterns](#uiux-patterns)
4. [Architecture](#architecture)
   - [System Architecture](#system-architecture)
   - [Folder Structure](#folder-structure)
5. [Database Architecture](#database-architecture)
6. [API Design](#api-design)
7. [Authentication & Authorization](#authentication--authorization)
8. [Development Guidelines](#development-guidelines)

---

## Design Philosophy

CivicPulse follows a **human-centered design** approach with these core principles:

- **Accessibility First**: WCAG 2.2 AA compliant design
- **Clarity Over Complexity**: Simple, intuitive interfaces
- **Consistency**: Uniform patterns across all pages
- **Responsiveness**: Mobile-first, device-agnostic design
- **Trust & Transparency**: Clear status indicators and feedback

---

## Visual Design System

### Color Palette

#### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary Blue | `#2563EB` | Buttons, links, active states |
| Primary Dark | `#1D4ED8` | Hover states |
| Primary Light | `#DBEAFE` | Background accents |

#### Status Colors
| Status | Color | Hex |
|--------|-------|-----|
| Draft | Gray | `#9CA3AF` |
| Submitted | Blue | `#3B82F6` |
| Assigned | Yellow | `#F59E0B` |
| In Progress | Orange | `#F97316` |
| Resolved | Green | `#10B981` |
| Closed | Emerald | `#059669` |
| Rejected | Red | `#EF4444` |

#### Priority Colors
| Priority | Color | Hex |
|----------|-------|-----|
| Low | Green | `#10B981` |
| Medium | Yellow | `#F59E0B` |
| High | Orange | `#F97316` |
| Critical | Red | `#EF4444` |

#### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Backgrounds |
| Gray 50 | `#F9FAFB` | Light backgrounds |
| Gray 100 | `#F3F4F6` | Dividers |
| Gray 200 | `#E5E7EB` | Borders |
| Gray 300 | `#D1D5DB` | Inactive text |
| Gray 500 | `#6B7280` | Secondary text |
| Gray 700 | `#374151` | Primary text |
| Gray 900 | `#111827` | Headings |

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

#### Type Scale
| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| text-4xl | 2.25rem | Bold | Page headings |
| text-3xl | 1.875rem | Bold | Section headings |
| text-2xl | 1.5rem | Semi-bold | Sub-headings |
| text-xl | 1.25rem | Semi-bold | Card titles |
| text-lg | 1.125rem | Normal | Body text (large) |
| text-base | 1rem | Normal | Body text |
| text-sm | 0.875rem | Normal | Secondary text |
| text-xs | 0.75rem | Normal | Labels, metadata |

### Spacing

| Class | Size | Usage |
|-------|------|-------|
| p-2/py-2/px-2 | 0.5rem | Small padding |
| p-4/py-4/px-4 | 1rem | Standard padding |
| p-6/py-6/px-6 | 1.5rem | Card padding |
| p-8/py-8/px-8 | 2rem | Section padding |
| gap-4 | 1rem | Small gaps |
| gap-6 | 1.5rem | Standard gaps |
| gap-8 | 2rem | Section gaps |

### Components

#### Buttons
| Variant | Classes | Usage |
|---------|---------|-------|
| Primary | `bg-blue-600 text-white hover:bg-blue-700` | Main actions |
| Secondary | `border border-gray-300 text-gray-700 hover:bg-gray-50` | Cancel, back |
| Danger | `bg-red-600 text-white hover:bg-red-700` | Delete actions |
| Disabled | `opacity-50 cursor-not-allowed` | Inactive state |

#### Cards
```tsx
<div className="bg-white rounded-xl shadow-sm p-6">
  {/* Card content */}
</div>
```

#### Inputs
```tsx
<input
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
```

#### Badges
```tsx
<span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
  Status
</span>
```

---

## UI/UX Patterns

### Navigation
- **Mobile**: Collapsible sidebar + bottom nav (future)
- **Desktop**: Fixed left sidebar navigation
- **Active state**: Blue background + bold text + icon

### Forms
- Labels always visible above inputs
- Required fields clearly indicated
- Error messages below fields in red
- Success/loading feedback

### Data Display
- Lists with clear separation
- Tables for tabular data
- Timeline for status history
- Statistics grids with icons

### Feedback
- Loading states (skeletons, spinners)
- Success/error toast notifications
- Confirmation dialogs for destructive actions

---

## Architecture

### System Architecture

CivicPulse uses a **modular monolith** architecture with clear separation of concerns:

```
┌───────────────────────────────────────────────────┐
│                   Frontend (React)                 │
│  ┌──────────────┐  ┌───────────────────────────┐  │
│  │    Pages     │  │     Components (Future)   │  │
│  └──────────────┘  └───────────────────────────┘  │
└───────────────────────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────┐
│                 Next.js App Router                │
│  ┌─────────────────────────────────────────────┐ │
│  │         API Routes (/api/v1/*)              │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Services   │  │ Repositories │  │   Storage    │
│  (Business)  │  │   (Data)     │  │    (S3)     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │
        └────────┬────────┘
                 ▼
        ┌──────────────────┐
        │   Prisma ORM     │
        └──────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │
│   (Database) │  │    (Queue)   │
└──────────────┘  └──────────────┘
```

### Folder Structure

```
CivicPulse/
├── prisma/                           # Database layer
│   ├── schema.prisma                 # Prisma schema
│   └── seed.ts                       # Database seed script
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # Better Auth endpoints
│   │   │   └── v1/                   # API v1 endpoints
│   │   │       ├── agencies/
│   │   │       ├── comments/
│   │   │       ├── reports/
│   │   │       └── ...
│   │   ├── dashboard/                # Dashboard pages
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Register page
│   │   ├── reports/                  # Report pages
│   │   └── ...
│   ├── modules/                      # Feature modules (DDD-style)
│   │   ├── agencies/
│   │   │   ├── repositories/         # Data access
│   │   │   ├── services/             # Business logic
│   │   │   ├── types/                # Type definitions
│   │   │   └── validators/           # Zod schemas
│   │   ├── reports/
│   │   ├── comments/
│   │   ├── histories/
│   │   └── ...
│   ├── server/                       # Server utilities
│   │   ├── auth.ts                   # Better Auth config
│   │   ├── base-repository.ts        # Abstract repository class
│   │   ├── db.ts                     # Prisma client
│   │   ├── queue.ts                  # BullMQ queue config
│   │   ├── cache.ts                  # Redis cache config
│   │   └── storage.ts                # S3 storage config
│   ├── lib/                          # Shared utilities
│   │   ├── logger.ts                 # Pino logger
│   │   └── utils.ts                  # Helper functions
│   └── middleware.ts                 # Next.js middleware
├── .env.example                      # Environment variables template
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json
```

### Module Architecture

Each feature module follows a consistent structure:
```
module-name/
├── repositories/
│   └── entity.repository.ts          # Extends BaseRepository
├── services/
│   ├── create-entity.service.ts
│   ├── get-entity.service.ts
│   └── update-entity.service.ts
├── types/
│   └── index.ts                      # DTOs and interfaces
└── validators/
    └── create-entity.schema.ts       # Zod validation
```

---

## Database Architecture

### ER Diagram (Conceptual)

```
User (CITIZEN/OFFICER/SUPER_ADMIN)
  ├── Reports (as citizen)
  ├── Reports (as assigned officer)
  ├── Comments
  ├── Notifications
  ├── Histories
  └── Audit Logs

Agency
  ├── Users
  └── Reports

Location
  └── Reports

Report
  ├── Attachments
  ├── Comments
  └── Histories
```

### Key Models

#### User
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  fullName     String
  role         Role     @default(CITIZEN)
  agencyId     String?
  reports      Report[] @relation("CitizenReports")
  assignedReports Report[] @relation("AssignedReports")
  // ...
}
```

#### Report
```prisma
model Report {
  id              String            @id @default(uuid())
  reportNumber    String            @unique
  title           String
  description     String
  category        ReportCategory
  priority        Priority          @default(MEDIUM)
  status          ReportStatus      @default(SUBMITTED)
  citizenId       String
  agencyId        String
  locationId      String
  assignedOfficerId String?
  // ...
}
```

#### ReportHistory
```prisma
model ReportHistory {
  id        String         @id @default(uuid())
  reportId  String
  actorId   String
  oldStatus ReportStatus?
  newStatus ReportStatus
  note      String?
  createdAt DateTime       @default(now())
}
```

### Indexing Strategy
- `User.role` - For role-based queries
- `User.agencyId` - For agency user lookups
- `Report.status` - For status filtering
- `Report.agencyId` - For agency reports
- `Report.citizenId` - For citizen reports
- `Report.category` - For category filtering

---

## API Design

### RESTful Endpoints

All API endpoints follow this pattern: `/api/v1/{resource}`

#### Reports
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/reports` | List reports | ✅ |
| POST | `/api/v1/reports` | Create report | ✅ |
| GET | `/api/v1/reports/[id]` | Get report | ✅ |
| PUT | `/api/v1/reports/[id]` | Update report | ✅ |
| PATCH | `/api/v1/reports/[id]` | Patch (status/assign) | ✅ |
| DELETE | `/api/v1/reports/[id]` | Delete report | ✅ |

#### Other Resources
- `/api/v1/agencies` - Agency management
- `/api/v1/comments` - Comment management
- `/api/v1/notifications` - Notification management
- `/api/v1/audit-logs` - Audit log access (admin)

### Response Format

#### Success
```json
{
  "data": { /* resource data */ }
}
```

#### Error
```json
{
  "error": "Error message here"
}
```

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Authentication & Authorization

### Authentication
- **Provider**: Better Auth
- **Methods**: Email/Password
- **Session Management**: HTTP-only cookies
- **Password Hashing**: bcrypt (via Better Auth)

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| CITIZEN | Create reports, view own reports, add comments |
| OFFICER | View agency reports, update status, assign self, comment |
| SUPER_ADMIN | Full access to all features, manage users/agencies |

### Middleware
Next.js middleware (`src/middleware.ts`) protects routes based on authentication and roles.

---

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (via Next.js ESLint config)
- **Linting**: ESLint with Next.js config

### Git Commits
Follow conventional commits:
```
<type>(<scope>): <description>

Examples:
feat(auth): add password reset
fix(reports): resolve status update bug
docs(readme): update setup guide
```

### Testing (Future)
- **Unit Tests**: Vitest for services and utilities
- **Integration Tests**: Playwright for API and E2E
- **E2E Tests**: Playwright for critical flows

### Performance
- Image optimization with Next.js Image
- Route-based code splitting
- Redis caching for frequent queries
- Database query optimization

### Security
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection via React's escaping
- Rate limiting (future)
- CORS configuration
