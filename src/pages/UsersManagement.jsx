import { useState, useEffect } from 'react';
import { getUsersAdmin, addUser, deleteUser, updateUserDetails, updateUserRole } from '../lib/mockDb';
import { Users, Trash2, Edit2, Key, Save, Plus } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', system_role: 'member', job_role: '' });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const loadUsers = () => {
    setUsers(getUsersAdmin());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    addUser(newUser);
    setNewUser({ name: '', email: '', password: '', system_role: 'member', job_role: '' });
    setShowAddForm(false);
    loadUsers();
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      loadUsers();
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditFormData(user);
  };

  const handleSaveEdit = () => {
    updateUserDetails(editingUserId, editFormData);
    updateUserRole(editingUserId, editFormData.system_role);
    setEditingUserId(null);
    loadUsers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>User Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add, remove, and manage members and admins.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add User
        </button>
      </div>

      {showAddForm && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add New User</h3>
          <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="label">Name</label>
              <input type="text" className="input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" className="input" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input type="text" className="input" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="label">System Role</label>
              <select className="input" value={newUser.system_role} onChange={e => setNewUser({...newUser, system_role: e.target.value})}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Job Role</label>
              <input type="text" className="input" value={newUser.job_role} onChange={e => setNewUser({...newUser, job_role: e.target.value})} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create User</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="var(--primary-color)" /> All Users
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.map(user => (
            <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              
              {editingUserId === user.id ? (
                <>
                  <input className="input" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                  <input className="input" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
                  <input className="input" value={editFormData.password} onChange={e => setEditFormData({...editFormData, password: e.target.value})} />
                  <select className="input" value={editFormData.system_role} onChange={e => setEditFormData({...editFormData, system_role: e.target.value})}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input className="input" value={editFormData.job_role} onChange={e => setEditFormData({...editFormData, job_role: e.target.value})} />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveEdit} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--success-color)', color: 'white' }} title="Save">
                      <Save size={18} />
                    </button>
                    <button onClick={() => setEditingUserId(null)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--text-secondary)', color: 'white' }} title="Cancel">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{user.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.job_role}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem' }}>{user.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Key size={16} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.9rem' }}>{user.password}</span>
                  </div>
                  <div>
                    <span className={`badge ${user.system_role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                      {user.system_role}
                    </span>
                  </div>
                  <div>
                    {/* Placeholder for future specific permissions if needed, current role dictates access */}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => startEditing(user)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--primary-color)', color: 'white' }} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--danger-color)', color: 'white' }} title="Delete" disabled={user.email === 'admin@perform.com'}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
