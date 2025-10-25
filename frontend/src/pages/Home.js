import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    return ( <
        div className = "home-container" >
        <
        div className = "home-content" >
        <
        h1 className = "home-title" >
        Welcome to Authentication & User Management <
        /h1>

        {
            isAuthenticated ? ( <
                div className = "home-welcome" >
                <
                h2 > Hello, { user ? .name }!👋 < /h2> <
                p > You are successfully logged in . < /p> <
                div className = "home-actions" >
                <
                Link to = "/profile"
                className = "home-button" >
                View Profile <
                /Link> {
                    user ? .role === 'admin' && ( <
                        Link to = "/admin"
                        className = "home-button admin" >
                        Admin Dashboard <
                        /Link>
                    )
                } <
                /div> <
                /div>
            ) : ( <
                div className = "home-cta" >
                <
                p className = "home-description" >
                A complete authentication system with user management features <
                /p> <
                div className = "home-actions" >
                <
                Link to = "/signup"
                className = "home-button" >
                Get Started <
                /Link> <
                Link to = "/login"
                className = "home-button secondary" >
                Login <
                /Link> <
                /div> <
                /div>
            )
        }

        <
        div className = "features" >
        <
        h3 > Features < /h3> <
        div className = "features-grid" >
        <
        div className = "feature-card" >
        <
        span className = "feature-icon" > 🔐 < /span> <
        h4 > Secure Authentication < /h4> <
        p > JWT - based authentication with bcrypt password hashing < /p> <
        /div> <
        div className = "feature-card" >
        <
        span className = "feature-icon" > 👤 < /span> <
        h4 > User Management < /h4> <
        p > Complete profile management with avatar upload < /p> <
        /div> <
        div className = "feature-card" >
        <
        span className = "feature-icon" > 🛡️ < /span> <
        h4 > Role - Based Access < /h4> <
        p > Admin and user roles with permission control < /p> <
        /div> <
        div className = "feature-card" >
        <
        span className = "feature-icon" > 🔑 < /span> <
        h4 > Password Reset < /h4> <
        p > Secure password reset via email < /p> <
        /div> <
        /div> <
        /div> <
        /div> <
        /div>
    );
};

export default Home;