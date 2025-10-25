# 📋 Hướng dẫn Git Commands

## ✅ Các lệnh bạn cần chạy theo thứ tự:

### 1. Commit code lần đầu

```bash
git add .
git commit -m "Initial commit: Complete Authentication & User Management App with Backend and Frontend"
```

### 2. Kết nối với GitHub repository

```bash
git remote add origin https://github.com/vovanbia26-sudo/authentication-user-management.git
```

### 3. Đổi tên nhánh thành main (nếu đang là master)

```bash
git branch -M main
```

### 4. Push code lên GitHub

```bash
git push -u origin main
```

---

## 🌿 Tạo các nhánh theo yêu cầu (Git Workflow)

### Nhánh 1: backend-auth (Authentication APIs)

```bash
# Tạo và chuyển sang nhánh backend-auth
git checkout -b backend-auth

# Commit (code đã có sẵn)
git add .
git commit -m "Backend: Add Authentication APIs (Sign Up, Login, Logout)"

# Push lên GitHub
git push origin backend-auth
```

### Nhánh 2: backend-admin (Admin & User Management APIs)

```bash
# Quay về main
git checkout main

# Tạo nhánh mới
git checkout -b backend-admin

# Commit
git add .
git commit -m "Backend: Add Admin APIs and User Management (RBAC, User List, Delete)"

# Push
git push origin backend-admin
```

### Nhánh 3: frontend-auth (Login/Signup UI)

```bash
# Quay về main
git checkout main

# Tạo nhánh
git checkout -b frontend-auth

# Commit
git add .
git commit -m "Frontend: Add Authentication UI (Login, Signup, Forgot Password)"

# Push
git push origin frontend-auth
```

### Nhánh 4: frontend-profile (Profile UI)

```bash
# Quay về main
git checkout main

# Tạo nhánh
git checkout -b frontend-profile

# Commit
git add .
git commit -m "Frontend: Add Profile Management UI (View, Update, Avatar Upload)"

# Push
git push origin frontend-profile
```

### Nhánh 5: database-auth (Database Schema)

```bash
# Quay về main
git checkout main

# Tạo nhánh
git checkout -b database-auth

# Commit
git add .
git commit -m "Database: User schema with authentication and role management"

# Push
git push origin database-auth
```

---

## 🔄 Merge các nhánh vào main

### Cách 1: Merge trực tiếp (Local)

```bash
# Quay về main
git checkout main

# Merge backend-auth
git merge backend-auth

# Merge backend-admin
git merge backend-admin

# Merge frontend-auth
git merge frontend-auth

# Merge frontend-profile
git merge frontend-profile

# Merge database-auth
git merge database-auth

# Push tất cả lên GitHub
git push origin main
```

### Cách 2: Pull Request trên GitHub (Khuyến nghị - giống công ty)

1. Truy cập: https://github.com/vovanbia26-sudo/authentication-user-management
2. Click vào tab **"Pull requests"**
3. Click **"New pull request"**
4. Chọn nhánh muốn merge (ví dụ: `backend-auth` → `main`)
5. Click **"Create pull request"**
6. Điền mô tả và click **"Create pull request"**
7. Review code và click **"Merge pull request"**
8. Click **"Confirm merge"**
9. Lặp lại cho các nhánh khác

---

## 📝 Các lệnh Git hữu ích

### Kiểm tra trạng thái

```bash
# Xem trạng thái hiện tại
git status

# Xem danh sách nhánh
git branch

# Xem nhánh hiện tại
git branch --show-current

# Xem lịch sử commit
git log --oneline

# Xem remote repository
git remote -v
```

### Làm việc với nhánh

```bash
# Tạo nhánh mới
git branch ten-nhanh

# Chuyển sang nhánh
git checkout ten-nhanh

# Tạo và chuyển sang nhánh mới (gộp 2 lệnh trên)
git checkout -b ten-nhanh

# Xóa nhánh local
git branch -d ten-nhanh

# Xóa nhánh trên GitHub
git push origin --delete ten-nhanh
```

### Đồng bộ code

```bash
# Lấy code mới nhất từ GitHub
git pull origin main

# Push code lên GitHub
git push origin ten-nhanh
```

### Hoàn tác thay đổi

```bash
# Hoàn tác file chưa add
git checkout -- ten-file

# Hoàn tác file đã add
git reset HEAD ten-file

# Hoàn tác commit cuối (giữ lại thay đổi)
git reset --soft HEAD~1

# Hoàn tác commit cuối (xóa thay đổi)
git reset --hard HEAD~1
```

---

## 🎯 Tóm tắt - Các lệnh chính bạn cần chạy ngay

### Lần đầu tiên - Push code lên GitHub:

```bash
git add .
git commit -m "Initial commit: Complete Authentication & User Management App"
git remote add origin https://github.com/vovanbia26-sudo/authentication-user-management.git
git branch -M main
git push -u origin main
```

### Tạo các nhánh để demo Git Workflow:

```bash
# Nhánh 1: backend-auth
git checkout -b backend-auth
git push origin backend-auth

# Nhánh 2: backend-admin
git checkout main
git checkout -b backend-admin
git push origin backend-admin

# Nhánh 3: frontend-auth
git checkout main
git checkout -b frontend-auth
git push origin frontend-auth

# Nhánh 4: frontend-profile
git checkout main
git checkout -b frontend-profile
git push origin frontend-profile

# Nhánh 5: database-auth
git checkout main
git checkout -b database-auth
git push origin database-auth

# Quay về main
git checkout main
```

Sau đó tạo **Pull Requests** trên GitHub để merge các nhánh vào main!

---

## 🆘 Gặp lỗi?

### Lỗi: "remote origin already exists"
```bash
# Xóa remote cũ
git remote remove origin

# Thêm lại
git remote add origin https://github.com/vovanbia26-sudo/authentication-user-management.git
```

### Lỗi: "branch main already exists"
```bash
# Xóa nhánh main local
git branch -d main

# Hoặc force đổi tên
git branch -M main
```

### Lỗi: "failed to push some refs"
```bash
# Pull code từ GitHub trước
git pull origin main --allow-unrelated-histories

# Rồi push lại
git push origin main
```

---

**Chúc bạn thành công! 🚀**

