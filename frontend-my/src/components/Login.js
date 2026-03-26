import React, { useState } from 'react';
import './Login.css';
import reviewService from '../services/reviewService';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const generateDeviceHash = () => {
    let hash = localStorage.getItem('deviceHash');
    if (!hash) {
      hash = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('deviceHash', hash);
    }
    return hash;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const deviceHash = generateDeviceHash();
      console.log('Logging in with:', { email, deviceHash });
      
      const data = await reviewService.login(email, deviceHash);
      console.log('Login response:', data);
      
      if (data && data.userId) {
        onLogin({ id: data.userId, email });
      } else {
        setError(data?.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate email
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Validate password
      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const deviceHash = generateDeviceHash();
      console.log('Signing up with:', { email, password, deviceHash });
      
      // First, check if user exists by trying to login
      const loginData = await reviewService.login(email, deviceHash);
      
      if (loginData && loginData.userId) {
        // User already exists
        setError('An account with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }
      
      // For now, since we don't have a proper signup endpoint yet,
      // we'll create a new user via login (which creates a new user automatically)
      const newUserData = await reviewService.login(email, deviceHash);
      
      if (newUserData && newUserData.userId) {
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(() => {
          onLogin({ id: newUserData.userId, email });
        }, 1500);
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isLogin ? handleLogin : handleSignUp;

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
        <p className="login-subtitle">
          {isLogin 
            ? 'Login to continue to ReviewSaver' 
            : 'Join India\'s #1 Review Platform'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder={isLogin ? "Enter your password" : "Create a password (min. 6 characters)"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {!isLogin && (
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <div className="login-footer">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={switchMode} className="switch-mode-btn" disabled={loading}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        {isLogin && (
          <p className="demo-note">
            <span className="demo-badge">Demo</span>
            Any email works - we'll create an account automatically!
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
