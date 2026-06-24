## **PRODUCT REQUIREMENTS DOCUMENT (PRD)** 

## **CivicPulse** 

## **Public Service Workflow Platform** 

Version: 1.0 

Status: Draft 

Owner: Product Team 

Prepared By: Rizqi 

## **1. Executive Summary** 

CivicPulse adalah platform digital berbasis web yang memungkinkan masyarakat melaporkan permasalahan fasilitas publik serta memungkinkan instansi pemerintah memproses, memantau, dan menyelesaikan laporan tersebut secara transparan, terstruktur, dan terukur. 

Berbeda dengan aplikasi pelaporan konvensional, CivicPulse dirancang sebagai Public Service Workflow Platform yang mengelola siklus hidup laporan dari pelaporan hingga penyelesaian melalui workflow operasional yang terdokumentasi, dashboard analitik, audit trail, dan sistem notifikasi. 

## **2. Problem Statement** 

Banyak pemerintah daerah menghadapi masalah: 

- Laporan masyarakat tersebar di berbagai kanal. 

- Tidak ada standar proses penanganan. 

- Sulit melacak progres laporan. 

- Kurangnya transparansi terhadap masyarakat. 

- Sulit mengukur performa instansi. 

- Data laporan tidak terpusat. 

Akibatnya: 

- Respons lambat. 

- Kepercayaan publik menurun. • Sulit melakukan evaluasi kinerja. 

1 

## **3. Product Vision** 

Menjadi platform pelaporan dan manajemen layanan publik yang transparan, terukur, dan mudah digunakan oleh masyarakat maupun instansi pemerintah. 

## **4. Business Goals** 

## **Short-Term** 

- Digitalisasi proses pelaporan masyarakat. 

- Mempermudah proses tindak lanjut laporan. 

- Menyediakan dashboard monitoring realtime. 

## **Mid-Term** 

- Menjadi platform standar pelaporan pemerintah daerah. 

- Mengurangi waktu respons laporan. 

## **Long-Term** 

- Menjadi ekosistem Smart City Service Management Platform. 

## **5. Product Goals** 

- Mempermudah masyarakat membuat laporan. 

- Mempercepat penanganan laporan. 

- Menyediakan transparansi proses. 

- Menyediakan data analitik untuk pengambilan keputusan. 

## **6. User Personas** 

## **Citizen** 

Karakteristik: 

- Masyarakat umum 

- Pengguna smartphone 

- Tidak memiliki pengetahuan teknis 

Tujuan: 

- Melaporkan masalah 

- Memantau status laporan 

2 

Pain Point: 

- Tidak tahu progres laporan 

- Tidak tahu instansi yang menangani 

## **Government Officer** 

Karakteristik: 

- Pegawai instansi pemerintah 

- Mengelola laporan masyarakat 

Tujuan: 

- Memproses laporan 

- Memberikan tindak lanjut 

Pain Point: 

- Laporan tidak terorganisir 

- Sulit memonitor workload 

## **Super Admin** 

Karakteristik: 

- Administrator sistem 

Tujuan: 

- Mengelola instansi 

- Mengelola user 

- Mengawasi performa sistem 

## **7. Success Metrics** 

## **Business KPI** 

- Total laporan per bulan 

- Tingkat penyelesaian laporan 

- Average Response Time 

- Average Resolution Time 

## **Product KPI** 

- Daily Active Users 

3 

- Monthly Active Users 

- Report Completion Rate 

- Dashboard Engagement Rate 

## **Operational KPI** 

- SLA Compliance 

- Escalated Reports 

- Open Reports 

- Closed Reports 

## **8. User Journey** 

Citizen Login 

↓ 

Create Report 

↓ 

Report Submitted 

↓ 

Assigned To Agency 

↓ 

In Progress 

↓ 

Resolved 

↓ 

Closed 

↓ 

Citizen Satisfaction 

4 

## **9. Core Features** 

## **Citizen Features** 

## **Authentication** 

- Register 

- Login 

- Logout 

- Reset Password 

## **Report Management** 

- Create Report 

- Upload Evidence 

- View Report History 

- Track Status 

## **Dashboard** 

- Personal Reports • Report Statistics • Notifications 

## **Officer Features** 

## **Dashboard** 

- Assigned Reports • Pending Reports 

- Urgent Reports 

## **Report Processing** 

- Update Status • Add Notes 

- Upload Resolution Evidence 

## **Export** 

- CSV Export 

- PDF Export 

## **Super Admin Features** 

## **User Management** 

- Create User 

5 

- Disable User 

- Assign Role 

## **Agency Management** 

- Create Agency 

- Edit Agency 

- Delete Agency 

## **System Monitoring** 

- Activity Monitoring 

- Audit Log Monitoring 

## **10. Workflow Management** 

## **Report Lifecycle** 

DRAFT 

↓ 

SUBMITTED 

↓ 

ASSIGNED 

↓ 

IN_PROGRESS 

↓ 

RESOLVED 

↓ 

CLOSED 

## **Status Definitions** 

SUBMITTED 

Laporan berhasil dibuat. 

6 

ASSIGNED 

Laporan telah diteruskan ke instansi terkait. 

IN_PROGRESS 

Instansi sedang menangani. 

RESOLVED 

Masalah telah diperbaiki. 

CLOSED 

Laporan selesai diverifikasi. 

## **11. Functional Requirements** 

## **FR-001** 

Citizen dapat membuat laporan. 

## **FR-002** 

Citizen dapat mengunggah foto. 

## **FR-003** 

Citizen dapat melihat riwayat laporan. 

## **FR-004** 

Officer dapat mengubah status laporan. 

## **FR-005** 

Officer dapat memberikan tanggapan. 

## **FR-006** 

Officer dapat mengunggah bukti penyelesaian. 

## **FR-007** 

System mengirim notifikasi saat status berubah. 

7 

## **FR-008** 

System mencatat seluruh aktivitas pengguna. 

## **FR-009** 

System menghasilkan dashboard analitik. 

## **FR-010** 

Admin dapat mengelola instansi. 

## **12. Non Functional Requirements** 

## **Security** 

- JWT Authentication 

- Role Based Access Control 

- Session Validation 

- CSRF Protection 

- Rate Limiting 

## **Performance** 

- First Load < 3 Seconds 

- API Response < 500ms 

## **Scalability** 

- 100.000+ Reports 

- 10.000+ Users 

## **Availability** 

- 99.9% Uptime 

## **13. RBAC Design** 

Citizen 

Permissions: 

- Create Report 

- View Own Report 

8 

Officer 

Permissions: 

- View Assigned Reports 

- Update Status 

- Add Resolution 

Super Admin 

Permissions: 

- Full Access 

## **14. Database Design** 

Core Tables 

Users 

Agencies 

Reports 

ReportAttachments 

ReportComments 

ReportHistory 

Notifications 

AuditLogs 

Sessions 

## **15. Geolocation Design** 

Each report stores: 

- Latitude 

- Longitude 

- Address 

- District 

- City 

- Province 

9 

Features: 

- Map View • Area Filter • Geographic Analytics 

## **16. Notification System** 

Channels 

- In-App Notification • Email Notification 

Events 

- Report Created 

- Report Assigned 

- Report Updated 

- Report Resolved 

## **17. Audit Trail** 

Track: 

- Login Activity 

- Report Changes 

- Status Changes 

- User Actions 

Data: 

- Actor • Action 

- Timestamp 

- Resource 

- Before Value 

- After Value 

## **18. Analytics Dashboard** 

Public Dashboard 

- Total Reports 

- Resolved Reports 

- Resolution Rate 

10 

- Average Handling Time 

Admin Dashboard 

- Reports By Category 

- Reports By District 

- Agency Performance 

- Monthly Trends 

## **19. System Architecture** 

Architecture Style: 

Modular Monolith 

Layers: 

Presentation Layer 

## ↓ 

Application Layer 

## ↓ 

Domain Layer 

## ↓ 

Infrastructure Layer 

## **20. Recommended Tech Stack** 

Frontend 

- Next.js 16 

- TypeScript 

- Tailwind CSS 

- shadcn/ui 

- TanStack Query 

- Zustand 

Backend 

- Next.js Route Handlers 

- Service Layer 

11 

- Repository Layer 

Database 

- PostgreSQL 

- Prisma ORM 

Authentication 

• Better Auth Storage 

• MinIO • S3 Compatible Storage Queue • Redis • BullMQ Monitoring • Sentry • OpenTelemetry Deployment • Docker • Coolify • VPS 

## **21. Security Architecture** 

- Middleware Authorization • RBAC Enforcement 

- Server Side Validation 

- Zod Validation 

- Password Hashing 

- Audit Logging 

## **22. MVP Scope** 

Included 

- Authentication 

- Report Submission 

- Attachment Upload 

12 

- Workflow Status 

- Dashboard 

- Notifications 

- Analytics 

Excluded 

- AI Classification 

- Smart Routing 

- Mobile App 

- WhatsApp Integration 

## **23. Future Roadmap** 

V1 

Citizen Reporting Platform 

V2 

Multi Agency Workflow 

V3 

AI Categorization 

V4 

Smart City Analytics 

V5 

Predictive Infrastructure Monitoring 

## **24. Risks** 

Technical Risks 

- Large File Upload 

- Database Growth 

- Notification Delivery 

Business Risks 

- Low User Adoption 

- Poor Agency Response 

13 

Operational Risks 

- Human Error • Misclassification 

## **25. Definition of Success** 

Produk dianggap berhasil apabila: 

- 80% laporan dapat diproses secara digital. 

- Resolution Rate > 70%. 

- Average Response Time turun 50%. 

- Dashboard digunakan aktif oleh instansi. 

- Citizen Satisfaction meningkat secara konsisten. 

14 

