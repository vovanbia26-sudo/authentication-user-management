import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin, isModerator, isAdminOrModerator } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🔐 Ứng dụng Xác thực
                </Link>

                <ul className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/profile" className="navbar-link">
                                    Hồ sơ
                                </Link>
                            </li>
                            {isAdminOrModerator && (
                                <li>
                                    <Link to="/admin" className="navbar-link">
                                        {isAdmin ? 'Bảng điều khiển Admin' : 'Bảng điều khiển Moderator'}
                                    </Link>
                                </li>
                            )}
                            <li>
                                <span className="navbar-user">
                                    Xin chào, {user?.name} 
                                    {isAdmin && ' (Admin)'}
                                    {isModerator && ' (Moderator)'}
                                </span>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="navbar-button">
                                    Đăng xuất
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="navbar-link">
                                    Đăng nhập
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="navbar-button-link">
                                    Đăng ký
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;