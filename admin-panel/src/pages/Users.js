import { useState, useEffect } from 'react';
import { getUsers, toggleUser, deleteUser } from '../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function Users() {
  const [users, setUsers] = useState([]);

  const load = () => getUsers().then(({ data }) => setUsers(data.users)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleToggle = async (id) => {
    try {
      await toggleUser(id);
      toast.success('User status updated');
      load();
    } catch (err) {
      toast.error('Error updating user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title"><FiUsers /> Users</h1>
        <span className="user-count">{users.length} registered</span>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Country</th><th>Registered</th><th>Last Login</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.phone}</td>
                <td>{u.country}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '-'}</td>
                <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Blocked'}</span></td>
                <td className="actions">
                  <button className="btn-icon" onClick={() => handleToggle(u.id)} title={u.isActive ? 'Block' : 'Activate'}>
                    {u.isActive ? <FiToggleRight color="#4ECDC4" size={22} /> : <FiToggleLeft color="#FF6B6B" size={22} />}
                  </button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(u.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="7" className="empty">No users yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
