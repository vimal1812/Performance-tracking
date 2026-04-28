import { LogOut, User } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/mockDb';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.job_role}</div>
        </div>
        <div style={{ background: 'var(--secondary-color)', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary-color)'}}>
          <User size={20} />
        </div>
        <button className="btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem' }} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
