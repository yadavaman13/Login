import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Box } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import '../Styles/auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({});

    // Check if there's a redirect message
    const redirectMessage = location.state?.message;

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password)
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Real-time validation for touched fields
        if (touched[name]) {
            if (name === 'email') {
                setErrors(prev => ({ ...prev, email: validateEmail(value) }));
            } else if (name === 'password') {
                setErrors(prev => ({ ...prev, password: validatePassword(value) }));
            }
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        if (name === 'email') {
            setErrors(prev => ({ ...prev, email: validateEmail(value) }));
        } else if (name === 'password') {
            setErrors(prev => ({ ...prev, password: validatePassword(value) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({ email: true, password: true });
        
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors(prev => ({ ...prev, submit: '' }));
        
        try {
            // Call the actual login API
            const response = await authAPI.login({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe
            });
            
            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                
                // Small delay to ensure localStorage is written
                setTimeout(() => {
                    // Redirect to home/dashboard after successful login
                    navigate('/dashboard');
                }, 100);
            } else {
                setErrors(prev => ({ 
                    ...prev, 
                    submit: response.data.message || 'Login failed. Please try again.' 
                }));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.';
            setErrors(prev => ({ 
                ...prev, 
                submit: errorMessage 
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setErrors(prev => ({ ...prev, submit: '' }));
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Get the Firebase ID token
            const idToken = await user.getIdToken();
            
            // Send the token to your backend for verification (optional)
            // You can create an endpoint on your backend to verify the Firebase token
            // and create a session or JWT token for your app
            
            // For now, store user info locally
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            };
            
            localStorage.setItem('token', idToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('authProvider', 'google');
            
            // Redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
            
        } catch (error) {
            let errorMessage = 'Failed to sign in with Google. Please try again.';
            
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in popup was closed. Please try again.';
            } else if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = 'Sign-in was cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up was blocked by browser. Please allow pop-ups for this site.';
            }
            
            setErrors(prev => ({ 
                ...prev, 
                submit: errorMessage
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background Elements */}
            <div className="auth-bg-shapes">
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>
                <div className="auth-shape auth-shape-3"></div>
            </div>

            {/* Navbar */}
            <nav className="auth-navbar">
                <Link to="/" className="auth-logo">
                    <div className="logo-icon">
                        <Box size={24} />
                    </div>
                    <span className="logo-text">RentFlow</span>
                </Link>
                <Link to="/" className="home-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Home
                </Link>
            </nav>

            {/* Main Content */}
            <div className="auth-container">
                <div className="auth-card animate-slide-up">
                    {/* Card Header */}
                    <div className="auth-header">
                        <div className="auth-icon-wrapper">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue to your dashboard</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Redirect Message */}
                        {redirectMessage && (
                            <div className="form-error-banner" style={{ 
                                background: location.state?.type === 'success' 
                                    ? 'rgba(16, 185, 129, 0.1)' 
                                    : 'rgba(245, 158, 11, 0.1)', 
                                borderColor: location.state?.type === 'success' 
                                    ? 'rgba(16, 185, 129, 0.3)' 
                                    : 'rgba(245, 158, 11, 0.3)',
                                color: location.state?.type === 'success' 
                                    ? '#059669' 
                                    : '#D97706'
                            }}>
                                {location.state?.type === 'success' ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                    </svg>
                                )}
                                <span>{redirectMessage}</span>
                            </div>
                        )}

                        {errors.submit && (
                            <div className="form-error-banner">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                </svg>
                                <span>{errors.submit}</span>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''} ${formData.email && !errors.email ? 'is-valid' : ''}`}>
                            <label htmlFor="email" className="form-label">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Email Address
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete="email"
                                />
                                {formData.email && !errors.email && (
                                    <span className="input-icon valid">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                )}
                            </div>
                            {errors.email && touched.email && (
                                <span className="form-error">{errors.email}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className={`form-group ${errors.password && touched.password ? 'has-error' : ''}`}>
                            <label htmlFor="password" className="form-label">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <span className="form-error">{errors.password}</span>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                                />
                                <span className="checkmark"></span>
                                <span className="checkbox-label">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`auth-submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        {/* Google Sign In Button */}
                        <button 
                            type="button" 
                            className="google-signin-btn"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
                                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
                                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04"/>
                                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="auth-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
            </div>
        </div>
    );
};

export default LoginPage;
