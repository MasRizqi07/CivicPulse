# CivicPulse - Gap Report
Date of Audit: 2026-06-24

## Executive Summary
This report identifies gaps between the claims in README.md/DESIGN.md and the actual implementation in the CivicPulse codebase.

---

## Tier 0 - Verification Pass Results

### 1. Object-Level Authorization (IDOR Protection)
**Claim**: Implicit in docs (authorization checks)
**Actual**: 
- ❌ No authorization checks at the service/repository layer for report ownership/agency scope
- ❌ `getReportService` (src/modules/reports/services/get-report.service.ts) returns any report by ID without checking actor
- ❌ `updateReportStatusService`, `assignReportService` do not check if actor has access
- ❌ `reportRepository.findAll` doesn't filter by citizen/agency by default
- ❌ `base-repository.ts` doesn't include soft delete filters by default for findAll/findById

**File References**:
- src/modules/reports/services/get-report.service.ts:4-24
- src/modules/reports/services/update-report-status.service.ts:8-68
- src/modules/reports/services/assign-report.service.ts:7-65
- src/server/base-repository.ts:14-68

### 2. Soft Delete Implementation
**Claim**: Implied from deletedAt field in schema
**Actual**:
- ✅ Prisma schema has `deletedAt` on Report, User
- ❌ ReportComment and ReportAttachment DO NOT have deletedAt fields (schema.prisma:139-148)
- ✅ BaseRepository.delete() sets deletedAt instead of hard deleting
- ❌ BaseRepository methods (findById, findOne, findAll) DO NOT filter out deleted records by default

**File References**:
- prisma/schema.prisma:139-148
- src/server/base-repository.ts:14-68

### 3. Tests
**Claim**: README mentions "Testability" as design principle
**Actual**:
- ❌ NO test files exist in repo
- ❌ No test script in package.json

**File References**:
- package.json:6-15

### 4. Rate Limiting
**Claim**: Marked "TODO/future" in docs
**Actual**:
- ❌ No rate limiting on any endpoints
- ❌ No rate limiting on auth endpoints (/api/auth/*) or report creation (/api/v1/reports POST)

### 5. Attachment URLs & Access Control
**Claim**: N/A (no explicit claim, but critical for security)
**Actual**:
- ✅ storage.ts has getPresignedUrl() method, but it's not used
- ❌ ReportAttachment.fileUrl stores raw S3/MinIO URL (public)
- ❌ No access control check before serving attachments
- ❌ No mechanism to generate signed URLs for attachments

**File References**:
- src/server/storage.ts:17-51
- prisma/schema.prisma:127-137
- src/modules/reports/services/create-report.service.ts:53-64

### 6. WCAG 2.2 AA Compliance & Accessibility
**Claim**: DESIGN.md claims "WCAG 2.2 AA compliant"
**Actual**:
- ❌ No automated accessibility checks
- ❌ Status/priority badges use color alone (no icons/screen-reader labels)
- ❌ No ARIA labels on interactive elements
- ❌ No keyboard navigation testing

**File References**:
- src/app/reports/[id]/page.tsx:84-127
- DESIGN.md:6-10

---

## Tier 1 - Critical Gaps (Security & Data Integrity)

### Gap 1.1: Missing Object-Level Authorization Guards
**Severity**: CRITICAL
**Files**:
- src/server/authz.ts: ❌ Does not exist
- src/modules/reports/services/*: All services missing authz checks
- src/modules/comments/services/*: ❌
- src/modules/attachments/services/*: ❌

### Gap 1.2: Missing Soft Delete for ReportComment/ReportAttachment
**Severity**: HIGH
**Files**:
- prisma/schema.prisma:139-148 (ReportComment missing deletedAt)
- prisma/schema.prisma:127-137 (ReportAttachment missing deletedAt)

### Gap 1.3: Missing Rate Limiting
**Severity**: HIGH
**Files**:
- ❌ No rate limiter middleware
- ❌ src/app/api/v1/reports/route.ts (POST)
- ❌ src/app/api/auth/[...slug]/route.ts

### Gap 1.4: Missing Attachment Access Control & Signed URLs
**Severity**: CRITICAL
**Files**:
- src/server/storage.ts: Missing getSignedAttachmentUrl() with authz check
- src/modules/reports/services/get-report.service.ts: Attaching raw fileUrl without checking access

### Gap 1.5: No Tests
**Severity**: HIGH
**Files**:
- package.json: No test script
- No test directory or files

---

## Tier 2 - Important Gaps

### Gap 2.1: Missing Status Transition State Machine
**Severity**: MEDIUM
**Files**:
- ❌ src/modules/reports/types/transitions.ts: Does not exist
- src/modules/reports/services/update-report-status.service.ts: No transition validation

### Gap 2.2: Report Number Generation is Race Condition Prone
**Severity**: MEDIUM
**Files**:
- src/modules/reports/repositories/report.repository.ts:47-60
- Uses count()+1 which is not atomic

### Gap 2.3: Pagination & Filtering Partially Implemented
**Severity**: LOW
**Files**:
- src/app/api/v1/reports/route.ts: Has page/limit but no status/category filters applied with authz

### Gap 2.4: No Composite Index for Agency+Status Query
**Severity**: LOW
**Files**:
- prisma/schema.prisma: Missing @@index([agencyId, status])

### Gap 2.5: "Real-Time" Claim is False (Just Refresh-on-Load)
**Severity**: LOW
**Files**:
- README.md: Claims real-time but no SSE/WebSocket/long polling
- src/app/reports/[id]/page.tsx: No refetch interval

### Gap 2.6: No CI Pipeline
**Severity**: MEDIUM
**Files**:
- ❌ No .github/workflows directory
- ❌ No CI config

---

## Tier 3 - Minor Gaps

### Gap 3.1: No Shared Components (Buttons, Badges, Cards)
**Files**:
- ❌ src/components/ directory does not exist
- Repeated UI code in every page

### Gap 3.2: Unstructured Error Responses
**Files**:
- API routes return { error: "string" } instead of structured errors with code/fields

### Gap 3.3: No PII/Data Retention Policy in Docs
**Files**:
- DESIGN.md: Missing section on data retention/PII

---

## Summary Table
| Tier | Gaps Found | Critical | High | Medium | Low |
|------|------------|----------|------|--------|-----|
| 0    | 6          | 2        | 2    | 1      | 1   |
| 1    | 5          | 2        | 3    | 0      | 0   |
| 2    | 6          | 0        | 1    | 3      | 2   |
| 3    | 3          | 0        | 0    | 0      | 3   |
