'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { ANIMATION_CONFIG } from '@/config/animation';
import { ambientAudio } from '@/lib/ambient-sound';

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = ANIMATION_CONFIG.auth.sessionRedirectUrl;
      }
    } catch {
      setErrorMessage('Network error during authentication. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card" role="region" aria-label="Single-User Authentication">
      <div className="login-header">
        <div className="hud-label" style={{ justifyContent: 'center', marginBottom: '0.25rem' }}>
          <span className="hud-indicator-dot" />
          Access Verification
        </div>
        <h2 className="login-title">Portfolio Entry</h2>
        <p className="login-subtitle">Single Authorized Session</p>
      </div>

      <div className="hud-divider" />

      {errorMessage && (
        <div className="auth-error-badge" role="alert">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="form-group">
          <label htmlFor="phone-input" className="form-label">
            Phone Number
          </label>
          <div className="input-container">
            <input
              id="phone-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter the phone number"
              autoComplete="tel"
              required
              className="form-input"
              disabled={isLoading}
            />
            <div style={{ position: 'absolute', right: '0.85rem', color: 'var(--text-muted)' }}>
              <Phone size={16} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password-input" className="form-label">
            Password
          </label>
          <div className="input-container">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the Password"
              autoComplete="current-password"
              required
              className="form-input"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-action-btn"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          onMouseEnter={() => ambientAudio.playHoverSound()}
          className="login-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Authenticate</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
        <span className="hud-center-code">SECURE PROTOCOL • SUPABASE AUTH</span>
      </div>
    </div>
  );
};
