import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">
                    Chào mừng đến với Hệ thống Xác thực & Quản lý Người dùng
                </h1>

                {isAuthenticated ? (
                    <div className="home-welcome">
                        <h2>Xin chào, {user?.name}! 👋</h2>
                        <p>Bạn đã đăng nhập thành công.</p>
                        <div className="home-actions">
                            <Link to="/profile" className="home-button">
                                Xem Hồ sơ
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="home-button admin">
                                    Bảng điều khiển Admin
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="home-cta">
                        <p className="home-description">
                            Hệ thống xác thực hoàn chỉnh với các tính năng quản lý người dùng
                        </p>
                        <div className="home-actions">
                            <Link to="/signup" className="home-button">
                                Bắt đầu
                            </Link>
                            <Link to="/login" className="home-button secondary">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                )}

                <div className="features">
                    <h3>Tính năng</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">🔐</span>
                            <h4>Xác thực Bảo mật</h4>
                            <p>Xác thực dựa trên JWT với mã hóa mật khẩu bcrypt</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">👤</span>
                            <h4>Quản lý Người dùng</h4>
                            <p>Quản lý hồ sơ hoàn chỉnh với tải lên avatar</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🛡️</span>
                            <h4>Phân quyền Theo Vai trò</h4>
                            <p>Vai trò Admin và User với kiểm soát quyền hạn</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🔑</span>
                            <h4>Đặt lại Mật khẩu</h4>
                            <p>Đặt lại mật khẩu an toàn qua email</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;