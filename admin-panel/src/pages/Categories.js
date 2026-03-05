import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', nameAr: '', icon: '', order: 0, isActive: true });

  const load = () => getCategories().then(({ data }) => setCategories(data.categories)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', nameAr: '', icon: '', order: 0, isActive: true }); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, nameAr: cat.nameAr || '', icon: cat.icon || '', order: cat.order, isActive: cat.isActive }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing.id, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error('Error deleting category');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn-primary" onClick={openNew}><FiPlus /> Add Category</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Arabic Name</th><th>Icon</th><th>Order</th><th>Channels</th><th>Videos</th><th>Active</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td><strong>{cat.name}</strong></td>
                <td>{cat.nameAr || '-'}</td>
                <td>{cat.icon || '-'}</td>
                <td>{cat.order}</td>
                <td>{cat.channels?.length || 0}</td>
                <td>{cat.videos?.length || 0}</td>
                <td><span className={`badge ${cat.isActive ? 'badge-green' : 'badge-red'}`}>{cat.isActive ? 'Yes' : 'No'}</span></td>
                <td className="actions">
                  <button className="btn-icon btn-edit" onClick={() => openEdit(cat)}><FiEdit2 /></button>
                  <button className="btn-icon btn-delete" onClick={() => handleDelete(cat.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan="8" className="empty">No categories yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Arabic Name</label>
                <input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Icon (emoji or URL)</label>
                <input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
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
