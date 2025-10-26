# 🧪 Hướng dẫn Test Refresh Token trong Postman

## 📋 Chuẩn bị

1. **Khởi động Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Mở Postman**

---

## ✅ Test 1: Login - Nhận Access Token và Refresh Token

### Request:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "duyquang2709pp@gmail.com",
    "password": "password123"
  }
  ```

### Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyen Van A",
    "email": "duyquang2709pp@gmail.com",
    "role": "user",
    "avatar": "..."
  }
}
```

**✅ Lưu lại `token` và `refreshToken` để dùng cho các test tiếp theo!**

---

## ✅ Test 2: Truy cập Protected Route với Access Token

### Request:
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/users/profile`
- **Headers**: 
  ```
  Authorization: Bearer <YOUR_ACCESS_TOKEN>
  ```

### Expected Response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Nguyen Van A",
    "email": "duyquang2709pp@gmail.com",
    "role": "user",
    "avatar": "..."
  }
}
```

---

## ✅ Test 3: Refresh Token - Lấy Access Token mới

### Request:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/refresh`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }
  ```

### Expected Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nguyen Van A",
    "email": "duyquang2709pp@gmail.com",
    "role": "user",
    "avatar": "..."
  }
}
```

**✅ Bạn sẽ nhận được Access Token MỚI và Refresh Token MỚI!**

---

## ✅ Test 4: Logout - Revoke Refresh Token

### Request:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/logout`
- **Headers**: 
  ```
  Authorization: Bearer <YOUR_ACCESS_TOKEN>
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "<YOUR_REFRESH_TOKEN>"
  }
  ```

### Expected Response:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## ✅ Test 5: Thử dùng Refresh Token đã bị revoke

### Request:
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/auth/refresh`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "refreshToken": "<REVOKED_REFRESH_TOKEN>"
  }
  ```

### Expected Response:
```json
{
  "success": false,
  "message": "Refresh token is expired or revoked"
}
```

---

## 🎯 Kết quả mong đợi:

1. ✅ Login thành công → Nhận được `token` và `refreshToken`
2. ✅ Truy cập protected route với `token` → Thành công
3. ✅ Refresh token → Nhận được `token` mới và `refreshToken` mới
4. ✅ Logout → Revoke refresh token
5. ✅ Thử dùng refresh token đã revoke → Lỗi "expired or revoked"

---

## 📸 Chụp màn hình:

Hãy chụp màn hình các test trên và gửi cho giảng viên!

---

## 🚀 Test trên Frontend:

1. Mở `http://localhost:3000/login`
2. Đăng nhập với email: `duyquang2709pp@gmail.com`, password: `password123`
3. Mở **DevTools** (F12) → **Application** → **Local Storage**
4. Kiểm tra xem có `token` và `refreshToken` không
5. Đợi 15 phút (hoặc thay đổi `JWT_EXPIRE=1m` trong `.env` để test nhanh hơn)
6. Thử truy cập `/profile` → Frontend sẽ tự động refresh token!

---

## 🎉 Hoàn thành!

Bạn đã hoàn thành **Hoạt động 1 - Refresh Token & Session Management**!

