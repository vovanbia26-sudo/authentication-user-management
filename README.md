# 🔐 Authentication & User Management

Ứng dụng web hoàn chỉnh với **Authentication** và **User Management** được xây dựng bằng **Node.js**, **Express**, **MongoDB**, và **React**.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [API Endpoints](#-api-endpoints)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Git Workflow](#-git-workflow)
- [Screenshots](#-screenshots)

## ✨ Tính năng

### Authentication
- ✅ **Đăng ký (Sign Up)** - Tạo tài khoản mới với kiểm tra email trùng
- ✅ **Đăng nhập (Login)** - Xác thực với JWT token
- ✅ **Đăng xuất (Logout)** - Xóa token phía client
- ✅ **Quên mật khẩu (Forgot Password)** - Gửi email reset password
- ✅ **Đặt lại mật khẩu (Reset Password)** - Đổi mật khẩu với token

### User Management
- ✅ **Xem thông tin cá nhân** - Hiển thị profile user
- ✅ **Cập nhật thông tin** - Sửa name, email, password
- ✅ **Upload Avatar** - Tải lên và cập nhật ảnh đại diện
- ✅ **Xóa tài khoản** - User tự xóa hoặc Admin xóa

### Admin Features
- ✅ **Danh sách người dùng** - Xem tất cả users
- ✅ **Phân quyền RBAC** - Role: User và Admin
- ✅ **Quản lý users** - Xóa user, thay đổi role

### Bảo mật
- 🔒 Mã hóa mật khẩu với **bcrypt**
- 🔑 JWT-based authentication
- 🛡️ Protected routes với middleware
- 🎭 Role-based access control (RBAC)

## 🛠 Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Nodemailer** - Email service
- **Cloudinary** - Image upload
- **Multer** - File upload middleware

### Frontend
- **React** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **CSS3** - Styling

## 📦 Cài đặt

### Yêu cầu
- Node.js (v14 trở lên)
- MongoDB (local hoặc cloud - MongoDB Atlas)
- npm hoặc yarn

### 1. Clone repository

```bash
git clone https://github.com/vovanbia26-sudo/authentication-user-management.git
cd authentication-user-management
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình Backend

Tạo file `.env` trong thư mục `backend/`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/auth_user_management

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (cho Forgot Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com

# Cloudinary Configuration (cho Avatar Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Lưu ý:**
- Thay đổi `JWT_SECRET` thành chuỗi bí mật của bạn
- Cấu hình email (Gmail): Cần tạo App Password tại https://myaccount.google.com/apppasswords
- Cấu hình Cloudinary: Đăng ký tại https://cloudinary.com/ để lấy credentials

### 4. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### 5. Cấu hình Frontend

File `.env` đã được tạo tự động trong `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Chạy ứng dụng

### Chạy Backend

```bash
cd backend
npm run dev
```

Server sẽ chạy tại: **http://localhost:5000**

### Chạy Frontend

Mở terminal mới:

```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

### Chạy MongoDB (nếu dùng local)

```bash
mongod
```

Hoặc sử dụng **MongoDB Atlas** (cloud database - khuyến nghị)

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Đăng ký user mới | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/logout` | Đăng xuất | Private |
| POST | `/api/auth/forgot-password` | Quên mật khẩu | Public |
| PUT | `/api/auth/reset-password/:token` | Reset mật khẩu | Public |

### User Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Lấy thông tin user | Private |
| PUT | `/api/users/profile` | Cập nhật profile | Private |
| POST | `/api/users/upload-avatar` | Upload avatar | Private |
| GET | `/api/users` | Lấy danh sách users | Admin |
| GET | `/api/users/:id` | Lấy user theo ID | Admin |
| DELETE | `/api/users/:id` | Xóa user | Admin/Owner |
| PUT | `/api/users/:id/role` | Cập nhật role | Admin |

### Test API với Postman

1. Import collection từ thư mục `postman/` (nếu có)
2. Hoặc test thủ công:

**Đăng ký:**
```json
POST http://localhost:5000/api/auth/signup
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

**Đăng nhập:**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Lấy profile (cần token):**
```
GET http://localhost:5000/api/users/profile
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📁 Cấu trúc dự án

```
authentication-user-management/
├── backend/
│   ├── config/
│   │   ├── database.js          # Kết nối MongoDB
│   │   └── cloudinary.js        # Cấu hình Cloudinary
│   ├── controllers/
│   │   ├── authController.js    # Logic authentication
│   │   └── userController.js    # Logic user management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth routes
│   │   └── userRoutes.js        # User routes
│   ├── utils/
│   │   └── sendEmail.js         # Email service
│   ├── uploads/                 # Temporary upload folder
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   ├── PrivateRoute.js  # Protected route component
│   │   │   ├── Loading.js       # Loading component
│   │   │   └── Loading.css
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.js          # Home page
│   │   │   ├── Home.css
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Signup.js        # Signup page
│   │   │   ├── Auth.css         # Auth pages styles
│   │   │   ├── ForgotPassword.js
│   │   │   ├── ResetPassword.js
│   │   │   ├── Profile.js       # User profile page
│   │   │   ├── Profile.css
│   │   │   ├── AdminDashboard.js # Admin dashboard
│   │   │   └── AdminDashboard.css
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js   # Auth API calls
│   │   │   └── userService.js   # User API calls
│   │   ├── App.js               # Main app component
│   │   ├── App.css
│   │   └── index.js
│   ├── .env                     # Frontend env variables
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🌿 Git Workflow

### Các nhánh chính

- **main** - Nhánh ổn định, production-ready
- **backend-auth** - API Authentication
- **backend-admin** - API Admin & User Management
- **frontend-auth** - UI Authentication (Login, Signup)
- **frontend-profile** - UI Profile Management
- **database-auth** - Database schema & testing

### Workflow chuẩn

1. **Tạo nhánh mới từ main:**
```bash
git checkout -b feature-name
```

2. **Làm việc và commit:**
```bash
git add .
git commit -m "Mô tả thay đổi"
```

3. **Push lên GitHub:**
```bash
git push origin feature-name
```

4. **Tạo Pull Request trên GitHub**

5. **Review và Merge vào main**

### Các lệnh Git cơ bản cho dự án này

```bash
# Khởi tạo và commit lần đầu
git add .
git commit -m "Initial commit: Backend and Frontend setup"

# Kết nối với GitHub
git remote add origin https://github.com/vovanbia26-sudo/authentication-user-management.git

# Push lên GitHub (lần đầu)
git branch -M main
git push -u origin main

# Tạo và chuyển sang nhánh mới
git checkout -b backend-auth

# Commit và push nhánh
git add .
git commit -m "Add authentication APIs"
git push origin backend-auth

# Quay về main và merge
git checkout main
git merge backend-auth
git push origin main
```

## 📸 Screenshots

### 1. Trang chủ (Home)
![Home Page](screenshots/home.png)

### 2. Đăng ký (Sign Up)
![Sign Up](screenshots/signup.png)

### 3. Đăng nhập (Login)
![Login](screenshots/login.png)

### 4. Profile
![Profile](screenshots/profile.png)

### 5. Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

### 6. Postman API Testing
![Postman](screenshots/postman.png)

## 🧪 Testing

### Test bằng Postman

1. Đăng ký user thường:
```json
POST /api/auth/signup
{
  "name": "Test User",
  "email": "user@test.com",
  "password": "123456"
}
```

2. Đăng ký admin:
```json
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

3. Test tất cả endpoints như mô tả trong phần [API Endpoints](#-api-endpoints)

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Giải pháp:** Đảm bảo MongoDB đang chạy hoặc sử dụng MongoDB Atlas

### Lỗi CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Giải pháp:** Kiểm tra `CLIENT_URL` trong backend `.env` đúng với frontend URL

### Lỗi JWT
```
Error: jwt malformed
```
**Giải pháp:** Xóa token cũ trong localStorage và đăng nhập lại

## 📝 Tác giả

**Buổi 5 - Bài tập nhóm Authentication & User Management**

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập

---

## 🙏 Acknowledgments

- Node.js & Express documentation
- React documentation
- MongoDB documentation
- Cloudinary documentation

---

**Happy Coding! 🚀**

