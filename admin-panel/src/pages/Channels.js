import { useState, useEffect } from 'react';
import { getChannels, createChannel, updateChannel, deleteChannel, getCategories } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTv } from 'react-icons/fi';

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', streamUrl: '', streamType: 'hls', categoryId: '', description: '', order: 0, isActive: true });
  const [logoFile, setLogoFile] = useState(null);

  const load = () => {
    getChannels().then(({ data }) => setChannels(data.channels)).catch(() => {});
    getCategories().then(({ data }) => setCategories(data.categories)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', streamUrl: '', streamType: 'hls', categoryId: '', description: '', order: 0, isActive: true });
    setLogoFile(null);
    setShowModal(true);
  };

  const openEdit = (ch) => {
    setEditing(ch);
    setForm({ name: ch.name, streamUrl: ch.streamUrl, streamType: ch.streamType, categoryId: ch.categoryId || '', description: ch.description || '', order: ch.order, isActive: ch.isActive });
    setLogoFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => { if (form[k] !== '' && form[k] !== null) fd.append(k, form[k]); });
      if (logoFile) fd.append('logo', logoFile);

      if (editing) {
        await updateChannel(editing.id, fd);
        toast.success('Channel updated');
      } else {
        await createChannel(fd);
        toast.success('Channel created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this channel?')) return;
    try {
      await deleteChannel(id);
      toast.success('Channel deleted');
      load();
    } catch (err) {
      toast.error('Error deleting channel');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title"><FiTv /> Live Channels</h1>
        <button className="btn-primary" onClick={openNew}><FiPlus /> Add Channel</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Logo</th><th>Name</th><th>Stream URL</th><th>Type</th><th>Category</th><th>Views</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id}>
                <td>{ch.logo ? <img src={ch.logo} alt="" className="table-thumb" /> : <div className="table-thumb-placeholder"><FiTv /></div>}</td>
                <td><strong>{ch.name}</strong></td>
                <td className="url-cell">{ch.streamUrl?.substring(0, 40)}...</td>
                <td><span className="badge badge-blue">{ch.streamType}</span></td>
                <td>{ch.category?.name || '-'}</td>
                <td>{ch.viewCount}</td>
                <td><span className={`badge ${ch.isActive ? 'badge-green' : 'badge-red'}`}>{ch.isActive ? 'Yes' : 'No'}</span></td>
                <td className="actions">
                  <button className="btn-icon btn-edit" onClick={() => openEdit(ch)}><FiEdit2 /></button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(ch.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {channels.length === 0 && <tr><td colSpan="8" className="empty">No channels yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Channel' : 'New Channel'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Channel Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Stream URL *</label>
                <input type="text" placeholder="https://example.com/stream.m3u8" value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stream Type</label>
                  <select value={form.streamType} onChange={(e) => setForm({ ...form, streamType: e.target.value })}>
                    <option value="hls">HLS</option>
                    <option value="dash">DASH</option>
                    <option value="rtmp">RTMP</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">No Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Active</label>
                  <select value={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full">{editing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
