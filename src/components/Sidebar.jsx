import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Briefcase, Calendar, BarChart2, Users } from 'lucide-react';
import { getCurrentUser } from '../lib/mockDb';

export default function Sidebar() {
  const user = getCurrentUser();
  const isAdmin = user?.system_role === 'admin';
  const basePath = isAdmin ? '/admin' : '/member';

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>PerformTrack</h2>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to={basePath} end className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to={`${basePath}/tasks`} className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
          <CheckSquare size={18} /> Tasks
        </NavLink>
        {isAdmin && (
          <>
            <NavLink to="/admin/projects" className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
              <Briefcase size={18} /> Projects
            </NavLink>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
              <Users size={18} /> User Management
            </NavLink>
          </>
        )}
        <NavLink to={`${basePath}/performance`} className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
          <BarChart2 size={18} /> Team Goals
        </NavLink>
        <NavLink to={`${basePath}/meetings`} className={({isActive}) => isActive ? 'btn-primary' : 'btn-secondary'} style={{justifyContent: 'flex-start'}}>
          <Calendar size={18} /> Meetings
        </NavLink>
      </nav>
    </aside>
  )
}
