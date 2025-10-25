import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData);
            toast.success('Account created successfully!');
            navigate('/profile');
        } catch (error) {
            const message = error.response ? .data ? .message || 'Signup failed';
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
        h2 className = "auth-title" > Sign Up < /h2> <
        p className = "auth-subtitle" > Create your account to get started. < /p>

        <
        form onSubmit = { handleSubmit }
        className = "auth-form" >
        <
        div className = "form-group" >
        <
        label htmlFor = "name" > Full Name < /label> <
        input type = "text"
        id = "name"
        name = "name"
        value = { formData.name }
        onChange = { handleChange }
        placeholder = "Enter your full name"
        required /
        >
        <
        /div>

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
        div className = "form-group" >
        <
        label htmlFor = "confirmPassword" > Confirm Password < /label> <
        input type = "password"
        id = "confirmPassword"
        name = "confirmPassword"
        value = { formData.confirmPassword }
        onChange = { handleChange }
        placeholder = "Confirm your password"
        required minLength = "6" /
        >
        <
        /div>

        <
        button type = "submit"
        className = "auth-button"
        disabled = { loading } > { loading ? 'Creating Account...' : 'Sign Up' } <
        /button> <
        /form>

        <
        p className = "auth-switch" >
        Already have an account ? { ' ' } <
        Link to = "/login"
        className = "auth-link" >
        Login <
        /Link> <
        /p> <
        /div> <
        /div>
    );
};

export default Signup;