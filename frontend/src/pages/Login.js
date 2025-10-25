import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success('Login successful!');
            navigate('/profile');
        } catch (error) {
            const message = error.response ? .data ? .message || 'Login failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return ( <
        div className = "auth-container" >
        <
        div className = "auth-box" >
        <
        h2 className = "auth-title" > Login < /h2> <
        p className = "auth-subtitle" > Welcome back!Please login to your account. < /p>

        <
        form onSubmit = { handleSubmit }
        className = "auth-form" >
        <
        div className = "form-group" >
        <
        label htmlFor = "email" > Email < /label> <
        input type = "email"
        id = "email"
        name = "email"
        value = { formData.email }
        onChange = { handleChange }
        placeholder = "Enter your email"
        required /
        >
        <
        /div>

        <
        div className = "form-group" >
        <
        label htmlFor = "password" > Password < /label> <
        input type = "password"
        id = "password"
        name = "password"
        value = { formData.password }
        onChange = { handleChange }
        placeholder = "Enter your password"
        required minLength = "6" /
        >
        <
        /div>

        <
        div className = "form-footer" >
        <
        Link to = "/forgot-password"
        className = "forgot-link" >
        Forgot Password ?
        <
        /Link> <
        /div>

        <
        button type = "submit"
        className = "auth-button"
        disabled = { loading } > { loading ? 'Logging in...' : 'Login' } <
        /button> <
        /form>

        <
        p className = "auth-switch" >
        Don 't have an account?{'
        '} <
        Link to = "/signup"
        className = "auth-link" >
        Sign Up <
        /Link> <
        /p> <
        /div> <
        /div>
    );
};

export default Login;