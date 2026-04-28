import { useState, useEffect } from 'react';
import { getTasks, getCurrentUser } from '../lib/mockDb';
import { Target, CheckSquare, Award } from 'lucide-react';

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalPoints: 0, completedCount: 0 });
  const user = getCurrentUser();

  useEffect(() => {
    if(!user) return;
    const allTasks = getTasks().filter(t => t.assigned_to === user.id);
    setTasks(allTasks);
    
    const completed = allTasks.filter(t => t.status === 'Completed');
    const points = completed.reduce((acc, curr) => acc + curr.priority_points, 0);

    setStats({
      completedCount: completed.length,
      totalPoints: points
    });
  }, [user]);

  return (
    <div>
       <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Welcome, {user?.name}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Here relates to your personal performance and task assignments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
         <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }} className="badge-warning">
             <CheckSquare size={24} />
           </div>
           <div>
             <p className="label" style={{ marginBottom: 0 }}>Assigned Tasks</p>
             <h3 style={{ fontSize: '1.5rem' }}>{tasks.length}</h3>
           </div>
         </div>
         <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }} className="badge-success">
             <Award size={24} />
           </div>
           <div>
             <p className="label" style={{ marginBottom: 0 }}>Total Points Earned</p>
             <h3 style={{ fontSize: '1.5rem' }}>{stats.totalPoints}</h3>
           </div>
         </div>
         <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }} className="badge-neutral">
             <Target size={24} />
           </div>
           <div>
             <p className="label" style={{ marginBottom: 0 }}>Goal Contribution</p>
             <h3 style={{ fontSize: '1.5rem' }}>{(stats.totalPoints / 50 * 100).toFixed(0)}%</h3>
           </div>
         </div>
      </div>

       <div className="glass-panel" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <CheckSquare size={20} color="var(--primary-color)" /> My Recent Tasks
           </h3>
           {tasks.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {tasks.map(task => (
               <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                 <div>
                   <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{task.priority_points} pts</div>
                   <span className={`badge ${task.status === 'Completed' ? 'badge-success' : task.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                     {task.status}
                   </span>
                 </div>
               </div>
             ))}
           </div>
           ) : (
            <p style={{ color: 'var(--text-secondary)' }}>You have no assigned tasks right now.</p>
           )}
       </div>
    </div>
  )
}
