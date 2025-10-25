import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return ( <
        nav className = "navbar" >
        <
        div className = "navbar-container" >
        <
        Link to = "/"
        className = "navbar-logo" > 🔐Auth App <
        /Link>

        <
        ul className = "navbar-menu" > {
            isAuthenticated ? ( <
                >
                <
                li >
                <
                Link to = "/profile"
                className = "navbar-link" >
                Profile <
                /Link> <
                /li> {
                    isAdmin && ( <
                        li >
                        <
                        Link to = "/admin"
                        className = "navbar-link" >
                        Admin Dashboard <
                        /Link> <
                        /li>
                    )
                } <
                li >
                <
                span className = "navbar-user" >
                Hello, { user ? .name } { isAdmin && '(Admin)' } <
                /span> <
                /li> <
                li >
                <
                button onClick = { handleLogout }
                className = "navbar-button" >
                Logout <
                /button> <
                /li> <
                />
            ) : ( <
                >
                <
                li >
                <
                Link to = "/login"
                className = "navbar-link" >
                Login <
                /Link> <
                /li> <
                li >
                <
                Link to = "/signup"
                className = "navbar-button-link" >
                Sign Up <
                /Link> <
                /li> <
                />
            )
        } <
        /ul> <
        /div> <
        /nav>
    );
};

export default Navbar;