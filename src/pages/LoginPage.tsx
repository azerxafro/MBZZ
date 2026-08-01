import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState<'idle' | 'confirm_email' | 'signed_in'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessState('idle');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        // Friendly error messages
        if (error.message.includes('Invalid login')) {
          setError('Invalid email or password. Check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Your email is not yet confirmed. Check your inbox (and spam folder).');
        } else {
          setError(error.message);
        }
      }
    } else {
      const { error, autoSignedIn } = await signUp(email, password, `${SITE_URL}/`);
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else if (error.message.includes('rate limit')) {
          setError('Too many requests. Please wait a minute and try again.');
        } else {
          setError(error.message);
        }
      } else if (autoSignedIn) {
        // Email confirmation is disabled in Supabase — user is immediately signed in
        setSuccessState('signed_in');
      } else {
        // Email confirmation is enabled — user must check inbox
        setSuccessState('confirm_email');
      }
    }
    setLoading(false);
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setError('');
    setSuccessState('idle');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-noise" />

      <div className="login-brand">NETFLIX</div>
      <div className="login-os-tag">NETFLIX_OS v2.077 // NIGHT CITY SECURE NODE</div>

      <div className="login-card">
        <div className="login-card-corner tl" />
        <div className="login-card-corner tr" />
        <div className="login-card-corner bl" />
        <div className="login-card-corner br" />

        <div className="login-title">
          {isLogin ? 'ACCESS_TERMINAL' : 'NEW_USER_INIT'}
        </div>
        <div className="login-subtitle">
          {isLogin ? 'AUTHENTICATE TO ENTER THE STREAM' : 'CREATE YOUR NEURAL PROFILE'}
        </div>

        {/* Confirm email state — full card replacement */}
        {successState === 'confirm_email' ? (
          <div className="login-confirm-state">
            <div className="login-confirm-icon">✉</div>
            <div className="login-confirm-title">CONFIRMATION_LINK_SENT</div>
            <p className="login-confirm-body">
              A confirmation link has been sent to<br />
              <strong style={{ color: 'var(--accent-yellow)' }}>{email}</strong>
            </p>
            <p className="login-confirm-hint">
              Check your <strong>inbox and spam folder</strong>. Click the link to activate your account,
              then come back and sign in.
            </p>
            <button
              className="login-btn"
              style={{ marginTop: 24 }}
              onClick={() => { setSuccessState('idle'); setIsLogin(true); }}
            >
              ▶ BACK TO SIGN IN
            </button>
            <div className="login-resend">
              Didn't get it?{' '}
              <span onClick={handleSubmit as any}>Resend email</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label className="login-label">NEURAL_ID // EMAIL</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@nightcity.net"
                required
                autoComplete="email"
              />
            </div>
            <div className="login-field">
              <label className="login-label">PASSKEY // PASSWORD</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="min. 6 characters"
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <div className="login-error">⚠ {error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? 'AUTHENTICATING...'
                : isLogin
                ? '▶ ENTER THE STREAM'
                : '▶ CREATE PROFILE'}
            </button>
          </form>
        )}

        {successState !== 'confirm_email' && (
          <div className="login-switch">
            {isLogin ? (
              <>NEW TO NIGHT CITY?{' '}
                <span onClick={() => switchMode(false)}>CREATE PROFILE</span>
              </>
            ) : (
              <>ALREADY CONNECTED?{' '}
                <span onClick={() => switchMode(true)}>SIGN IN</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="login-footer">
        <span>BUILD 2.077.01</span>
        <span>NEURAL LINK: STABLE</span>
        <span>DATA SECURE 🔒</span>
      </div>
    </div>
  );
};

export default LoginPage;
