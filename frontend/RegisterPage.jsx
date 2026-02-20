import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPages.css';

const ROLES = [
  { value:'seeker',   icon:'🎒', title:'Seeker',   desc:'I need rides' },
  { value:'provider', icon:'🚗', title:'Provider', desc:'I offer rides' },
  { value:'both',     icon:'🔄', title:'Both',     desc:'Flexible' },
];

export default function RegisterPage({ navigate }) {
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', college:'', role:'seeker' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())    return 'Name is required';
    if (!form.email.trim())   return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (!form.phone.trim())   return 'Phone number is required';
    if (!form.college.trim()) return 'College name is required';
    return null;
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      await registerUser(form);
      navigate('dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Left panel */}
      <div className="auth-brand-panel">
        <div className="abp-inner">
          <div className="abp-logo">Campus<span>Ride</span></div>
          <h1 className="abp-headline display">
            Join your<br/>campus<br/><em>ride network.</em>
          </h1>
          <p className="abp-sub">Verified accounts, real students, zero hassle.</p>
          <div className="abp-steps">
            {[
              { n:'1', t:'Create account' },
              { n:'2', t:'Choose your role' },
              { n:'3', t:'Start riding' },
            ].map(s => (
              <div key={s.n} className="abp-step">
                <div className="abp-step-n">{s.n}</div>
                <span style={{fontSize:14, fontWeight:500}}>{s.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="abp-glow" />
      </div>

      {/* Right form */}
      <div className="auth-form-panel">
        <form className="auth-form fade-up" onSubmit={submit} noValidate>
          <div className="af-header">
            <h2 className="heading" style={{fontSize:26}}>Create account</h2>
            <p className="text-muted mt-8 text-sm">Join thousands of campus commuters</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="grid-2">
            <div className="field">
              <label>Full Name</label>
              <input className="input" placeholder="Arjun Sharma" value={form.name} onChange={set('name')} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div className="field">
            <label>College Email</label>
            <input className="input" type="email" placeholder="you@college.edu" value={form.email} onChange={set('email')} />
          </div>

          <div className="field">
            <label>College / University</label>
            <input className="input" placeholder="IIT Bombay, BITS Pilani…" value={form.college} onChange={set('college')} />
          </div>

          {/* Role selector */}
          <div className="field">
            <label>I want to</label>
            <div className="role-grid">
              {ROLES.map(r => (
                <button key={r.value} type="button"
                  className={`role-card ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}>
                  <span className="rc-r-icon">{r.icon}</span>
                  <span className="rc-r-title">{r.title}</span>
                  <span className="rc-r-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
          </div>

          <button type="submit" className={`btn btn-primary btn-lg btn-full mt-8 ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {!loading && 'Create Account →'}
          </button>

          <p className="text-center text-muted text-sm mt-16">
            Already have an account?{' '}
            <button type="button" className="link-btn" onClick={() => navigate('login')}>Sign in</button>
          </p>
        </form>
      </div>
    </div>
  );
}
