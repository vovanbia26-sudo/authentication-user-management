import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success('Reset password email sent! Check your inbox.');
        } catch (error) {
            const message = error.response ? .data ? .message || 'Failed to send reset email';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return ( <
            div className = "auth-container" >
            <
            div className = "auth-box" >
            <
            div className = "success-message" >
            <
            span className = "success-icon" > ✅ < /span> <
            h2 > Email Sent! < /h2> <
            p >
            We 've sent a password reset link to <strong>{email}</strong> <
            /p> <
            p > Please check your email and follow the instructions. < /p> <
            Link to = "/login"
            className = "auth-button"
            style = {
                { textAlign: 'center', display: 'block', marginTop: '1rem' } } >
            Back to Login <
            /Link> <
            /div> <
            /div> <
            /div>
        );
    }

    return ( <
        div className = "auth-container" >
        <
        div className = "auth-box" >
        <
        h2 className = "auth-title" > Forgot Password ? < /h2> <
        p className = "auth-subtitle" >
        Enter your email and we 'll send you a reset link. <
        /p>

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
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        placeholder = "Enter your email"
        required /
        >
        <
        /div>

        <
        button type = "submit"
        className = "auth-button"
        disabled = { loading } > { loading ? 'Sending...' : 'Send Reset Link' } <
        /button> <
        /form>

        <
        p className = "auth-switch" >
        Remember your password ? { ' ' } <
        Link to = "/login"
        className = "auth-link" >
        Login <
        /Link> <
        /p> <
        /div> <
        /div>
    );
};

export default ForgotPassword;