import { useState, useEffect } from 'react';
import { getMeetings, addRecord, getCurrentUser, getUsers } from '../lib/mockDb';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const user = getCurrentUser();
  const allUsers = getUsers();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = () => {
    setMeetings(getMeetings());
  };

  const handleCreate = (e) => {
    e.preventDefault();
    addRecord('meetings', { 
      title, 
      notes, 
      scheduled_at: new Date().toISOString(),
      created_by: user.id
    });
    setTitle(''); setNotes('');
    fetchMeetings();
  };

  return (
    <div className="animate-fade-in">
       <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Team Meetings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Schedule meetings and share notes.</p>
      </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
            <h3 style={{ marginBottom: '1rem' }}>Schedule New</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Meeting Title</label>
                <input required type="text" className="input-field" value={title} onChange={e=>setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Agenda / Notes</label>
                <textarea required className="input-field" style={{ minHeight: '100px' }} value={notes} onChange={e=>setNotes(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Meeting Notes</button>
            </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {meetings.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No meetings scheduled yet.</p>}
            {meetings.map(meet => {
              const creator = allUsers.find(u => u.id === meet.created_by)?.name;
              return (
                <div key={meet.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{meet.title}</h4>
                    <span className="badge badge-neutral">{new Date(meet.scheduled_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                    {meet.notes}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Created by {creator}</p>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
