## **ARCHITECTURE DECISION RECORD (ADR)** 

## **CivicPulse** 

Version: 1.0 

Status: Accepted 

## **ADR-001** 

## **Use Modular Monolith Instead of Microservices** 

Status 

Accepted 

Context 

Tim pengembang kecil. 

Produk masih MVP. 

Belum ada kebutuhan skalabilitas ekstrem. 

Decision 

Menggunakan Modular Monolith Architecture. 

Consequences 

Pros 

- Development lebih cepat 

- Deployment lebih sederhana 

- Maintenance lebih mudah 

- Cocok untuk MVP 

Cons 

- Perlu disiplin menjaga boundaries antar module 

1 

## **ADR-002** 

## **Use Next.js 16 Full Stack** 

Status 

Accepted Context 

Frontend dan backend membutuhkan integrasi cepat. 

Decision 

Menggunakan Next.js App Router sebagai Full Stack Framework. 

Consequences 

Pros 

- Single codebase • SSR dan SEO • Type sharing • Faster development 

Cons 

• Vendor lock terhadap ecosystem React 

## **ADR-003** 

## **Use PostgreSQL As Primary Database** 

Status 

Accepted 

Context 

Membutuhkan relasi kompleks. 

Decision 

PostgreSQL sebagai database utama. 

Consequences 

2 

Pros 

- Relational 

- ACID compliant 

- Analytics friendly 

- Mature ecosystem 

Cons 

- Lebih kompleks dibanding SQLite 

## **ADR-004** 

## **Use Prisma ORM** 

Status 

Accepted 

Decision 

Prisma sebagai ORM. 

Consequences 

Pros 

- Type-safe 

- Excellent DX 

- Migration support 

Cons 

- Query kompleks perlu optimization 

## **ADR-005** 

## **Use Better Auth** 

Status 

Accepted 

Decision 

Better Auth untuk authentication. 

3 

Consequences 

Pros 

- Session based • Modern 

- Next.js friendly 

Cons 

• Community lebih kecil dibanding NextAuth 

## **ADR-006** 

## **Use RBAC Authorization** 

Status 

Accepted 

Roles 

CITIZEN 

OFFICER 

SUPER_ADMIN 

Reason 

Mempermudah pengelolaan hak akses. 

## **ADR-007** 

## **Use Service Layer Pattern** 

Status 

Accepted 

Decision 

Business logic tidak boleh berada di route handler. 

Flow 

4 

Route 

↓ 

Service 

↓ 

Repository 

↓ 

Database 

Reason 

Maintainability. 

Testability. 

Scalability. 

## **ADR-008** 

## **Use Repository Pattern** 

Status 

Accepted 

Decision 

Semua query database harus melalui repository. 

Reason 

Memisahkan business logic dan data access. 

## **ADR-009** 

## **Use Redis For Cache** 

Status 

5 

Accepted 

Decision 

Redis digunakan untuk: 

- Dashboard cache 

- Analytics cache 

- Session optimization 

## **ADR-010** 

## **Use BullMQ For Background Jobs** 

Status 

Accepted 

Decision 

Semua asynchronous task diproses melalui queue. 

Examples 

- Email • Notifications • Analytics refresh 

## **ADR-011** 

## **Use S3 Compatible Storage** 

Status 

Accepted 

Decision 

Attachment tidak disimpan di database. 

Storage 

MinIO Local 

S3 Production 

6 

Reason 

Scalability. 

Cost efficiency. 

## **ADR-012** 

## **Use Audit Logging** 

Status 

Accepted 

Decision 

Seluruh aktivitas penting wajib dicatat. 

Examples 

- Login • Status Change • User Update • Agency Update 

## **ADR-013** 

## **Use Event Driven Internal Architecture** 

Status 

Accepted 

Examples 

ReportCreated 

↓ 

NotificationCreated 

## ↓ 

AnalyticsUpdated 

7 

Reason 

Future scalability. 

## **ADR-014** 

## **Use OpenTelemetry + Sentry** 

Status 

Accepted 

Decision 

Observability sejak awal. 

Metrics 

- Error Rate 

- Latency 

- Request Count 

- Database Performance 

## **ADR-015** 

## **Use Docker First Deployment** 

Status 

Accepted 

Decision 

Semua environment menggunakan Docker. 

Reason 

Environment consistency. 

Deployment portability. 

8 

