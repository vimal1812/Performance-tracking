import { useState, useEffect } from 'react';
import { getTasks, getUsers, addTask, updateTaskStatus, getCurrentUser } from '../lib/mockDb';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(5);
  const [assignedTo, setAssignedTo] = useState('');
  
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.system_role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const allTasks = getTasks();
    setTasks(isAdmin ? allTasks : allTasks.filter(t => t.assigned_to === currentUser.id));
    setUsers(getUsers().filter(u => u.system_role === 'member'));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!assignedTo) return alert('Select an assignee');
    addTask({
      title,
      description,
      priority_points: parseInt(points, 10),
      assigned_to: assignedTo,
    });
    setTitle('');
    setDescription('');
    fetchData(); // Refresh UI
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>{isAdmin ? 'Task Management' : 'My Tasks'}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{isAdmin ? 'Create and oversee team tasks.' : 'Update your task progress here.'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 2fr' : '1fr', gap: '2rem' }}>
        
        {isAdmin && (
          <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Task Title</label>
                <input required type="text" className="input-field" value={title} onChange={e=>setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea required className="input-field" style={{ minHeight: '80px' }} value={description} onChange={e=>setDescription(e.target.value)} />
              </div>
              <div>
                <label className="label">Priority Points</label>
                <input required type="number" min="1" max="100" className="input-field" value={points} onChange={e=>setPoints(e.target.value)} />
              </div>
              <div>
                <label className="label">Assign To</label>
                <select required className="input-field" value={assignedTo} onChange={e=>setAssignedTo(e.target.value)}>
                  <option value="" disabled>Select Member</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.job_role})</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Assign Task</button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map(task => {
            const assignee = users.find(u => u.id === task.assigned_to)?.name || 'Unknown';
            return (
              <div key={task.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', maxWidth: '600px' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className="badge badge-warning">{task.priority_points} Points</span>
                    {isAdmin && <span className="badge badge-neutral">Assigned to: {assignee}</span>}
                  </div>
                </div>
                <div>
                  <select 
                    className="input-field" 
                    style={{ width: '140px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
                      backgroundColor: task.status === 'Completed' ? 'hsla(150, 60%, 45%, 0.1)' : 'var(--surface-color)'
                     }}
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            )
          })}
          {tasks.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No tasks found.</p>}
        </div>

      </div>
    </div>
  )
}
