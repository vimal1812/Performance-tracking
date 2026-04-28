import { useState, useEffect } from 'react';
import { getTasks, getUsers, getWeeklyGoals, addWeeklyGoal, updateWeeklyGoal, getCurrentUser } from '../lib/mockDb';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, CheckCircle, XCircle, Plus, Edit2, Save, Filter } from 'lucide-react';

export default function PerformanceStats() {
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ week_start: '', task_points_goal: 0 });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalData, setEditGoalData] = useState({});

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.system_role === 'admin';

  // Date Filtering State
  const [timeFilter, setTimeFilter] = useState('all'); // all, weekly, monthly, yearly, custom
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const loadData = () => {
    const tasks = getTasks();
    const users = getUsers().filter(u => u.system_role === 'member');
    
    // Calculate total points earned by each user
    const statsData = users.map(user => {
      let userTasks = tasks.filter(t => t.assigned_to === user.id && t.status === 'Completed');
      
      if (timeFilter !== 'all') {
        const now = new Date();
        userTasks = userTasks.filter(task => {
          if (!task.completed_at) return false;
          const completedAt = new Date(task.completed_at);
          
          if (timeFilter === 'weekly') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return completedAt >= oneWeekAgo;
          } else if (timeFilter === 'monthly') {
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return completedAt >= oneMonthAgo;
          } else if (timeFilter === 'yearly') {
            const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return completedAt >= oneYearAgo;
          } else if (timeFilter === 'custom') {
            if (customStart && customEnd) {
              const start = new Date(customStart);
              const end = new Date(customEnd);
              end.setHours(23, 59, 59, 999);
              return completedAt >= start && completedAt <= end;
            }
          }
          return true;
        });
      }

      const points = userTasks.reduce((sum, task) => sum + task.priority_points, 0);
      return {
        name: user.name,
        points: points,
        role: user.job_role,
        completedTasks: userTasks.length
      }
    });

    setData(statsData);
    setGoals(getWeeklyGoals());
  };

  useEffect(() => {
    loadData();
  }, [timeFilter, customStart, customEnd]); // Reload when filters change

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.week_start || newGoal.task_points_goal <= 0) return;
    addWeeklyGoal({ ...newGoal, task_points_goal: Number(newGoal.task_points_goal) });
    setNewGoal({ week_start: '', task_points_goal: 0 });
    setShowAddGoal(false);
    loadData();
  };

  const startEditingGoal = (goal) => {
    setEditingGoalId(goal.id);
    setEditGoalData(goal);
  };

  const handleSaveGoal = () => {
    updateWeeklyGoal(editingGoalId, { 
      week_start: editGoalData.week_start,
      task_points_goal: Number(editGoalData.task_points_goal),
      status: editGoalData.status
    });
    setEditingGoalId(null);
    loadData();
  };

  const handleStatusUpdate = (goalId, newStatus) => {
    updateWeeklyGoal(goalId, { status: newStatus });
    loadData();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Team Performance & Goals</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage weekly sprints, set team targets, and visualize performance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Goals Management Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="var(--primary-color)" /> Sprint Goals Management
            </h3>
            {isAdmin && (
              <button onClick={() => setShowAddGoal(!showAddGoal)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={16} /> New Goal
              </button>
            )}
          </div>

          {showAddGoal && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                  <label className="label">Week Start Date</label>
                  <input type="date" className="input" value={newGoal.week_start} onChange={e => setNewGoal({...newGoal, week_start: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                  <label className="label">Target Points</label>
                  <input type="number" className="input" value={newGoal.task_points_goal} onChange={e => setNewGoal({...newGoal, task_points_goal: e.target.value})} min="1" required />
                </div>
                <button type="submit" className="btn btn-primary">Add Sprint Goal</button>
              </form>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '1rem' }}>
                {editingGoalId === goal.id ? (
                  <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="date" className="input" style={{ width: 'auto' }} value={editGoalData.week_start ? editGoalData.week_start.split('T')[0] : ''} onChange={e => setEditGoalData({...editGoalData, week_start: e.target.value})} />
                    <input type="number" className="input" style={{ width: '100px' }} value={editGoalData.task_points_goal} onChange={e => setEditGoalData({...editGoalData, task_points_goal: e.target.value})} />
                    <select className="input" style={{ width: '150px' }} value={editGoalData.status} onChange={e => setEditGoalData({...editGoalData, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Success">Success</option>
                      <option value="Failure">Failure</option>
                    </select>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                      <button onClick={handleSaveGoal} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--success-color)', color: 'white' }}><Save size={16} /></button>
                      <button onClick={() => setEditingGoalId(null)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--text-secondary)', color: 'white' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ fontSize: '1rem' }}>Week of {new Date(goal.week_start).toLocaleDateString()}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Target: <strong>{goal.task_points_goal} Points</strong></p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`badge ${goal.status === 'Success' ? 'badge-success' : goal.status === 'Failure' ? 'badge-danger' : 'badge-warning'}`}>
                        {goal.status}
                      </span>
                      
                      {isAdmin && goal.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleStatusUpdate(goal.id, 'Success')} className="btn" style={{ padding: '0.5rem', color: 'var(--success-color)', backgroundColor: 'transparent', border: '1px solid var(--success-color)' }} title="Mark Success">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleStatusUpdate(goal.id, 'Failure')} className="btn" style={{ padding: '0.5rem', color: 'var(--danger-color)', backgroundColor: 'transparent', border: '1px solid var(--danger-color)' }} title="Mark Failure">
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                      
                      {isAdmin && (
                        <button onClick={() => startEditingGoal(goal)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }} title="Edit Goal">
                          <Edit2 size={16} color="var(--text-primary)" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
            {goals.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No sprint goals found. Create one to start tracking!</p>}
          </div>
        </div>

      </div>

      <div className="card" style={{ height: '550px', width: '100%', padding: '2rem' }}>
        
        {/* Filtering Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 0 1rem', fontSize: '1.1rem' }}>Points Earned By Member</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', paddingRight: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-secondary)" />
              <select 
                style={{ 
                  width: '140px', 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem', 
                  backgroundColor: 'var(--surface-color)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)', 
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.7rem center',
                  backgroundSize: '1em'
                }} 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="weekly">Past Week</option>
                <option value="monthly">Past Month</option>
                <option value="yearly">Past Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {timeFilter === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="date" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.85rem', 
                    backgroundColor: 'var(--surface-color)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)', 
                    borderRadius: 'var(--radius-full)',
                    outline: 'none',
                  }} 
                  value={customStart} 
                  onChange={(e) => setCustomStart(e.target.value)} 
                />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>to</span>
                <input 
                  type="date" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    fontSize: '0.85rem', 
                    backgroundColor: 'var(--surface-color)', 
                    border: '1px solid var(--border-color)', 
                    color: 'var(--text-primary)', 
                    borderRadius: 'var(--radius-full)',
                    outline: 'none',
                  }} 
                  value={customEnd} 
                  onChange={(e) => setCustomEnd(e.target.value)} 
                />
              </div>
            )}
          </div>
        </div>

        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--surface-color-transparent)' }} 
              contentStyle={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} 
            />
            <Bar dataKey="points" fill="var(--primary-color)" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

