# CivicPulse - Gap Fix Execution Plan
Date Created: 2026-06-24
Based on: GAP_REPORT.md

## Overview
This execution plan addresses all 20 gaps identified in GAP_REPORT.md, organized by priority and dependency. The plan is divided into 5 phases, with critical security gaps addressed first.

---

## Phase 1: Fix Critical Security Gaps (Tier 1 - Critical)
**Priority**: CRITICAL
**Estimated Time**: 4-6 hours

### Gap 1.1: Create authz.ts with object-level authorization guards
**File**: `src/server/authz.ts` (new file)
**Actions**:
1. Create authorization utility module with role-based access control functions
2. Implement `canViewReport(actor, report)` - checks if citizen owns report or officer/admin has access
3. Implement `canEditReport(actor, report)` - checks if officer can edit assigned reports
4. Implement `canAssignReport(actor, agencyId)` - checks if officer belongs to agency
5. Implement `canDeleteReport(actor, report)` - checks if admin or owner
6. Export helper functions for use in services

### Gap 1.1: Add authz checks to all report services
**Files**: 
- `src/modules/reports/services/get-report.service.ts`
- `src/modules/reports/services/update-report-status.service.ts`
- `src/modules/reports/services/assign-report.service.ts`
- `src/modules/reports/services/delete-report.service.ts` (if exists)

**Actions**:
1. Import authz functions in each service
2. Add authorization check before database operations
3. Return 403 error if unauthorized
4. Update repository calls to include actor context for filtering

### Gap 1.4: Implement signed URLs for attachments with access control
**Files**:
- `src/server/storage.ts` (update)
- `src/modules/reports/services/get-report.service.ts` (update)
- `src/app/api/v1/attachments/[id]/route.ts` (new file)

**Actions**:
1. Add `getSignedAttachmentUrl(attachmentId, actor)` function to storage.ts
2. Add authorization check: verify actor can view the report
3. Generate presigned S3 URL with expiration (e.g., 15 minutes)
4. Create API endpoint for serving signed URLs
5. Update get-report service to return signed URLs instead of raw URLs
6. Remove raw fileUrl from API responses

---

## Phase 2: Fix High Priority Gaps (Tier 1 - High)
**Priority**: HIGH
**Estimated Time**: 3-4 hours

### Gap 1.2: Add deletedAt to ReportComment and ReportAttachment in schema
**File**: `prisma/schema.prisma`
**Actions**:
1. Add `deletedAt DateTime?` field to ReportComment model
2. Add `deletedAt DateTime?` field to ReportAttachment model
3. Run `npx prisma migrate dev --name add_soft_delete_to_comments_attachments`
4. Regenerate Prisma client: `npm run db:generate`

### Gap 1.2: Update BaseRepository to filter deleted records by default
**File**: `src/server/base-repository.ts`
**Actions**:
1. Add optional `includeDeleted: boolean = false` parameter to findById, findOne, findAll
2. Add `where: { deletedAt: null }` filter when `includeDeleted` is false
3. Ensure delete() method sets deletedAt instead of hard delete
4. Add restore() method to soft-deleted records if needed

### Gap 1.3: Implement rate limiting middleware for auth and report endpoints
**Files**:
- `src/server/rate-limiter.ts` (new file)
- `src/middleware.ts` (update)
- `src/app/api/v1/reports/route.ts` (update)

**Actions**:
1. Install rate limiting package: `npm install @upstash/ratelimit @upstash/redis`
2. Create rate limiter utility using Redis (or in-memory for dev)
3. Configure different limits:
   - Auth endpoints: 5 requests per minute per IP
   - Report creation: 10 per hour per user
   - General API: 100 per minute per user
4. Apply middleware to `/api/auth/*` routes
5. Apply middleware to POST `/api/v1/reports`
6. Return 429 status with Retry-After header on limit exceeded

### Gap 1.5: Set up test framework (Jest/Vitest) and add test script
**Files**:
- `package.json` (update)
- `vitest.config.ts` (new file)
- `src/modules/reports/services/__tests__/` (new directory)

**Actions**:
1. Install Vitest and testing utilities: `npm install -D vitest @testing-library/react @testing-library/jest-dom`
2. Create `vitest.config.ts` with Next.js/Vitest configuration
3. Add test script to package.json: `"test": "vitest", "test:ui": "vitest --ui"`
4. Create initial test file for critical services (get-report.service.test.ts)
5. Write tests for authorization checks
6. Write tests for soft delete filtering

---

## Phase 3: Fix Medium Priority Gaps (Tier 2 - Medium)
**Priority**: MEDIUM
**Estimated Time**: 3-4 hours

### Gap 2.1: Implement status transition state machine with validation
**Files**:
- `src/modules/reports/types/transitions.ts` (new file)
- `src/modules/reports/services/update-report-status.service.ts` (update)

**Actions**:
1. Define valid status transitions:
   - DRAFT → SUBMITTED
   - SUBMITTED → ASSIGNED
   - ASSIGNED → IN_PROGRESS
   - IN_PROGRESS → RESOLVED
   - RESOLVED → CLOSED
   - Any status can transition back to DRAFT (for admins)
2. Create `isValidTransition(from: Status, to: Status): boolean` function
3. Add validation in update-report-status service
4. Return 400 error for invalid transitions
5. Add unit tests for transition validation

### Gap 2.2: Fix report number generation to use atomic operation
**File**: `src/modules/reports/repositories/report.repository.ts`
**Actions**:
1. Replace count()+1 with database sequence or atomic increment
2. Option A: Use Prisma's `select` with raw SQL for atomic operation
3. Option B: Create a database sequence for report numbers
4. Option C: Use Redis transaction for unique number generation
5. Add migration for chosen approach
6. Test concurrent report creation for race conditions

### Gap 2.6: Create GitHub Actions CI pipeline
**Files**:
- `.github/workflows/ci.yml` (new file)

**Actions**:
1. Create CI workflow with:
   - Node.js setup
   - Dependency installation
   - Lint check (npm run lint)
   - Type check (tsc --noEmit)
   - Build check (npm run build)
   - Test run (npm test)
2. Add workflow trigger on push and pull request
3. Configure caching for node_modules
4. Add environment secrets for test database

---

## Phase 4: Fix Low Priority Gaps (Tier 2 - Low + Tier 3)
**Priority**: LOW
**Estimated Time**: 4-5 hours

### Gap 2.3: Add status/category filters with authz to pagination
**File**: `src/app/api/v1/reports/route.ts`
**Actions**:
1. Add query parameters: `status`, `category`, `agencyId`
2. Apply filters to repository query
3. Ensure filters respect authorization (citizens only see own reports)
4. Add validation for filter values
5. Update API documentation

### Gap 2.4: Add composite index for agencyId+status in schema
**File**: `prisma/schema.prisma`
**Actions**:
1. Add `@@index([agencyId, status])` to Report model
2. Create migration: `npx prisma migrate dev --name add_agency_status_index`
3. Test query performance with EXPLAIN ANALYZE

### Gap 2.5: Add polling or SSE for real-time updates or update docs
**Option A**: Implement polling (simpler)
**Files**: `src/app/reports/[id]/page.tsx`
**Actions**:
1. Add refetch interval (e.g., every 30 seconds) using TanStack Query
2. Show "last updated" timestamp
3. Add manual refresh button

**Option B**: Update docs (if real-time not needed)
**Files**: `README.md`
**Actions**:
1. Remove "real-time" claims from README
2. Clarify that updates require manual refresh

### Gap 3.1: Create shared components (Buttons, Badges, Cards)
**Files**:
- `src/components/ui/Button.tsx` (new)
- `src/components/ui/Badge.tsx` (new)
- `src/components/ui/Card.tsx` (new)
- `src/components/ui/StatusBadge.tsx` (new)

**Actions**:
1. Create reusable Button component with variants (primary, secondary, danger)
2. Create Badge component with color variants
3. Create Card component for consistent layout
4. Create StatusBadge component with icons for each status
5. Refactor existing pages to use shared components
6. Remove duplicated UI code

### Gap 3.2: Standardize error responses with code/fields structure
**Files**: All API route files
**Actions**:
1. Define error response structure:
   ```typescript
   {
     error: {
       code: string,
       message: string,
       fields?: Record<string, string>
     }
   }
   ```
2. Create error utility in `src/lib/errors.ts`
3. Update all API routes to use structured errors
4. Add error codes: UNAUTHORIZED, FORBIDDEN, VALIDATION_ERROR, NOT_FOUND, etc.

### Gap 3.3: Add PII/data retention policy section to DESIGN.md
**File**: `DESIGN.md`
**Actions**:
1. Add new section: "Data Privacy & Retention"
2. Document what PII is collected (name, email, location)
3. Specify retention periods (e.g., reports kept for 7 years)
4. Document data deletion process
5. Add compliance notes (GDPR, local regulations)

---

## Phase 5: Address Tier 0 Verification Gaps
**Priority**: MEDIUM
**Estimated Time**: 2-3 hours

### Tier 0: Add ARIA labels, screen-reader support, and accessibility checks
**Files**:
- `src/app/reports/[id]/page.tsx`
- `src/components/ui/StatusBadge.tsx` (after Gap 3.1)
- All interactive components

**Actions**:
1. Add ARIA labels to all buttons and interactive elements
2. Add icons to status/priority badges (not just color)
3. Add screen-reader-only text for visual indicators
4. Ensure keyboard navigation works for all features
5. Add accessibility testing to CI (eslint-plugin-jsx-a11y)
6. Install: `npm install -D eslint-plugin-jsx-a11y`
7. Run accessibility audit and fix issues

---

## Execution Order & Dependencies

### Critical Path (Must Complete First):
1. **Phase 1** (Critical Security) → Blocks production deployment
2. **Phase 2** (High Priority) → Important for data integrity and reliability
3. **Phase 5** (Accessibility) → Can run in parallel with Phase 2

### Secondary Path:
4. **Phase 3** (Medium Priority) → Improves robustness
5. **Phase 4** (Low Priority) → Nice-to-have improvements

### Parallel Execution Opportunities:
- Phase 5 (Accessibility) can run alongside Phase 2
- Gap 2.6 (CI Pipeline) can be set up independently
- Gap 3.1 (Shared Components) can be done in parallel with other low-priority tasks

---

## Testing Strategy

### After Each Phase:
1. Run existing application to verify no regressions
2. Test new features manually
3. Run automated tests (after Phase 2 completes)
4. Check CI pipeline (after Phase 3 completes)

### Security Testing:
- After Phase 1: Test IDOR protection (try accessing other users' reports)
- After Phase 1: Test attachment access control
- After Phase 2: Test rate limiting (send rapid requests)

---

## Rollback Plan

If any phase introduces issues:
1. Git commit before each phase
2. Revert to previous commit if critical bugs found
3. Document rollback in git commit message

---

## Success Criteria

### Phase 1 Complete:
- ✅ Cannot access reports without authorization
- ✅ Attachments require signed URLs
- ✅ Authorization checks in all services

### Phase 2 Complete:
- ✅ Soft delete works for all entities
- ✅ Rate limiting active on sensitive endpoints
- ✅ Test suite passes with >80% coverage

### Phase 3 Complete:
- ✅ Invalid status transitions rejected
- ✅ Report numbers are unique (no race conditions)
- ✅ CI pipeline runs successfully

### Phase 4 Complete:
- ✅ Pagination filters work correctly
- ✅ Database queries use indexes
- ✅ Shared components reduce code duplication
- ✅ Error responses are standardized

### Phase 5 Complete:
- ✅ All interactive elements have ARIA labels
- ✅ Status badges use icons + color
- ✅ Accessibility lint passes

---

## Notes
- Estimated total time: 16-22 hours
- Can be split across multiple days/sprints
- Critical gaps (Phase 1) should be completed before any production deployment
