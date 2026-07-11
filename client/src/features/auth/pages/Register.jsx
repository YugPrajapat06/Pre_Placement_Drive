import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { setError } from '../slices/auth.slice';
import authHero from '../../../assets/auth-hero.png';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const { loading, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Clear errors on mount
  useEffect(() => {
    dispatch(setError(null));
    setValidationError('');
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!username || !email || !mobile || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const number = Number(mobile.replace(/\D/g, ''));
    if (isNaN(number) || mobile.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const role = isAdmin ? 'admin' : 'user';

    const success = await handleRegister({
      username,
      email,
      password,
      number,
      role
    });

    if (success) {
      setUsername('');
      setEmail('');
      setMobile('');
      setPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
      navigate('/home');
    }
  };

  // Shared input style
  const inputStyle = {
    width: '100%',
    borderRadius: '12px', border: 'none',
    background: '#f1f5f9',
    boxShadow: 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff',
    color: '#0f172a', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'box-shadow 0.2s ease',
    fontFamily: "'Inter', sans-serif",
  };

  const onFocusStyle = (e) => {
    e.target.style.boxShadow = 'inset 5px 5px 10px #c8d0db, inset -5px -5px 10px #ffffff, 0 0 0 3px rgba(79,70,229,0.12)';
  };
  const onBlurStyle = (e) => {
    e.target.style.boxShadow = 'inset 4px 4px 8px #cbd5e1, inset -4px -4px 8px #ffffff';
  };

  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: '6px',
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
        {/* Glowing orbs */}
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
        <div className="relative z-10 flex-1 flex items-center justify-center py-6">
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <img
              src={authHero}
              alt="Career Journey Illustration"
              style={{
                width: '100%', borderRadius: '20px',
                boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            />
            {/* Floating badges */}
            <div style={{
              position: 'absolute', top: '-18px', right: '-18px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '14px', padding: '8px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              animation: 'floatUp 3s ease-in-out infinite',
            }}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1rem', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Free</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', margin: 0, fontWeight: 500 }}>Registration</p>
            </div>
            <div style={{
              position: 'absolute', bottom: '-14px', left: '-14px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '14px', padding: '8px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              animation: 'floatUp 3.5s ease-in-out infinite 0.5s',
            }}>
              <p style={{ color: '#fb923c', fontWeight: 800, fontSize: '1rem', margin: 0, fontFamily: "'Outfit', sans-serif" }}>100%</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', margin: 0, fontWeight: 500 }}>Placement Support</p>
            </div>
          </div>
        </div>

        {/* Bottom headline */}
        <div className="relative z-10">
          <h1 style={{ color: 'white', fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.9rem', lineHeight: 1.2, marginBottom: '0.6rem' }}>
            Start Your<br />
            <span style={{ color: '#fb923c' }}>Success Story</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '300px', margin: '0 0 1rem 0' }}>
            Join hundreds of students who landed their dream jobs through our placement drive.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Mock Interviews', 'Aptitude Tests', 'Company Drives'].map((tag) => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px', padding: '4px 14px',
                color: 'rgba(255,255,255,0.9)', fontSize: '0.72rem', fontWeight: 600,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex flex-col justify-center items-center relative overflow-y-auto"
        style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1.5rem' }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(79,70,229,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)',
        }} />

        <div className="relative z-10 w-full" style={{ maxWidth: '440px' }}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 justify-center">
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
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: '2rem', color: '#0f172a', marginBottom: '0.3rem', lineHeight: 1.2,
            }}>
              Create Account 🚀
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
              Begin your placement journey today
            </p>
          </div>

          {/* Error Messages */}
          {(error || validationError) && (
            <div style={{
              marginBottom: '1.25rem', padding: '12px 16px',
              borderRadius: '12px', background: '#fff7ed',
              border: '1px solid rgba(234,88,12,0.3)',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              animation: 'slideIn 0.3s ease-out',
            }}>
              <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '20px', flexShrink: 0 }}>error</span>
              <p style={{ fontSize: '0.85rem', color: '#9a3412', fontWeight: 500, margin: 0 }}>
                {validationError || error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Row: Username + Mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Username */}
              <div>
                <label htmlFor="username" style={labelStyle}>Username</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: '18px', pointerEvents: 'none', userSelect: 'none',
                  }}>person</span>
                  <input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                    style={{ ...inputStyle, padding: '12px 12px 12px 40px', opacity: loading ? 0.6 : 1 }}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" style={labelStyle}>Mobile No.</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: '18px', pointerEvents: 'none', userSelect: 'none',
                  }}>call</span>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit no."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={loading}
                    required
                    style={{ ...inputStyle, padding: '12px 12px 12px 40px', opacity: loading ? 0.6 : 1 }}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" style={labelStyle}>Email Address</label>
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
                  style={{ ...inputStyle, padding: '13px 16px 13px 48px', opacity: loading ? 0.6 : 1 }}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                />
              </div>
            </div>

            {/* Row: Password + Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Password */}
              <div>
                <label htmlFor="password" style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: '18px', pointerEvents: 'none', userSelect: 'none',
                  }}>lock</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    style={{ ...inputStyle, padding: '12px 36px 12px 40px', opacity: loading ? 0.6 : 1 }}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#94a3b8', padding: '2px', display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', userSelect: 'none' }}>
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" style={labelStyle}>Confirm Pwd</label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: '18px', pointerEvents: 'none', userSelect: 'none',
                  }}>lock_reset</span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat pwd"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    style={{ ...inputStyle, padding: '12px 36px 12px 40px', opacity: loading ? 0.6 : 1 }}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#94a3b8', padding: '2px', display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', userSelect: 'none' }}>
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Role Checkbox */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '12px',
              background: isAdmin ? 'rgba(79,70,229,0.06)' : 'rgba(241,245,249,0.8)',
              border: `1px solid ${isAdmin ? 'rgba(79,70,229,0.2)' : '#e2e8f0'}`,
              transition: 'all 0.2s ease', cursor: 'pointer',
            }}
              onClick={() => !loading && setIsAdmin(!isAdmin)}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                background: isAdmin ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#f1f5f9',
                boxShadow: isAdmin
                  ? '0 4px 12px rgba(79,70,229,0.35)'
                  : 'inset 2px 2px 4px #cbd5e1, inset -2px -2px 4px #ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {isAdmin && (
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'white', userSelect: 'none' }}>check</span>
                )}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: isAdmin ? '#4f46e5' : '#374151' }}>
                  Register as Admin
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  Get admin privileges to manage drives
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: 'white',
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem',
                letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 24px rgba(234,88,12,0.35)',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.8 : 1,
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
                  <span>Create Account</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Login Link */}
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
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
              Sign in
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

export default Register;
