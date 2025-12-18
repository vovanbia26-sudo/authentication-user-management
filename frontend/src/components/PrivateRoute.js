import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectIsAdmin, selectIsModerator, selectAuthLoading } from '../store/slices/authSlice';

const PrivateRoute = ({ 
  children, 
  adminOnly = false, 
  moderatorOnly = false, 
  adminOrModerator = false 
}) => {
    const location = useLocation();
    
    // Use both Redux and Context for compatibility
    const { isAuthenticated: contextAuth, isAdmin: contextAdmin, loading: contextLoading } = useAuth();
    const reduxAuth = useAppSelector(selectIsAuthenticated);
    const reduxAdmin = useAppSelector(selectIsAdmin);
    const reduxModerator = useAppSelector(selectIsModerator);
    const reduxLoading = useAppSelector(selectAuthLoading);
    
    // Use Redux state if available, fallback to context
    const isAuthenticated = reduxAuth || contextAuth;
    const isAdmin = reduxAdmin || contextAdmin;
    const isModerator = reduxModerator;
    const loading = reduxLoading || contextLoading;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login with return URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (moderatorOnly && !isModerator) {
        return <Navigate to="/" replace />;
    }

    if (adminOrModerator && !isAdmin && !isModerator) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;