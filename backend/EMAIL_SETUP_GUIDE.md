# 📧 HƯỚNG DẪN CẤU HÌNH EMAIL GMAIL SMTP

## 🔧 **Bước 1: Tạo App Password Gmail**

### **1.1. Bật 2-Factor Authentication**
1. Vào **Google Account**: https://myaccount.google.com/
2. **Security** → **2-Step Verification** → **Turn On**
3. Xác thực bằng số điện thoại

### **1.2. Tạo App Password**
1. **Security** → **2-Step Verification** → **App passwords**
2. **Select app**: Mail
3. **Select device**: Other (Custom name) → Nhập "Node.js App"
4. **Generate** → Copy mật khẩu 16 ký tự

## 🔧 **Bước 2: Cấu hình .env**

Thêm vào file `backend/.env`:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=Authentication App

# Client URL for reset links
CLIENT_URL=http://localhost:3000
```

## 🧪 **Bước 3: Test Email**

### **3.1. Test API Forgot Password**
```
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@gmail.com"
}
```

### **3.2. Expected Response**
```json
{
  "success": true,
  "message": "Reset password email sent"
}
```

### **3.3. Check Email**
- Kiểm tra hộp thư đến
- Click link reset password
- Link format: `http://localhost:3000/reset-password/TOKEN`

## 🔧 **Bước 4: Troubleshooting**

### **Lỗi thường gặp:**

**1. "Invalid login"**
- ✅ Kiểm tra email và app password đúng
- ✅ Bật 2-Factor Authentication
- ✅ Tạo lại App Password

**2. "Connection timeout"**
- ✅ Kiểm tra firewall/antivirus
- ✅ Thử port 465 với secure: true

**3. "Email not sent"**
- ✅ Kiểm tra EMAIL_HOST, EMAIL_PORT
- ✅ Kiểm tra internet connection

## 📧 **Alternative Email Services**

### **Mailtrap (Development)**
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

### **SendGrid**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## ✅ **Test Checklist**

- [ ] Gmail 2FA enabled
- [ ] App password created
- [ ] .env configured correctly
- [ ] Server restarted
- [ ] API test successful
- [ ] Email received
- [ ] Reset link works
- [ ] Password reset successful

---

**🎯 Mục tiêu**: Gửi email thật với token reset password, tăng tính bảo mật!
