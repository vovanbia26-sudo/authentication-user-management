import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError, selectAuth } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Redux state
    const { loading, error, isAuthenticated, user } = useAppSelector(selectAuth);
    
    // Context fallback
    const { login: contextLogin } = useAuth();
    
    // Get return URL from location state
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Clear error when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            toast.success(`Welcome back, ${user.name}!`);
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, from]);

    // Handle Redux login errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Try Redux login first
            const result = await dispatch(loginUser(formData)).unwrap();
            toast.success(`Welcome, ${result.user.name}!`);
            
            // Show Redux state info for demo
            console.log('🎯 Redux Login Success:', {
                user: result.user,
                token: result.token ? 'Token saved' : 'No token',
                isAuthenticated: true
            });
            
            navigate(from, { replace: true });
        } catch (reduxError) {
            // Fallback to context login
            try {
                await contextLogin(formData);
                toast.success('Login successful (Context fallback)!');
                navigate(from, { replace: true });
            } catch (contextError) {
                const message = contextError.response?.data?.message || reduxError || 'Login failed';
                toast.error(message);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Đăng nhập</h2>
                <p className="auth-subtitle">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
                
                {/* Redux State Demo */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ 
                        background: '#f0f8ff', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginBottom: '15px',
                        fontSize: '12px',
                        border: '1px solid #007bff'
                    }}>
                        <strong>🔧 Redux State Demo:</strong><br/>
                        <span style={{ color: isAuthenticated ? 'green' : 'red' }}>
                            Auth: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}
                        </span><br/>
                        {user && <span style={{ color: 'blue' }}>User: {user.name} ({user.role})</span>}<br/>
                        {loading && <span style={{ color: 'orange' }}>Loading: ⏳ Processing...</span>}<br/>
                        {error && <span style={{ color: 'red' }}>Error: {error}</span>}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu của bạn"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="forgot-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="auth-switch">
                    Chưa có tài khoản?{' '}
                    <Link to="/signup" className="auth-link">
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;