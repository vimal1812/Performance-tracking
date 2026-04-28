import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/mockDb';
import { LayoutDashboard } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    const { user, error } = await login(email, password);
    setLoading(false);
    
    if (error) {
      setError(error);
    } else if (user) {
      if (user.system_role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@perform.com');
    } else {
      setEmail('dev@perform.com');
    }
    setPassword('password123');
  }

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--secondary-color)', borderRadius: '50%', color: 'var(--primary-color)', marginBottom: '1rem' }}>
             <LayoutDashboard size={32} />
           </div>
           <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
           <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue tracking performance</p>
        </div>
        
        {error && (
          <div style={{ background: 'hsla(350, 70%, 55%, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="you@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Demo Accounts</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button className="btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => setDemoCredentials('admin')}>Admin Login</button>
            <button className="btn-secondary" style={{ fontSize: '0.75rem' }} onClick={() => setDemoCredentials('member')}>Member Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}
