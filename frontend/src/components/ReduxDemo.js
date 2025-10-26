import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/slices/authSlice';
import './ReduxDemo.css';

const ReduxDemo = () => {
    const { user, token, refreshToken, isAuthenticated, loading, error } = useAppSelector(selectAuth);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="redux-demo">
            <h3>🔧 Redux State Monitor</h3>
            
            <div className="redux-section">
                <h4>Authentication Status</h4>
                <div className={`status ${isAuthenticated ? 'authenticated' : 'not-authenticated'}`}>
                    {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                </div>
            </div>

            {user && (
                <div className="redux-section">
                    <h4>User Information</h4>
                    <div className="user-info">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> 
                            <span className={`role ${user.role}`}>{user.role}</span>
                        </p>
                        <p><strong>Avatar:</strong> {user.avatar ? '🖼️ Set' : '❌ None'}</p>
                    </div>
                </div>
            )}

            <div className="redux-section">
                <h4>Tokens</h4>
                <div className="tokens">
                    <p><strong>Access Token:</strong> 
                        <span className={token ? 'token-present' : 'token-missing'}>
                            {token ? `✅ ${token.substring(0, 20)}...` : '❌ No Token'}
                        </span>
                    </p>
                    <p><strong>Refresh Token:</strong> 
                        <span className={refreshToken ? 'token-present' : 'token-missing'}>
                            {refreshToken ? `✅ ${refreshToken.substring(0, 20)}...` : '❌ No Token'}
                        </span>
                    </p>
                </div>
            </div>

            <div className="redux-section">
                <h4>Loading & Error States</h4>
                <div className="states">
                    <p><strong>Loading:</strong> 
                        <span className={loading ? 'loading-active' : 'loading-inactive'}>
                            {loading ? '⏳ Loading...' : '✅ Ready'}
                        </span>
                    </p>
                    {error && (
                        <p><strong>Error:</strong> 
                            <span className="error-message">❌ {error}</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="redux-section">
                <h4>Local Storage</h4>
                <div className="storage">
                    <p><strong>localStorage.token:</strong> 
                        {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
                    </p>
                    <p><strong>localStorage.user:</strong> 
                        {localStorage.getItem('user') ? '✅ Present' : '❌ Missing'}
                    </p>
                    <p><strong>localStorage.refreshToken:</strong> 
                        {localStorage.getItem('refreshToken') ? '✅ Present' : '❌ Missing'}
                    </p>
                </div>
            </div>

            <div className="redux-section">
                <h4>Protected Route Access</h4>
                <div className="route-access">
                    <p><strong>/profile:</strong> 
                        <span className={isAuthenticated ? 'access-granted' : 'access-denied'}>
                            {isAuthenticated ? '✅ Accessible' : '❌ Blocked'}
                        </span>
                    </p>
                    <p><strong>/admin:</strong> 
                        <span className={user?.role === 'admin' ? 'access-granted' : 'access-denied'}>
                            {user?.role === 'admin' ? '✅ Accessible' : '❌ Blocked'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReduxDemo;
