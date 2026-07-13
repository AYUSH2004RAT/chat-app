import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const LoginScreen = () => {
  const { login } = useChat();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }

    setLoading(true);
    try {
      await login(trimmed);
    } catch (err) {
      setError(err.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#6366F1" />
            <path
              d="M12 26 C12 26 14 18 20 18 C26 18 28 26 28 26"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="20" cy="14" r="3" fill="white" />
          </svg>
        </div>
        <h1 className="login-title">ChatFlow</h1>
        <p className="login-subtitle">Real-time messaging, live.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`text-input ${error ? 'input-error' : ''}`}
              placeholder="e.g. ayush_dev"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              maxLength={24}
              autoFocus
              autoComplete="off"
            />
            {error && <span className="error-text">{error}</span>}
            <span className="input-hint">2–24 chars, letters, numbers, underscores only.</span>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              'Join Chat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
