import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setSuccess('Check your email to confirm your account!');
    }
    setLoading(false);
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
            />
          </div>
          <div className="login-field">
            <label className="login-label">PASSKEY // PASSWORD</label>
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="login-error">⚠ {error}</div>}
          {success && <div className="login-success">✓ {success}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : isLogin ? '▶ ENTER THE STREAM' : '▶ CREATE PROFILE'}
          </button>
        </form>

        <div className="login-switch">
          {isLogin ? (
            <>NEW TO NIGHT CITY?{' '}
              <span onClick={() => { setIsLogin(false); setError(''); }}>
                CREATE PROFILE
              </span>
            </>
          ) : (
            <>ALREADY CONNECTED?{' '}
              <span onClick={() => { setIsLogin(true); setError(''); }}>
                SIGN IN
              </span>
            </>
          )}
        </div>
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
