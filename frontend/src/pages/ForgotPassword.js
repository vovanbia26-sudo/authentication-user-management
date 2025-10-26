import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success('Reset password email sent! Check your inbox.');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        <h2>Email đã được gửi!</h2>
                        <p>
                            Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong>{email}</strong>
                        </p>
                        <p>Vui lòng kiểm tra email và làm theo hướng dẫn.</p>
                        <Link
                            to="/login"
                            className="auth-button"
                            style={{ textAlign: 'center', display: 'block', marginTop: '1rem' }}
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Quên mật khẩu?</h2>
                <p className="auth-subtitle">
                    Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại.
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                    </button>
                </form>

                <p className="auth-switch">
                    Nhớ mật khẩu?{' '}
                    <Link to="/login" className="auth-link">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;