import { useState, useEffect } from 'react';
import { getUsers, getTasks, getProjects, getWeeklyGoals } from '../lib/mockDb';
import { Users, CheckCircle, TrendingUp, Briefcase } from 'lucide-react';

function MetricCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)' }} className={colorClass}>
        <Icon size={24} />
      </div>
      <div>
        <p className="label" style={{ marginBottom: 0 }}>{title}</p>
        <h3 style={{ fontSize: '1.5rem' }}>{value}</h3>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, completedTasks: 0, projects: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    const tasks = getTasks();
    const users = getUsers();
    const projs = getProjects();
    const goals = getWeeklyGoals();
    
    setStats({
      users: users.length,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      projects: projs.length
    });
    setRecentTasks(tasks.slice(-5).reverse());
    setGoal(goals[0]); // Get current week goal
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Overview of team performance and ongoing projects.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
         <MetricCard title="Total Members" value={stats.users} icon={Users} colorClass="badge-neutral" />
         <MetricCard title="Completed Tasks" value={stats.completedTasks} icon={CheckCircle} colorClass="badge-success" />
         <MetricCard title="Active Projects" value={stats.projects} icon={Briefcase} colorClass="badge-warning" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
         <div className="glass-panel" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <CheckCircle size={20} color="var(--primary-color)" /> Recent Tasks
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {recentTasks.map(task => (
               <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                 <div>
                   <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Points: {task.priority_points}</p>
                 </div>
                 <span className={`badge ${task.status === 'Completed' ? 'badge-success' : task.status === 'In Progress' ? 'badge-warning' : 'badge-neutral'}`}>
                   {task.status}
                 </span>
               </div>
             ))}
           </div>
         </div>

         <div className="glass-panel" style={{ padding: '1.5rem' }}>
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <TrendingUp size={20} color="var(--primary-color)" /> Weekly Goal
           </h3>
           {goal ? (
             <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
               <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                 {stats.completedTasks * 10} / {goal.task_points_goal}
               </div>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Total Points Achieved</p>
               <span className={`badge ${goal.status === 'Success' ? 'badge-success' : goal.status === 'Failure' ? 'badge-danger' : 'badge-warning'}`}>
                 Status: {goal.status}
               </span>
               <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', marginTop: '1.5rem', overflow: 'hidden' }}>
                 <div style={{ width: `${Math.min(((stats.completedTasks*10) / goal.task_points_goal) * 100, 100)}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 1s ease' }}></div>
               </div>
             </div>
           ) : (
             <p style={{ color: 'var(--text-secondary)' }}>No weekly goal set.</p>
           )}
         </div>
      </div>
    </div>
  )
}
