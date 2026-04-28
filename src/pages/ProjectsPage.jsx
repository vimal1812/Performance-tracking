import { useState, useEffect } from 'react';
import { getProjects, addRecord, updateProjectStatus } from '../lib/mockDb';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [client, setClient] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => setProjects(getProjects());

  const handleCreate = (e) => {
    e.preventDefault();
    addRecord('projects', { name, client_name: client, status: 'To Do' });
    setName(''); setClient('');
    fetchProjects();
  };

  const handleStatusChange = (projectId, newStatus) => {
    updateProjectStatus(projectId, newStatus);
    fetchProjects();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Client Projects</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage ongoing client operations and progress.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create Project</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Project Name</label>
                <input required type="text" className="input-field" value={name} onChange={e=>setName(e.target.value)} />
              </div>
              <div>
                <label className="label">Client Name</label>
                <input required type="text" className="input-field" value={client} onChange={e=>setClient(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Create Project</button>
            </form>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', alignContent: 'start' }}>
            {projects.map(proj => (
              <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <select 
                    className="badge badge-neutral" 
                    style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}
                    value={proj.status}
                    onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{proj.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Client: {proj.client_name}</p>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)' }}>
                     <div style={{ height: '100%', width: proj.status === 'Completed' ? '100%' : proj.status === 'In Progress' ? '50%' : '10%', backgroundColor: 'var(--primary-color)', borderRadius: 'inherit', transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
