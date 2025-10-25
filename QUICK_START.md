# ⚡ Quick Start Guide

## 🚀 Chạy ứng dụng nhanh trong 5 phút!

### Bước 1: Cài đặt MongoDB

**Option A: MongoDB Local**
- Download: https://www.mongodb.com/try/download/community
- Sau khi cài, chạy: `mongod`

**Option B: MongoDB Atlas (Cloud - Khuyến nghị)**
1. Đăng ký miễn phí: https://www.mongodb.com/cloud/atlas/register
2. Tạo cluster (chọn FREE tier)
3. Lấy connection string
4. Cập nhật `MONGODB_URI` trong `backend/.env`

### Bước 2: Chạy Backend

```bash
# Mở terminal 1
cd backend
npm install
npm run dev
```

✅ Backend chạy tại: http://localhost:5000

### Bước 3: Chạy Frontend

```bash
# Mở terminal 2 (terminal mới)
cd frontend
npm install
npm start
```

✅ Frontend chạy tại: http://localhost:3000

### Bước 4: Test ứng dụng

1. Mở trình duyệt: http://localhost:3000
2. Click **"Sign Up"** để đăng ký
3. Điền thông tin:
   - Name: Admin User
   - Email: admin@test.com
   - Password: 123456
4. Đăng nhập với tài khoản vừa tạo
5. Xem Profile và test các tính năng!

---

## 🧪 Test với Postman

### 1. Tạo Admin User

```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

### 2. Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "123456"
}
```

**Lưu TOKEN từ response!**

### 3. Get Profile (cần token)

```
GET http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Get All Users (Admin only)

```
GET http://localhost:5000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Update Profile

```
PUT http://localhost:5000/api/users/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "admin@test.com"
}
```

---

## 📸 Screenshots cho báo cáo

### Screenshot cần chụp:

1. **Form Sign Up + thông báo thành công**
   - Đăng ký user mới
   - Chụp form và toast notification

2. **Form Login + JWT Token**
   - Đăng nhập
   - Mở DevTools > Application > Local Storage
   - Chụp token được lưu

3. **Postman test APIs**
   - Test `/signup`, `/login`, `/logout`
   - Chụp Request + Response

4. **Trang Profile**
   - Hiển thị thông tin user
   - Form cập nhật thông tin

5. **Postman test Profile APIs**
   - Test GET `/profile`
   - Test PUT `/profile`

6. **Trang Admin Dashboard**
   - Hiển thị danh sách users
   - Nút xóa user

7. **Postman test Admin APIs**
   - Test GET `/users` với quyền Admin
   - Test DELETE `/users/:id`

8. **Form Forgot Password**
   - Nhập email
   - Thông báo gửi email thành công

9. **GitHub Repository**
   - Các nhánh: main, backend-auth, backend-admin, frontend-auth, frontend-profile
   - Pull Requests
   - Lịch sử commits

---

## 🎯 Tạo dữ liệu test nhanh

### Tạo nhiều users để test Admin Dashboard:

```bash
# User 1
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "123456"
}

# User 2
POST /api/auth/signup
{
  "name": "Jane Smith",
  "email": "jane@test.com",
  "password": "123456"
}

# User 3
POST /api/auth/signup
{
  "name": "Bob Wilson",
  "email": "bob@test.com",
  "password": "123456"
}

# Admin
POST /api/auth/signup
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

Sau đó login bằng admin account và vào Admin Dashboard để xem tất cả users!

---

## 🐛 Troubleshooting

### Backend không chạy được?

**Lỗi: Cannot connect to MongoDB**
- Kiểm tra MongoDB có đang chạy không
- Hoặc dùng MongoDB Atlas (cloud)

**Lỗi: Port 5000 đã được sử dụng**
```bash
# Đổi port trong backend/.env
PORT=5001
```

### Frontend không kết nối được Backend?

**Lỗi CORS**
- Kiểm tra `CLIENT_URL` trong `backend/.env` = `http://localhost:3000`

**Lỗi: Network Error**
- Đảm bảo backend đang chạy
- Kiểm tra `REACT_APP_API_URL` trong `frontend/.env` = `http://localhost:5000/api`

### Upload Avatar không hoạt động?

**Nguyên nhân:** Chưa cấu hình Cloudinary

**Giải pháp:**
1. Đăng ký Cloudinary: https://cloudinary.com
2. Lấy credentials: Cloud Name, API Key, API Secret
3. Cập nhật trong `backend/.env`

**Tạm thời:** Avatar upload sẽ lưu local trong `backend/uploads/` (không khuyến khích cho production)

### Forgot Password không gửi email?

**Nguyên nhân:** Chưa cấu hình email

**Giải pháp:**
1. Dùng Gmail
2. Tạo App Password: https://myaccount.google.com/apppasswords
3. Cập nhật trong `backend/.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

**Tạm thời:** Xem console log trong terminal backend để lấy reset URL

---

## ✅ Checklist hoàn thành dự án

- [ ] Backend APIs hoạt động (test bằng Postman)
- [ ] Frontend kết nối được Backend
- [ ] Đăng ký user mới thành công
- [ ] Đăng nhập và nhận JWT token
- [ ] Xem và cập nhật Profile
- [ ] Upload Avatar (nếu đã config Cloudinary)
- [ ] Admin Dashboard hiển thị danh sách users
- [ ] Admin có thể xóa user
- [ ] Forgot Password gửi email (nếu đã config)
- [ ] Code đã push lên GitHub
- [ ] Tạo các nhánh và Pull Requests
- [ ] README.md đầy đủ
- [ ] Chụp screenshots đầy đủ

---

## 📹 Ghi video demo

### Nội dung video (3-5 phút):

1. **Giới thiệu** (30s)
   - Tên dự án
   - Công nghệ sử dụng

2. **Demo Sign Up** (30s)
   - Mở http://localhost:3000
   - Đăng ký user mới
   - Hiển thị thông báo thành công

3. **Demo Login** (30s)
   - Đăng nhập với user vừa tạo
   - Hiển thị JWT token trong localStorage

4. **Demo Profile** (1 phút)
   - Xem thông tin profile
   - Cập nhật name/email
   - Upload avatar (nếu có)

5. **Demo Admin Dashboard** (1 phút)
   - Login bằng admin account
   - Xem danh sách users
   - Xóa một user
   - Thay đổi role

6. **Demo Postman** (1 phút)
   - Test API Sign Up
   - Test API Login
   - Test API Get Profile (với token)
   - Test API Get Users (admin)

7. **Show GitHub** (30s)
   - Repository với các nhánh
   - Pull Requests
   - Commits history

---

## 📦 Nộp bài

### Cần nộp:

1. **Link GitHub Repository**
   - https://github.com/vovanbia26-sudo/authentication-user-management

2. **Video demo** (upload lên YouTube hoặc Google Drive)

3. **Screenshots** (đặt trong folder `screenshots/`)
   - signup.png
   - login.png
   - profile.png
   - admin-dashboard.png
   - postman-apis.png
   - github-branches.png
   - github-pull-requests.png

4. **README.md** (đã có sẵn)

---

**Chúc bạn hoàn thành dự án thành công! 🎉**

