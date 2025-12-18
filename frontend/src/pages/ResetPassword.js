import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './Auth.css';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Nếu có token truyền qua query, lấy luôn
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token') || '';

    const [token, setToken] = useState(urlToken);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('Reset token is required!');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        <h2>Đặt lại mật khẩu thành công!</h2>
                        <p>Mật khẩu của bạn đã được thay đổi. Đang chuyển hướng đến trang đăng nhập...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Đặt lại mật khẩu</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    {!urlToken && (
                        <div className="form-group">
                            <label htmlFor="token">Mã đặt lại</label>
                            <input
                                type="text"
                                id="token"
                                name="token"
                                value={token}
                                onChange={e => setToken(e.target.value)}
                                placeholder="Nhập mã đặt lại/liên kết email"
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;