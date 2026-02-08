# 📮 Postman Collection Guide

Panduan lengkap untuk menggunakan Postman Collection untuk testing Predictive Maintenance API.

> **⚠️ Note tentang WebSocket:**  
> WebSocket request **TIDAK BISA** di-export/import dalam Postman collection JSON.  
> Untuk test WebSocket, lihat: [`examples/POSTMAN-WEBSOCKET-SETUP.md`](../examples/POSTMAN-WEBSOCKET-SETUP.md)  
> Atau gunakan browser test: [`examples/test-websocket.html`](../examples/test-websocket.html)

---

## 📥 Import Collection & Environment

### 1. Import Collection

1. Buka **Postman**
2. Klik **Import** (tombol di kiri atas)
3. Pilih **File** atau drag & drop
4. Select file: `postman/Predictive-Maintenance-API.postman_collection.json`
5. Klik **Import**

✅ Collection akan muncul di sidebar kiri dengan nama **"Predictive Maintenance API"**

---

### 2. Import Environment

1. Masih di Postman, klik **Import** lagi
2. Select file: `postman/Predictive-Maintenance-Dev.postman_environment.json`
3. Klik **Import**
4. (Optional) Import juga Production environment jika diperlukan

✅ Environment akan muncul di dropdown (kanan atas)

---

### 3. Aktifkan Environment

1. Klik dropdown **"No Environment"** di kanan atas
2. Pilih **"Predictive Maintenance - Development"**

✅ Sekarang semua request akan menggunakan `http://localhost:3000` sebagai base URL

---

## 🚀 Testing Flow

### Step 1: Pastikan Server Running

```bash
npm run start:dev
```

Pastikan server running di `http://localhost:3000`

---

### Step 2: Test Authentication Flow

#### A. Sign Up (Register User Baru)

1. Buka folder **"Authentication"** di collection
2. Klik **"Sign Up"**
3. Lihat Body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "fullName": "Test User"
   }
   ```
4. Ubah email jika perlu (gunakan email yang belum terdaftar)
5. Klik **Send**

**Expected Response (201 Created):**
```json
{
  "message": "Sign up successful. Please check your email for verification link.",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600
  }
}
```

✅ **Access token otomatis tersimpan ke environment variable!**

---

#### B. Sign In (Login)

1. Klik **"Sign In"**
2. Lihat Body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
3. Pastikan email/password sesuai dengan yang di-signup
4. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "operator"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 3600
}
```

✅ **Access token, refresh token, dan user info otomatis tersimpan ke environment!**

---

#### C. Get Profile (Protected Endpoint)

1. Klik **"Get Profile (Me)"**
2. Perhatikan di **Headers** tab, ada:
   ```
   Authorization: Bearer {{accessToken}}
   ```
3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "operator",
  "isActive": true
}
```

✅ **Request berhasil karena menggunakan access token yang valid!**

---

#### D. Refresh Token

1. Klik **"Refresh Token"**
2. Body otomatis menggunakan `{{refreshToken}}` dari environment
3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "accessToken": "new_access_token_here",
  "refreshToken": "new_refresh_token_here",
  "expiresIn": 3600
}
```

✅ **Access token & refresh token baru otomatis tersimpan!**

---

#### E. Reset Password

1. Klik **"Reset Password"**
2. Body:
   ```json
   {
     "email": "test@example.com"
   }
   ```
3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "message": "Password reset email sent. Please check your inbox."
}
```

✅ **User akan menerima email reset password dari Supabase**

---

#### F. Sign Out

1. Klik **"Sign Out"**
2. Request menggunakan Bearer token dari environment
3. Klik **Send**

**Expected Response (200 OK):**
```json
{
  "message": "Sign out successful"
}
```

---

## 🔧 Environment Variables

Setelah Sign In berhasil, environment variables otomatis ter-set:

| Variable | Description | Auto-set? |
|----------|-------------|-----------|
| `baseUrl` | API base URL | Manual |
| `accessToken` | JWT access token | ✅ Yes (after sign in) |
| `refreshToken` | JWT refresh token | ✅ Yes (after sign in) |
| `userId` | Current user ID | ✅ Yes (after sign in) |
| `userEmail` | Current user email | ✅ Yes (after sign in) |

### Melihat Environment Variables:

1. Klik icon **Eye** 👁️ di kanan atas (next to environment dropdown)
2. Lihat **Current Value** dari setiap variable

### Edit Environment Variables:

1. Klik icon **Eye** 👁️
2. Klik **Edit** pada environment yang aktif
3. Update nilai yang diinginkan
4. Save

---

## 📝 Test Scripts

Collection ini sudah dilengkapi dengan **Test Scripts** yang otomatis:

### Sign In & Sign Up:
```javascript
// Otomatis set token ke environment setelah response success
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set('accessToken', jsonData.accessToken);
    pm.environment.set('refreshToken', jsonData.refreshToken);
}
```

### Refresh Token:
```javascript
// Otomatis update token baru
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set('accessToken', jsonData.accessToken);
    pm.environment.set('refreshToken', jsonData.refreshToken);
}
```

---

## 🔐 Authorization

### Global Authorization:

Collection sudah di-set dengan **Bearer Token** authorization:

```
Type: Bearer Token
Token: {{accessToken}}
```

### Per-Request Authorization:

- ✅ **Public endpoints** (Sign Up, Sign In, Refresh, Reset Password): `No Auth`
- ✅ **Protected endpoints** (Get Profile, Sign Out): Inherit from parent (Bearer Token)

---

## 🎯 Testing Different Scenarios

### Scenario 1: New User Registration

1. **Sign Up** dengan email baru
2. Check email untuk verification link (jika Supabase email confirm enabled)
3. **Sign In** dengan credentials yang sama
4. **Get Profile** untuk verify user data

---

### Scenario 2: Existing User Login

1. **Sign In** dengan existing credentials
2. **Get Profile** untuk check user info
3. Test protected endpoints lainnya

---

### Scenario 3: Token Refresh

1. **Sign In** untuk dapat tokens
2. Tunggu beberapa saat
3. **Refresh Token** untuk dapat token baru
4. **Get Profile** dengan token baru

---

### Scenario 4: Unauthorized Access

1. Hapus `accessToken` dari environment (set value ke empty string)
2. Coba **Get Profile**
3. Expected: Error 401 Unauthorized

---

### Scenario 5: Password Reset

1. **Reset Password** dengan email yang terdaftar
2. Check inbox untuk reset link
3. Klik link dan set password baru
4. **Sign In** dengan password baru

---

## 🛠️ Customization

### Mengubah Base URL:

**Development:**
```json
"baseUrl": "http://localhost:3000"
```

**Production:**
```json
"baseUrl": "https://api.yourdomain.com"
```

### Menambah Request Baru:

1. Right-click pada folder (e.g., "Authentication")
2. Add Request
3. Configure method, URL, body, headers
4. Save

---

## 📊 Response Examples

### Success Response:
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response:
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot GET /auth/signup"

**Solusi:** Pastikan:
- Server running (`npm run start:dev`)
- Base URL benar (`http://localhost:3000`)
- Environment selected

---

### ❌ Error: 401 Unauthorized

**Solusi:**
- Sign In ulang untuk dapat token baru
- Check `accessToken` di environment variables
- Pastikan token belum expired

---

### ❌ Error: "Supabase URL and Anon Key must be provided"

**Solusi:**
- Check `.env` file
- Pastikan `SUPABASE_URL`, `SUPABASE_ANON_KEY`, dan `SUPABASE_JWT_SECRET` sudah di-set
- Restart server

---

### ❌ Variables tidak auto-set setelah Sign In

**Solusi:**
- Check **Tests** tab di request
- Pastikan test script ada
- Check Console (View → Show Postman Console) untuk error

---

## 💡 Tips & Tricks

### 1. Use Collection Runner

Test semua endpoints sekaligus:
1. Click **"..."** pada collection
2. **Run collection**
3. Select environment
4. **Run**

### 2. Save Responses as Examples

Setelah request success:
1. Click **Save as Example**
2. Example akan tersimpan untuk dokumentasi

### 3. Use Pre-request Scripts

Untuk logic sebelum request:
```javascript
// Generate random email
pm.environment.set("randomEmail", `test${Date.now()}@example.com`);
```

### 4. Environment Switching

Switch antara Dev dan Prod dengan mudah:
- Development: `http://localhost:3000`
- Production: `https://api.yourdomain.com`

---

## 📚 Next Steps

1. ✅ Import Collection & Environment
2. ✅ Test basic authentication flow
3. 🔄 Add more endpoints (machines, sensors, conversations)
4. 🔄 Create test suites dengan Collection Runner
5. 🔄 Set up CI/CD dengan Newman (Postman CLI)

---

## 🔗 Related Files

- `postman/Predictive-Maintenance-API.postman_collection.json` - Main collection
- `postman/Predictive-Maintenance-Dev.postman_environment.json` - Development env
- `postman/Predictive-Maintenance-Prod.postman_environment.json` - Production env

---

**Happy Testing! 🚀**

Jika ada pertanyaan atau menemukan bug, silakan buat issue di repository.
