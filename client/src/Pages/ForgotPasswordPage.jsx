import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { Box, ArrowLeft } from "lucide-react";
import "../Styles/auth.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation for touched field
    if (touched) {
      setErrors({ email: validateEmail(value) });
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setErrors({ email: validateEmail(email) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark field as touched
    setTouched(true);

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");
    setResetLink("");

    try {
      const response = await authAPI.forgotPassword({ email });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        // For development - show the reset link
        if (response.data.resetLink) {
          setResetLink(response.data.resetLink);
        }
        setEmail("");
        setTouched(false);
      } else {
        setErrors({
          submit: response.data.message || "Failed to send reset link",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Section */}
        <div className="auth-header">
          <div className="logo-container">
            <Box className="logo-icon" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
            {resetLink && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  background: "#f0f9ff",
                  borderRadius: "6px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#0369a1",
                    marginBottom: "8px",
                  }}
                >
                  <strong>Development Mode:</strong> Click the link below to
                  reset your password
                </p>
                <a
                  href={resetLink}
                  style={{
                    color: "#2563eb",
                    textDecoration: "underline",
                    wordBreak: "break-all",
                    fontSize: "13px",
                  }}
                >
                  {resetLink}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Sending Reset Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {/* Back to Login */}
          <div className="auth-footer">
            <Link to="/login" className="back-link">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
