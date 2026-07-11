import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { setError } from '../slices/auth.slice';
import authHero from '../../../assets/auth-hero.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear errors on mount
  useEffect(() => {
    dispatch(setError(null));
    setValidationError('');
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const success = await handleLogin({ email, password });
    if (success) {
      setEmail('');
      setPassword('');
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{
          width: '45%',
          background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 50%, #7c3aed 100%)',
          padding: '3rem',
        }}
      >
        {/* Glowing background orbs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(249,115,22,0.4)',
          }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '22px' }}>rocket_launch</span>
          </div>
          <div>
            <p style={{ color: 'white', fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2, margin: 0 }}>
              Pre Placement
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', margin: 0 }}>
              DRIVE PLATFORM
            </p>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-8">
          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <img
              src={authHero}
              alt="Career Journey Illustration"
              style={{
                width: '100%', borderRadius: '20px',
                boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            />
            {/* Floating stat badges */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '14px', padding: '10px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              animation: 'floatUp 3s ease-in-out infinite',
            }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0, fontFamily: "'Outfit', sans-serif" }}>500+</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 500 }}>Students Placed</p>
            </div>
            <div style={{
              position: 'absolute', bottom: '-16px', left: '-16px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '14px', padding: '10px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              animation: 'floatUp 3.5s ease-in-out infinite 0.5s',
            }}>
              <p style={{ color: '#fb923c', fontWeight: 800, fontSize: '1.1rem', margin: 0, fontFamily: "'Outfit', sans-serif" }}>50+</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', margin: 0, fontWeight: 500 }}>Top Companies</p>
            </div>
          </div>
        </div>

        {/* Bottom headline */}
        <div className="relative z-10">
          <h1 style={{ color: 'white', fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '2rem', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Launch Your<br />
            <span style={{ color: '#fb923c' }}>Career Journey</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '320px', margin: '0 0 1rem 0' }}>
            Access live assessments, connect with top companies, and track your placement progress — all in one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Live Assessments', 'Interview Prep', 'Resume Builder'].map((tag) => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px', padding: '4px 14px',
                color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem', fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative"
        style={{ background: '#f8fafc', minHeight: '100vh' }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(79,70,229,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)',
        }} />

        <div className="relative z-10 w-full" style={{ maxWidth: '420px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>rocket_launch</span>
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#1e1b4b' }}>
              Pre Placement Drive
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: '2.2rem', color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.2,
            }}>
              Welcome Back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>
              Sign in to continue your placement journey
            </p>
          </div>

          {/* Error Messages */}
          {(error || validationError) && (
            <div style={{
              marginBottom: '1.5rem', padding: '14px 16px',
              borderRadius: '12px', background: '#fff7ed',
              border: '1px solid rgba(234,88,12,0.3)',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              animation: 'slideIn 0.3s ease-out',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '20px', flexShrink: 0 }}>error</span>
              <p style={{ fontSize: '0.875rem', color: '#9a3412', fontWeight: 500, margin: 0 }}>
                {validationError || error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Email Field */}
            <div>
              <label htmlFor="email" style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 700,
                color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '20px', pointerEvents: 'none', userSelect: 'none',
                }}>mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  style={{
                    width: '100%', padding: '14px 16px 14px 48px',
                    borderRadius: '12px', border: 'none',
                    background: '#f1f5f9',
                    boxShadow: 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff',
                    color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'box-shadow 0.2s ease',
                    fontFamily: "'Inter', sans-serif",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = 'inset 5px 5px 10px #c8d0db, inset -5px -5px 10px #ffffff, 0 0 0 3px rgba(79,70,229,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{
                display: 'block', fontSize: '0.75rem', fontWeight: 700,
                color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: '20px', pointerEvents: 'none', userSelect: 'none',
                }}>lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  style={{
                    width: '100%', padding: '14px 48px 14px 48px',
                    borderRadius: '12px', border: 'none',
                    background: '#f1f5f9',
                    boxShadow: 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff',
                    color: '#0f172a', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'box-shadow 0.2s ease',
                    fontFamily: "'Inter', sans-serif",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = 'inset 5px 5px 10px #c8d0db, inset -5px -5px 10px #ffffff, 0 0 0 3px rgba(79,70,229,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', padding: '4px', display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', userSelect: 'none' }}>
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: 'white',
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem',
                letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 24px rgba(234,88,12,0.35)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.8 : 1,
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(234,88,12,0.45)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(234,88,12,0.35)';
                }
              }}
            >
              {loading ? (
                <div style={{
                  width: '20px', height: '20px', border: '2.5px solid white',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.75rem 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Register Link */}
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#4f46e5', fontWeight: 700, fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif", padding: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#6d28d9';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#4f46e5';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Create account
            </button>
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
