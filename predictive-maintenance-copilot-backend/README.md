# � Predictive Maintenance API

Backend API untuk sistem Predictive Maintenance menggunakan NestJS, PostgreSQL, dan Supabase Auth.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Testing](#-testing-dengan-postman)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ Authentication dengan Supabase (Sign Up, Sign In, Sign Out)
- ✅ Email Verification
- ✅ JWT Token & Refresh Token
- ✅ Session Management (token invalid setelah logout)
- ✅ Role-Based Access Control (Admin, Operator, Viewer)

### 🏭 Machine Management

- ✅ CRUD Operations untuk machines
- ✅ Machine statistics (sensor readings count, predictions)
- ✅ Filter & search machines (by type, status, location)
- ✅ Pagination support

### 📊 Sensor Data Management

- ✅ Record sensor readings (single & batch)
- ✅ Query sensor data dengan filter (date range, machine)
- ✅ Statistical analysis (min, max, avg, median)
- ✅ Support untuk multiple machines

### 🤖 AI-Powered Maintenance Copilot

- ✅ **RAG (Retrieval Augmented Generation)** untuk dokumentasi maintenance
- ✅ Semantic search dengan pgvector (768-dim embeddings)
- ✅ Multi-document support (SOPs, manuals, datasheets)
- ✅ LangGraph workflow untuk agentic behavior
- ✅ Multi-LLM support (Gemini, Groq/GPT-OSS)
- ✅ Source citation dengan page numbers
- ✅ PDF preview dengan signed URLs

### 🛠 Technical Features

- ✅ Input Validation dengan Zod
- ✅ PostgreSQL dengan Prisma ORM
- ✅ RESTful API Design
- ✅ Comprehensive error handling
- ✅ Postman collection untuk testing

---

## 🛠 Tech Stack

- **Framework:** NestJS 11.x
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 6.x
- **Authentication:** Supabase Auth + Passport JWT
- **Validation:** Zod + nestjs-zod
- **Language:** TypeScript

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- PostgreSQL database (Supabase account)

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd predictive-maintenance-copilot-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

Copy `.env.example` ke `.env` dan isi:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT (optional - auto-generated if empty)
JWT_SECRET="your-jwt-secret"

# App
PORT=3000
NODE_ENV=development
```

4. **Setup database**

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database
npm run prisma:push

# (Optional) Seed sample data
npm run seed
```

5. **Setup RAG (Retrieval Augmented Generation)**

   a. **Enable pgvector Extension**
   - Go to Supabase Dashboard → Database → Extensions
   - Search for `pgvector` and click Enable

   b. **Run RAG Migration**

   ```bash
   npx prisma migrate dev
   ```

   c. **Create Vector Similarity Index**

   Run this SQL in Supabase SQL Editor (Dashboard → SQL Editor → New Query):

   ```sql
   -- Create vector similarity search index for fast semantic search
   -- This significantly improves query performance (100x faster for large datasets)
   CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
   ON document_chunks USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 100);
   ```

   **Note:**
   - `lists = 100` is optimal for datasets with ~10K-100K vectors
   - For larger datasets (>100K vectors), use HNSW index instead:
     ```sql
     CREATE INDEX idx_document_chunks_embedding
     ON document_chunks USING hnsw (embedding vector_cosine_ops);
     ```
   - See full SQL setup in [`prisma/migrations/001_add_rag_documents.sql`](prisma/migrations/001_add_rag_documents.sql)

   d. **Create Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Click "New Bucket"
   - Name: `maintenance-documents`
   - Set as **Private**
   - Click Create

6. **Run aplikasi**

```bash
# Development mode dengan hot reload
npm run start:dev

# Production mode
npm run start:prod
```

Server akan running di `http://localhost:3000`

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

### Authentication Endpoints

| Endpoint                      | Method | Auth | Description                  |
| ----------------------------- | ------ | ---- | ---------------------------- |
| `/auth/signup`                | POST   | ❌   | Daftar user baru             |
| `/auth/signin`                | POST   | ❌   | Login user                   |
| `/auth/me`                    | GET    | ✅   | Get profile user             |
| `/auth/refresh`               | POST   | ❌   | Refresh access token         |
| `/auth/signout`               | POST   | ✅   | Logout user                  |
| `/auth/reset-password`        | POST   | ❌   | Reset password               |
| `/auth/verify-email`          | GET    | ❌   | Halaman verifikasi email     |
| `/auth/verify-email/callback` | POST   | ❌   | Callback verifikasi email    |
| `/auth/resend-verification`   | POST   | ❌   | Kirim ulang email verifikasi |

### Machine Management Endpoints

| Endpoint              | Method | Auth | Roles           | Description                     |
| --------------------- | ------ | ---- | --------------- | ------------------------------- |
| `/machines`           | POST   | ✅   | Admin, Operator | Create new machine              |
| `/machines`           | GET    | ✅   | All             | Get all machines (with filters) |
| `/machines/:id`       | GET    | ✅   | All             | Get machine by ID               |
| `/machines/:id/stats` | GET    | ✅   | All             | Get machine statistics          |
| `/machines/:id`       | PATCH  | ✅   | Admin, Operator | Update machine                  |
| `/machines/:id`       | DELETE | ✅   | Admin           | Delete machine                  |

### Sensors Endpoints

| Endpoint                         | Method | Auth | Roles           | Description                        |
| -------------------------------- | ------ | ---- | --------------- | ---------------------------------- |
| `/sensors`                       | POST   | ✅   | Admin, Operator | Create sensor reading              |
| `/sensors/batch`                 | POST   | ✅   | Admin, Operator | Create multiple sensor readings    |
| `/sensors`                       | GET    | ✅   | All             | Get sensor readings (with filters) |
| `/sensors/:udi`                  | GET    | ✅   | All             | Get sensor reading by UDI          |
| `/sensors/statistics/:machineId` | GET    | ✅   | All             | Get sensor statistics for machine  |
| `/sensors/:udi`                  | DELETE | ✅   | Admin           | Delete sensor reading              |

### Example Usage

#### 1. Sign Up (Daftar)

```bash
POST /auth/signup

Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:**

```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "email": "user@example.com"
  }
}
```

> ⚠️ **Penting:** Setelah sign up, cek email untuk verifikasi. User belum bisa login sebelum email diverifikasi.

#### 2. Verify Email

- Buka link verifikasi dari email
- Otomatis redirect ke halaman sukses
- Setelah verified, baru bisa login

#### 3. Sign In (Login)

```bash
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Sign in successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600
}
```

> 💾 **Simpan accessToken** untuk request selanjutnya!

#### 4. Create Machine

```bash
POST /machines
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "productId": "L47181",
  "type": "L",
  "name": "Machine L47181",
  "description": "Low quality variant machine",
  "location": "Factory Floor 2",
  "installationDate": "2023-02-06",
  "lastMaintenanceDate": "2024-06-22",
  "status": "operational"
}
```

**Response:**

```json
{
  "id": "uuid",
  "productId": "L47181",
  "type": "L",
  "name": "Machine L47181",
  "status": "operational",
  "createdAt": "2025-11-12T00:00:00.000Z"
}
```

#### 5. Get All Machines

```bash
GET /machines?type=L&status=operational&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "L47181",
      "name": "Machine L47181",
      "type": "L",
      "status": "operational",
      "_count": {
        "sensorReadings": 150
      }
    }
  ],
  "meta": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### 6. Create Sensor Reading

```bash
POST /sensors
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "machineId": "uuid",
  "productId": "L47181",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 1450,
  "torque": 42.3,
  "toolWear": 85,
  "timestamp": "2025-11-12T10:30:00Z"
}
```

**Response:**

```json
{
  "udi": 123,
  "machineId": "uuid",
  "productId": "L47181",
  "airTemp": 298.5,
  "processTemp": 308.2,
  "rotationalSpeed": 1450,
  "torque": 42.3,
  "toolWear": 85,
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

#### 7. Get Sensor Statistics

```bash
GET /sensors/statistics/uuid?limit=100
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
{
  "machineId": "uuid",
  "readingsAnalyzed": 100,
  "statistics": {
    "airTemp": {
      "min": 295.2,
      "max": 302.5,
      "avg": 298.5,
      "median": 298.3
    },
    "processTemp": {
      "min": 305.1,
      "max": 312.8,
      "avg": 308.2,
      "median": 308.0
    },
    "rotationalSpeed": {
      "min": 1200,
      "max": 1600,
      "avg": 1450,
      "median": 1455
    },
    "torque": {
      "min": 30.5,
      "max": 50.2,
      "avg": 42.3,
      "median": 42.1
    },
    "toolWear": {
      "min": 0,
      "max": 200,
      "avg": 85,
      "median": 82
    }
  }
}
```

#### 8. Get Profile

```bash
GET /auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
{
  "id": 1,
  "supabaseId": "uuid...",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-11-11T00:00:00.000Z",
  "updatedAt": "2025-11-11T00:00:00.000Z"
}
```

#### 5. Sign Out (Logout)

```bash
POST /auth/signout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
{
  "message": "Sign out successful"
}
```

> ✅ Setelah sign out, token tidak bisa digunakan lagi!

## 🧪 Testing dengan Postman

1. Import collection dari `postman/Predictive-Maintenance-API.postman_collection.json`
2. Import environment dari `postman/environments/`
3. Pilih environment (Local/Development/Production)
4. Test endpoints sesuai urutan:
   - Sign Up → Verify Email → Sign In → Get Profile → Sign Out

## 📦 Database Schema

### Models

#### User

- `id` - Primary key
- `supabaseId` - Supabase user ID
- `email` - Email (unique)
- `fullName` - Full name
- `role` - User role (admin, operator, viewer)
- `isActive` - Account status

#### Machine

- `id` - Primary key (UUID)
- `productId` - Product identifier (unique)
- `type` - Machine type (L, M, H)
- `name` - Machine name
- `description` - Description
- `location` - Physical location
- `installationDate` - Installation date
- `lastMaintenanceDate` - Last maintenance date
- `status` - Status (operational, maintenance, offline, retired)

#### SensorData

- `udi` - Primary key (auto-increment)
- `machineId` - Foreign key to Machine
- `productId` - Product identifier
- `airTemp` - Air temperature (K)
- `processTemp` - Process temperature (K)
- `rotationalSpeed` - Rotational speed (RPM)
- `torque` - Torque (Nm)
- `toolWear` - Tool wear time (minutes)
- `timestamp` - Reading timestamp

#### PredictionResult

- `id` - Primary key (UUID)
- `machineId` - Foreign key to Machine
- `riskScore` - Risk score (0-1)
- `failurePredicted` - Failure prediction flag
- `failureType` - Type of failure
- `anomalyDetected` - Anomaly detection flag
- `predictedFailureTime` - Predicted failure time
- `confidence` - Prediction confidence (0-1)
- `timestamp` - Prediction timestamp

## 📦 Database Seeding

Untuk testing, Anda bisa seed data sample:

```bash
npm run prisma:seed
```

Ini akan membuat sample data untuk testing API

## 🔧 Scripts

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `npm run start`           | Run aplikasi (production) |
| `npm run start:dev`       | Run dengan hot reload     |
| `npm run start:prod`      | Run production build      |
| `npm run build`           | Build aplikasi            |
| `npm run lint`            | Check code linting        |
| `npm run test`            | Run unit tests            |
| `npm run prisma:generate` | Generate Prisma Client    |
| `npm run prisma:push`     | Push schema ke database   |
| `npm run prisma:studio`   | Buka Prisma Studio        |
| `npm run seed`            | Seed sample data          |

## 📁 Project Structure

```
predictive-maintenance-copilot-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── decorators/        # @Public, @Roles decorators
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── guards/            # JWT & Roles guards
│   │   ├── strategies/        # Passport JWT strategy
│   │   ├── auth.controller.ts # Auth endpoints
│   │   ├── auth.service.ts    # Auth business logic
│   │   └── supabase.service.ts# Supabase integration
│   ├── common/                # Shared modules
│   │   ├── filters/           # Exception filters
│   │   └── prisma/            # Prisma service
│   ├── machine/               # Machine module
│   │   ├── dto/               # Machine DTOs (Zod validation)
│   │   ├── machine.controller.ts # Machine endpoints
│   │   ├── machine.service.ts    # Machine business logic
│   │   └── machine.module.ts     # Machine module
│   ├── sensors/               # Sensors module
│   │   ├── dto/               # Sensor DTOs (Zod validation)
│   │   ├── sensors.controller.ts # Sensor endpoints
│   │   ├── sensors.service.ts    # Sensor business logic
│   │   └── sensors.module.ts     # Sensor module
│   ├── user/                  # User module
│   ├── app.module.ts          # Root module
│   └── main.ts                # Entry point
├── test/                      # E2E tests
├── postman/                   # Postman collections
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Supabase integration
- ✅ Email verification
- ✅ Session validation (token invalid setelah logout)
- ✅ Role-based access control
- ✅ Password hashing (handled by Supabase)
- ✅ Input validation dengan Zod

## 🐛 Troubleshooting

### ❌ Error: "Invalid credentials" saat sign in

**Penyebab:** Email belum diverifikasi atau password salah

**Solusi:**

1. Pastikan email sudah diverifikasi (cek inbox)
2. Klik link verifikasi di email
3. Coba login lagi
4. Jika lupa password, gunakan `/auth/reset-password`

### ❌ Error: "Session has been invalidated"

**Penyebab:** Token sudah tidak valid (setelah sign out atau expired)

**Solusi:** Login ulang untuk mendapatkan token baru

### 📧 Email verifikasi tidak sampai

**Solusi:**

1. Cek spam/junk folder
2. Gunakan endpoint `/auth/resend-verification` untuk kirim ulang
3. Pastikan Supabase email service sudah configured

### 🔧 Database connection error

**Solusi:**

1. Pastikan `DATABASE_URL` dan `DIRECT_URL` sudah benar di `.env`
2. Check koneksi ke Supabase
3. Jalankan `npm run prisma:generate` dan `npm run prisma:push`

---

## 📖 Documentation

### Untuk Frontend Developer

Dokumentasi lengkap tentang API endpoints, error handling, dan integration guide:

👉 **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**

Berisi:

- Complete authentication flow
- Semua API endpoints dengan request/response format
- Error codes dan handling
- Common exceptions
- Security notes

---

## 🤝 Contributing

Contributions welcome! Silakan buat issue atau pull request.

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Baca [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) terlebih dahulu
2. Test dengan Postman collection
3. Check browser console dan network tab
4. Buat issue dengan detail error

---

**Built with ❤️ using NestJS**
