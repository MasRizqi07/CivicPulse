## **Production Grade Prisma Schema (V1)** 

Struktur berikut yang saya rekomendasikan sebagai fondasi implementasi: 

enum Role { 

CITIZEN 

OFFICER 

SUPER_ADMIN 

} 

enum ReportStatus { 

DRAFT 

SUBMITTED 

ASSIGNED 

IN_PROGRESS 

RESOLVED 

CLOSED 

REJECTED 

} 

enum Priority { 

LOW 

MEDIUM 

HIGH 

CRITICAL 

} 

enum ReportCategory { 

INFRASTRUCTURE 

HEALTH 

EDUCATION 

SANITATION 

TRANSPORTATION 

OTHER 

} 

model User { 

id              String   @id @default(uuid()) email           String   @unique 

passwordHash    String 

fullName        String phone           String? role            Role 

agencyId        String? agency          Agency?  @relation(fields: [agencyId], references: [id]) 

reports         Report[] @relation("CitizenReports") 

assignedReports Report[] @relation("AssignedReports") 

comments        ReportComment[] notifications   Notification[] 

auditLogs       AuditLog[] 

isActive        Boolean @default(true) 

emailVerified   Boolean @default(false) 

createdAt       DateTime @default(now()) 

updatedAt       DateTime @updatedAt 

deletedAt       DateTime? 

@@index([role]) 

@@index([agencyId]) 

} 

model Agency { 

id          String @id @default(uuid()) 

name        String 

description String? 

email       String? phone       String? 

users       User[] reports     Report[] 

isActive    Boolean @default(true) 

createdAt   DateTime @default(now()) updatedAt   DateTime @updatedAt 

} 

model Location { 

id          String @id @default(uuid()) 

latitude    Decimal longitude   Decimal 

address     String district    String 

city        String 

province    String 

postalCode  String? 

reports     Report[] 

createdAt   DateTime @default(now()) 

} 

model Report { 

id                String @id @default(uuid()) 

reportNumber      String @unique 

title             String 

description       String 

category          ReportCategory priority          Priority @default(MEDIUM) 

status            ReportStatus @default(SUBMITTED) 

citizenId         String 

citizen           User @relation( "CitizenReports", fields: [citizenId], references: [id] ) 

agencyId          String agency            Agency @relation( fields: [agencyId], references: [id] ) 

locationId        String location          Location @relation( fields: [locationId], references: [id] ) 

assignedOfficerId String? assignedOfficer   User? @relation( "AssignedReports", fields: [assignedOfficerId], references: [id] ) 

attachments       ReportAttachment[] comments          ReportComment[] histories         ReportHistory[] 

resolvedAt        DateTime? closedAt          DateTime? 

createdAt         DateTime @default(now()) updatedAt         DateTime @updatedAt deletedAt         DateTime? 

@@index([status]) 

@@index([agencyId]) @@index([citizenId]) 

@@index([category]) 

} 

model ReportAttachment { 

id          String @id @default(uuid()) 

reportId    String 

report      Report @relation( 

fields: [reportId], 

references: [id] ) 

fileName    String fileUrl     String 

fileSize    BigInt 

mimeType    String 

uploadedBy  String 

createdAt   DateTime @default(now()) 

} 

model ReportComment { 

id          String @id @default(uuid()) 

reportId    String report      Report @relation( fields: [reportId], references: [id] ) 

userId      String user        User @relation( fields: [userId], references: [id] ) 

message     String 

createdAt   DateTime @default(now()) 

updatedAt   DateTime @updatedAt 

} 

model ReportHistory { 

id          String @id @default(uuid()) 

reportId    String report      Report @relation( fields: [reportId], references: [id] ) 

actorId     String actor       User @relation( fields: [actorId], references: [id] ) 

oldStatus   ReportStatus? newStatus   ReportStatus 

note        String? 

createdAt   DateTime @default(now()) } 

model Notification { 

id          String @id @default(uuid()) 

userId      String 

user        User @relation( fields: [userId], references: [id] 

) 

title       String 

message     String 

isRead      Boolean @default(false) 

createdAt   DateTime @default(now()) 

} 

model AuditLog { 

id            String @id @default(uuid()) 

actorId       String 

actor         User @relation( 

fields: [actorId], 

references: [id] 

) 

action        String 

resourceType  String 

resourceId    String 

oldValues     Json? newValues     Json? 

ipAddress     String? 

userAgent     String? 

createdAt     DateTime @default(now()) 

} 

## **ENTERPRISE-GRADE NEXT.JS 16 FOLDER STRUCTURE** 

Ini adalah struktur yang saya rekomendasikan untuk production. 

src/ 

│ 

`├` ── app/ 

│   │ 

│ `├` ── (public)/ 

│   │ `├` ── page.tsx 

│   │ `├` ── reports/ 

│   │   └── about/ 

│   │ 

│ `├` ── (auth)/ 

│   │ `├` ── login/ 

│   │ `├` ── register/ 

│   │   └── forgot-password/ 

│   │ 

│ `├` ── (citizen)/ 

│   │ `├` ── dashboard/ 

│   │ `├` ── reports/ 

│   │ `├` ── notifications/ 

│   │   └── profile/ 

│   │ 

│ `├` ── (officer)/ 

│   │ `├` ── dashboard/ 

│   │ `├` ── reports/ 

│   │ `├` ── analytics/ 

│   │   └── profile/ 

│   │ 

│ `├` ── (admin)/ 

│   │ `├` ── dashboard/ 

│   │ `├` ── agencies/ 

│   │ `├` ── users/ 

│   │ `├` ── audit-logs/ 

│   │   └── settings/ 

│   │ 

│   └── api/ 

│       └── v1/ 

│ 

`├` ── modules/ 

│ 

│ `├` ── auth/ 

│   │ `├` ── components/ 

│   │ `├` ── services/ 

│   │ `├` ── repositories/ 

│   │ `├` ── validators/ 

│   │ `├` ── hooks/ 

│   │ `├` ── types/ 

│   │   └── api/ 

│ 

│ `├` ── users/ 

│   │ 

│ `├` ── agencies/ 

│   │ 

│ `├` ── reports/ 

│   │ 

│ `├` ── attachments/ 

│   │ 

│ `├` ── comments/ 

│   │ 

│ `├` ── notifications/ 

│   │ 

│ `├` ── analytics/ 

│   │ 

│ `├` ── audit-logs/ 

│   │ 

│   └── dashboard/ 

│ 

`├` ── components/ 

│ 

│ `├` ── ui/ 

│   │ 

│ `├` ── forms/ 

│   │ 

│ `├` ── tables/ 

│   │ 

│ `├` ── charts/ 

│   │ 

│ `├` ── maps/ 

│   │ 

│   └── layouts/ 

│ 

`├` ── server/ 

│ 

│ `├` ── auth/ 

│   │ 

│ `├` ── db/ 

│   │ 

│ `├` ── cache/ 

│   │ 

│ `├` ── queue/ 

│   │ 

│ `├` ── storage/ 

│   │ 

│ `├` ── telemetry/ 

│   │ 

│   └── permissions/ 

│ 

`├` ── lib/ 

│ 

│ `├` ── constants/ 

│   │ 

│ `├` ── env/ 

│   │ 

│ `├` ── logger/ 

│   │ 

│ `├` ── utils/ 

│   │ 

│   └── validators/ 

│ 

`├` ── providers/ 

│ 

│ `├` ── query-provider.tsx 

│ `├` ── theme-provider.tsx 

│   └── auth-provider.tsx 

│ 

`├` ── prisma/ 

│   │ 

│ `├` ── schema.prisma 

│ `├` ── migrations/ 

│   └── seed.ts 

│ 

`├` ── tests/ 

│   │ 

│ `├` ── unit/ 

│ `├` ── integration/ 

│   └── e2e/ 

│ 

`├` ── types/ 

│ 

`├` ── middleware.ts 

│ 

└── instrumentation.ts 

## **Struktur Enterprise Internal Module** 

Contoh untuk module reports. 

modules/ └── reports/ │ `├` ── components/ │ `├` ── services/ 

│ `├` ── create-report.service.ts │ `├` ── assign-report.service.ts │ `├` ── update-status.service.ts │   └── resolve-report.service.ts │ `├` ── repositories/ 

│   └── report.repository.ts │ `├` ── validators/ │ `├` ── create-report.schema.ts │   └── update-report.schema.ts │ `├` ── types/ │ `├` ── hooks/ │ 

`├` ── api/ 

│ 

└── constants/ 

