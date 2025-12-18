import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for rate limiting
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (countdown > 0) {
            toast.warning(`Vui lòng đợi ${countdown} giây trước khi gửi lại`);
            return;
        }

        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
            setCountdown(60); // 60 seconds cooldown
            toast.success('Email đặt lại mật khẩu đã được gửi! Kiểm tra hộp thư của bạn.');
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu';
            toast.error(message);
            
            // If rate limited, set countdown
            if (error.response?.status === 429) {
                setCountdown(60);
            }
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
                        <div className="email-tips">
                            <p><strong>💡 Mẹo:</strong></p>
                            <ul style={{ textAlign: 'left', margin: '10px 0' }}>
                                <li>Kiểm tra thư mục spam/junk</li>
                                <li>Link sẽ hết hạn sau 10 phút</li>
                                <li>Nếu không nhận được, thử gửi lại sau 1 phút</li>
                            </ul>
                        </div>
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

                    <button 
                        type="submit" 
                        className="auth-button" 
                        disabled={loading || countdown > 0}
                    >
                        {loading ? 'Đang gửi...' : 
                         countdown > 0 ? `Đợi ${countdown}s` : 
                         'Gửi liên kết đặt lại'}
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