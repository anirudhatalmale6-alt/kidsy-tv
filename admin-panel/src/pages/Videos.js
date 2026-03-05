import { useState, useEffect } from 'react';
import { getVideos, createVideo, updateVideo, deleteVideo, getCategories } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiVideo, FiLink, FiUpload } from 'react-icons/fi';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addMode, setAddMode] = useState('url');
  const [form, setForm] = useState({ title: '', videoUrl: '', categoryId: '', description: '', order: 0, isActive: true, isFeatured: false });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);

  const load = () => {
    getVideos().then(({ data }) => setVideos(data.videos)).catch(() => {});
    getCategories().then(({ data }) => setCategories(data.categories)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', videoUrl: '', categoryId: '', description: '', order: 0, isActive: true, isFeatured: false });
    setVideoFile(null); setThumbFile(null); setAddMode('url');
    setShowModal(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({ title: v.title, videoUrl: v.videoUrl, categoryId: v.categoryId || '', description: v.description || '', order: v.order, isActive: v.isActive, isFeatured: v.isFeatured });
    setVideoFile(null); setThumbFile(null); setAddMode(v.videoType === 'upload' ? 'upload' : 'url');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('categoryId', form.categoryId);
      fd.append('order', form.order);
      fd.append('isActive', form.isActive);
      fd.append('isFeatured', form.isFeatured);

      if (addMode === 'upload' && videoFile) {
        fd.append('video', videoFile);
        fd.append('videoType', 'upload');
      } else {
        fd.append('videoUrl', form.videoUrl);
        fd.append('videoType', 'url');
      }
      if (thumbFile) fd.append('thumbnail', thumbFile);

      if (editing) {
        await updateVideo(editing.id, fd);
        toast.success('Video updated');
      } else {
        await createVideo(fd);
        toast.success('Video created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await deleteVideo(id);
      toast.success('Video deleted');
      load();
    } catch (err) {
      toast.error('Error deleting video');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title"><FiVideo /> Videos (On-Demand)</h1>
        <button className="btn-primary" onClick={openNew}><FiPlus /> Add Video</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Thumb</th><th>Title</th><th>Type</th><th>Category</th><th>Views</th><th>Featured</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td>{v.thumbnail ? <img src={v.thumbnail} alt="" className="table-thumb" /> : <div className="table-thumb-placeholder"><FiVideo /></div>}</td>
                <td><strong>{v.title}</strong></td>
                <td><span className={`badge ${v.videoType === 'upload' ? 'badge-purple' : 'badge-blue'}`}>{v.videoType === 'upload' ? 'Upload' : 'URL'}</span></td>
                <td>{v.category?.name || '-'}</td>
                <td>{v.viewCount}</td>
                <td>{v.isFeatured ? <span className="badge badge-yellow">Featured</span> : '-'}</td>
                <td><span className={`badge ${v.isActive ? 'badge-green' : 'badge-red'}`}>{v.isActive ? 'Yes' : 'No'}</span></td>
                <td className="actions">
                  <button className="btn-icon btn-edit" onClick={() => openEdit(v)}><FiEdit2 /></button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(v.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {videos.length === 0 && <tr><td colSpan="8" className="empty">No videos yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Video' : 'New Video'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="tab-buttons">
                <button type="button" className={`tab-btn ${addMode === 'url' ? 'active' : ''}`} onClick={() => setAddMode('url')}><FiLink /> Video URL</button>
                <button type="button" className={`tab-btn ${addMode === 'upload' ? 'active' : ''}`} onClick={() => setAddMode('upload')}><FiUpload /> Upload File</button>
              </div>

              {addMode === 'url' ? (
                <div className="form-group">
                  <label>Video URL *</label>
                  <input type="text" placeholder="https://example.com/video.mp4" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required={addMode === 'url'} />
                </div>
              ) : (
                <div className="form-group">
                  <label>Video File *</label>
                  <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required={addMode === 'upload' && !editing} />
                </div>
              )}

              <div className="form-group">
                <label>Thumbnail</label>
                <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files[0])} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">No Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Featured</label>
                  <select value={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.value === 'true' })}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
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
