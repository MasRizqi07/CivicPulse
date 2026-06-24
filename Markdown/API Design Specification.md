## **API DESIGN SPECIFICATION** 

## **CivicPulse API** 

Version: v1 

Base URL 

/api/v1 

Content-Type 

application/json 

Authentication 

Session Cookie (Better Auth) 

## **Authentication APIs** 

## **Register User** 

POST /auth/register 

Request 

- { "fullName": "John Doe", "email": "john@example.com", "password": "StrongPassword123" } 

Response 

201 Created 

{ "success": true, "message": "User registered successfully" } 

## **Login** 

POST /auth/login 

Request 

{ "email": "john@example.com", "password": "StrongPassword123" } 

Response 

1 

200 OK 

{ "success": true, "user": { "id": "uuid", "name": "John Doe", "role": "CITIZEN" } } 

## **Logout** 

POST /auth/logout 

Response 

204 No Content 

## **Current User** 

GET /auth/me 

Response 

200 OK 

{ "id": "uuid", "name": "John Doe", "role": "CITIZEN" } 

## **Report APIs** 

## **Create Report** 

POST /reports 

Request 

{ "title": "Jalan Rusak", "description": "Jalan berlubang besar", "category": "INFRASTRUCTURE", "priority": "HIGH", "location": { "latitude": -7.2504, "longitude": 112.7688, "address": "Surabaya" } } 

Response 

201 Created 

{ "id": "report_id", "status": "SUBMITTED" } 

## **Get Reports** 

GET /reports 

2 

Query Params 

?page=1 &limit=20 &status=SUBMITTED &category=INFRASTRUCTURE &search=jalan 

Response 

200 OK 

{ "data": [], "pagination": {} } 

## **Get Report Detail** 

GET /reports/{id} 

Response 200 OK 

{ "id": "report_id", "title": "Jalan Rusak", "attachments": [], "comments": [], "history": [] } 

## **Update Report** 

PATCH /reports/{id} 

Officer Only 

Request 

{ "status": "IN_PROGRESS" } 

Response 

200 OK 

{ "success": true } 

## **Delete Report** 

DELETE /reports/{id} 

Response 

204 No Content 

3 

## **Report Attachments** 

## **Upload Attachment** 

POST /reports/{id}/attachments 

multipart/form-data 

Fields 

file 

Response 

201 Created 

{ "id": "attachment_id", "url": "file_url" } 

## **Delete Attachment** 

DELETE /attachments/{id} 

Response 

204 No Content 

## **Report Comments** 

## **Add Comment** 

POST /reports/{id}/comments 

Request 

- { "message": "Sedang ditindaklanjuti." } 

Response 

201 Created 

- { "id": "comment_id" } 

4 

## **Get Comments** 

GET /reports/{id}/comments 

Response 

200 OK 

{ "data": [] } 

## **Report History** 

## **Get History** 

GET /reports/{id}/history 

Response 200 OK 

{ "data": [] } 

## **Notifications** 

## **Get Notifications** 

GET /notifications 

Response 

200 OK 

{ "data": [] } 

## **Mark As Read** 

PATCH /notifications/{id}/read 

Response 

200 OK 

{ "success": true } 

5 

## **Agencies** 

## **List Agencies** 

GET /agencies 

Response 200 OK 

{ "data": [] } 

## **Create Agency** 

POST /agencies 

Super Admin Only 

Request 

{ "name": "Dinas PU" } 

Response 201 Created 

{ "id": "agency_id" } 

## **Users** 

## **List Users** 

GET /users 

Super Admin Only 

## **Create Officer** 

POST /users/officers 

Super Admin Only 

6 

Request 

{ "fullName": "Officer A", "email": "officer@example.com", "agencyId": "agency_id" } 

## **Analytics** 

## **Public Statistics** 

GET /analytics/public 

Response 

{ "totalReports": 1000, "resolvedReports": 750, "resolutionRate": 75 } 

## **Admin Statistics** 

GET /analytics/admin 

Officer+ 

Response 

{ "reportsByCategory": [], "reportsByDistrict": [], "avgResolutionTime": 48 } 

## **Audit Logs** 

GET /audit-logs 

Super Admin Only 

Response 

{ "data": [] } 

## **Health Check** 

GET /health 

Response 

{ "status": "healthy" } 

7 

