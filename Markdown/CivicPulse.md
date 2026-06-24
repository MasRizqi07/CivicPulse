## **CivicPulse** 

Version: 1.0  |  Database Engine: PostgreSQL 17+  |  ORM: Prisma ORM  |  Architecture: Relational Database 

## **SUMMARY** 

DATABASE DESIGN DOCUMENT (DDD) 

## **1. DATABASE DESIGN PRINCIPLES** 

Tujuan desain database: - Maintainable - Scalable - Auditable - Secure - Analytics Friendly 

Prinsip: - UUID Primary Keys - Soft Delete - Audit Trail - Referential Integrity - Optimized Indexing - Future MultiTenant Support 

## **2. CORE DOMAIN ENTITIES** 

Authentication Domain - User - Session 

Organization Domain - Agency Reporting Domain - Report - ReportAttachment - ReportComment - ReportHistory Communication Domain - Notification Monitoring Domain - AuditLog Location Domain - Location 

## **3. ENTITY RELATIONSHIP DIAGRAM (ERD)** 

Agency ├── Users └── Reports 

Report ├── Attachments ├── Comments ├── History └── Notifications User ├── Reports ├── Comments ├── Notifications └── AuditLogs Location └── Reports 

## **4. USER ENTITY** 

Purpose Menyimpan seluruh akun pengguna. 

Fields id UUID PK email VARCHAR UNIQUE password_hash VARCHAR full_name VARCHAR phone VARCHAR role ENUM agency_id UUID FK NULLABLE is_active BOOLEAN email_verified BOOLEAN created_at TIMESTAMP updated_at TIMESTAMP deleted_at TIMESTAMP NULL 

Indexes email role agency_id 

## **5. AGENCY ENTITY** 

Purpose Instansi pemerintah. 

Examples Dinas PU Dinas Kesehatan Dinas Pendidikan 

Fields id UUID PK name VARCHAR description TEXT email VARCHAR phone VARCHAR is_active BOOLEAN created_at TIMESTAMP updated_at TIMESTAMP 

Indexes name 

## **6. LOCATION ENTITY** 

Purpose Lokasi laporan. 

Fields id UUID PK latitude DECIMAL longitude DECIMAL address TEXT district VARCHAR city VARCHAR province VARCHAR postal_code VARCHAR created_at TIMESTAMP 

Indexes city district latitude longitude 

## **7. REPORT ENTITY** 

Purpose Data inti laporan masyarakat. 

Fields id UUID PK report_number VARCHAR UNIQUE title VARCHAR description TEXT category ENUM priority ENUM status ENUM citizen_id UUID FK agency_id UUID FK location_id UUID FK assigned_officer_id UUID FK NULL resolved_at TIMESTAMP NULL closed_at TIMESTAMP NULL created_at TIMESTAMP updated_at TIMESTAMP deleted_at TIMESTAMP NULL 

Indexes status priority agency_id citizen_id category created_at 

## **8. REPORTATTACHMENT ENTITY** 

Purpose Foto bukti laporan. 

Fields id UUID PK report_id UUID FK file_name VARCHAR file_url VARCHAR file_size BIGINT mime_type VARCHAR uploaded_by UUID FK created_at TIMESTAMP 

Indexes report_id 

## **9. REPORTCOMMENT ENTITY** 

Purpose Diskusi antara citizen dan officer. 

Fields id UUID PK report_id UUID FK user_id UUID FK message TEXT created_at TIMESTAMP updated_at TIMESTAMP 

Indexes report_id user_id 

## **10. REPORTHISTORY ENTITY** 

Purpose Audit perubahan status laporan. 

Fields id UUID PK report_id UUID FK actor_id UUID FK old_status ENUM new_status ENUM note TEXT created_at TIMESTAMP 

Indexes report_id actor_id created_at 

## **11. NOTIFICATION ENTITY** 

Purpose Notifikasi sistem. 

Fields id UUID PK user_id UUID FK title VARCHAR message TEXT type ENUM is_read BOOLEAN created_at TIMESTAMP 

Indexes user_id is_read 

## **12. AUDITLOG ENTITY** 

Purpose Audit seluruh aktivitas sistem. 

Fields id UUID PK actor_id UUID FK action VARCHAR resource_type VARCHAR resource_id UUID old_values JSONB new_values JSONB ip_address VARCHAR user_agent TEXT created_at TIMESTAMP 

Indexes actor_id resource_type created_at 

## **13. SESSION ENTITY** 

Purpose Session login pengguna. 

Fields id UUID PK user_id UUID FK token VARCHAR expires_at TIMESTAMP created_at TIMESTAMP Indexes user_id expires_at 

## **14. ENUM DEFINITIONS** 

Role CITIZEN OFFICER SUPER_ADMIN 

ReportStatus DRAFT SUBMITTED ASSIGNED IN_PROGRESS RESOLVED CLOSED REJECTED Priority LOW MEDIUM HIGH CRITICAL 

ReportCategory INFRASTRUCTURE HEALTH EDUCATION SANITATION TRANSPORTATION OTHER NotificationType INFO SUCCESS WARNING ERROR 

## **15. DATABASE CONSTRAINTS** 

Unique users.email reports.report_number 

Foreign Key reports.citizen_id reports.agency_id reports.location_id comments.user_id attachments.report_id notifications.user_id 

## **16. SOFT DELETE STRATEGY** 

Entities Users Reports Agencies Fields deleted_at 

Purpose Data recovery Audit compliance Historical analytics 

## **17. ANALYTICS READY TABLES** 

Reports ReportHistory AuditLogs Notifications 

These tables support: Resolution Rate Response Time Officer Performance Agency Performance Monthly Trends Category Distribution 

## **18. SCALING CONSIDERATIONS** 

Current Target 10,000 Users 100,000 Reports 

Future Target 1,000,000+ Reports 

Optimizations Indexes Query Optimization Read Replicas Redis Caching Partitioning 

## **19. BACKUP STRATEGY** 

Daily Backup Weekly Snapshot Monthly Archive Retention 30 Days 

## **20. SECURITY CONSIDERATIONS** 

Passwords Argon2 Sensitive Logs Encrypted Audit Logs Immutable Session Expiration Enabled 

