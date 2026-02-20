import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

export default function LoginPage({ navigate }) {
  const { loginUser } = useAuth();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      navigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Left brand panel */}
      <div className="auth-brand-panel">
        <div className="abp-inner">
          <div className="abp-logo">Campus<span>Ride</span></div>
          <h1 className="abp-headline display">
            Share the<br/>commute,<br/><em>save the cost.</em>
          </h1>
          <p className="abp-sub">
            The verified ride-sharing platform built exclusively for college students.
          </p>
          <div className="abp-stats">
            <div><div className="abp-stat-n">4.2K</div><div className="abp-stat-l">Active Riders</div></div>
            <div><div className="abp-stat-n">₹180</div><div className="abp-stat-l">Avg Saved/mo</div></div>
            <div><div className="abp-stat-n">18+</div><div className="abp-stat-l">Colleges</div></div>
          </div>
        </div>
        <div className="abp-glow" />
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <form className="auth-form fade-up" onSubmit={submit} noValidate>
          <div className="af-header">
            <h2 className="heading" style={{fontSize:26}}>Welcome back</h2>
            <p className="text-muted mt-8 text-sm">Sign in to your CampusRide account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label>College Email</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input className="input" type="email" placeholder="you@college.edu"
                value={form.email} onChange={set('email')} autoFocus />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input className="input" type="password" placeholder="Your password"
                value={form.password} onChange={set('password')} />
            </div>
          </div>

          <button type="submit" className={`btn btn-primary btn-lg btn-full mt-8 ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {!loading && 'Sign In →'}
          </button>

          <div className="divider">or</div>

          <p className="text-center text-muted text-sm">
            New here?{' '}
            <button type="button" className="link-btn" onClick={() => navigate('register')}>
              Create account →
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
