import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';
import '../App.css';

const API_BASE = api.defaults.baseURL || '';

const LIMITS = {
  name: 100,
  city: 100,
  address: 200,
  phone: 20,
  description: 2000,
};

const PHONE_PATTERN = /^[+]?[\d\s\-().]*$/;

const emptyForm = { name: '', address: '', city: '', phone: '', description: '', imageUrl: '' };

const emptyTouched = { name: false, city: false, address: false, phone: false, description: false };

const validateField = (field, value) => {
  if (['name', 'city', 'address'].includes(field) && !value.trim()) {
    return 'This field is required';
  }
  if (LIMITS[field] && value.length > LIMITS[field]) {
    return `Maximum ${LIMITS[field]} characters exceeded`;
  }
  if (field === 'phone' && value && !PHONE_PATTERN.test(value)) {
    return 'Invalid phone format. Use digits, spaces, +, -, (, )';
  }
  return '';
};

const validateForm = (form) => {
  const errors = {};
  ['name', 'city', 'address', 'phone', 'description'].forEach(field => {
    const err = validateField(field, form[field]);
    if (err) errors[field] = err;
  });
  return errors;
};

const isFormValid = (form) => Object.keys(validateForm(form)).length === 0;

/* ─── CharCounter ─── */
const CharCounter = ({ value, max }) => (
  <div style={{ textAlign: 'right', fontSize: '12px', color: value.length > max ? '#dc3545' : '#a8a29e', marginTop: '4px' }}>
    {value.length}/{max}
  </div>
);

/* ─── ValidatedInput ─── */
const ValidatedInput = ({ label, required, field, value, touched, onChange, onBlur, placeholder, showCounter, limit, as: Component = 'input', ...rest }) => {
  const error = touched ? validateField(field, value) : '';
  const borderColor = error ? '#dc3545' : undefined;
  return (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <Component
        className={Component === 'textarea' ? 'form-textarea' : 'form-input'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={borderColor ? { borderColor, boxShadow: '0 0 0 2px rgba(220,53,69,0.15)' } : undefined}
        maxLength={limit ? limit + 10 : undefined}
        {...rest}
      />
      {error && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
      {showCounter && limit && <CharCounter value={value} max={limit} />}
    </div>
  );
};

/* ─── ImageUploader ─── */
const ImageUploader = ({ imageUrl, onImageUrlChange }) => {
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10 MB');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const returnedUrl = res.data.url; // e.g. "/api/upload/files/filename.jpg"
      onImageUrlChange(returnedUrl);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onImageUrlChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const resolveImageSrc = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const previewSrc = resolveImageSrc(imageUrl);

  return (
    <div className="form-group">
      <label className="form-label">Image</label>

      {/* mode toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            padding: '6px 16px', borderRadius: '8px', border: '1px solid',
            borderColor: mode === 'upload' ? 'var(--primary)' : '#d6d3d1',
            background: mode === 'upload' ? 'var(--primary)' : 'transparent',
            color: mode === 'upload' ? '#fff' : '#57534e',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          }}
        >
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          style={{
            padding: '6px 16px', borderRadius: '8px', border: '1px solid',
            borderColor: mode === 'url' ? 'var(--primary)' : '#d6d3d1',
            background: mode === 'url' ? 'var(--primary)' : 'transparent',
            color: mode === 'url' ? '#fff' : '#57534e',
            cursor: 'pointer', fontSize: '13px', fontWeight: 500,
          }}
        >
          Paste URL
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : '#d6d3d1'}`,
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              background: dragOver ? 'rgba(111,78,55,0.05)' : '#fafaf9',
              transition: 'all 0.2s',
            }}
          >
            {uploading ? (
              <div style={{ color: '#78716c' }}>Uploading...</div>
            ) : (
              <>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>&#128247;</div>
                <div style={{ color: '#57534e', fontWeight: 500 }}>Click or drag to upload image</div>
                <div style={{ color: '#a8a29e', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, WEBP up to 10 MB</div>
              </>
            )}
          </div>
        </>
      ) : (
        <input
          className="form-input"
          value={imageUrl}
          onChange={e => onImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      )}

      {/* preview */}
      {imageUrl && (
        <div style={{ marginTop: '12px', position: 'relative', display: 'inline-block' }}>
          <img
            src={previewSrc}
            alt="Preview"
            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e7e5e4' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onImageUrlChange('')}
            style={{
              position: 'absolute', top: '-8px', right: '-8px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#dc3545', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: '14px', lineHeight: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── resolveImageSrc (for table) ─── */
const resolveImageSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

/* ─── BranchAvatar ─── */
const BranchAvatar = ({ branch }) => {
  const [imgError, setImgError] = useState(false);

  if (branch.imageUrl && !imgError) {
    return (
      <img
        src={resolveImageSrc(branch.imageUrl)}
        alt={branch.name}
        style={{
          width: '48px', height: '48px', borderRadius: '12px',
          objectFit: 'cover', flexShrink: 0,
        }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: 'linear-gradient(135deg, #6F4E37, #A0785A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 'bold', fontSize: '16px', flexShrink: 0,
    }}>
      {branch.name.charAt(0)}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════ */
const AdminBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState(emptyTouched);
  const [loading, setLoading] = useState(true);

  const fetchBranches = () => {
    api.get('/api/branches')
      .then(res => setBranches(res.data))
      .catch(() => toast.error('Failed to load branches'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBranches(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setTouched(emptyTouched);
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditing(branch.id);
    setForm({
      name: branch.name || '',
      address: branch.address || '',
      city: branch.city || '',
      phone: branch.phone || '',
      description: branch.description || '',
      imageUrl: branch.imageUrl || '',
    });
    setTouched(emptyTouched);
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to show any remaining errors
    const allTouched = {};
    Object.keys(emptyTouched).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    if (!isFormValid(form)) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      if (editing) {
        await api.put(`/api/branches/${editing}`, form);
        toast.success('Branch updated');
      } else {
        await api.post('/api/branches', form);
        toast.success('Branch created');
      }
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This will deactivate the branch.`)) return;
    try {
      await api.delete(`/api/branches/${id}`);
      toast.success('Branch deactivated');
      fetchBranches();
    } catch (err) {
      toast.error('Failed to delete branch');
    }
  };

  const formValid = isFormValid(form);

  if (loading) {
    return <AdminLayout activeItem="branches"><div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout activeItem="branches">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Branch Management</h1>
          <p style={{ color: '#78716c', marginTop: '4px' }}>Manage your coffee shop locations</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add New Branch</button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>{branches.length}</div>
          <div style={{ color: '#78716c', fontSize: '14px' }}>Total Branches</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{branches.filter(b => b.active).length}</div>
          <div style={{ color: '#78716c', fontSize: '14px' }}>Active</div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{branches.filter(b => !b.active).length}</div>
          <div style={{ color: '#78716c', fontSize: '14px' }}>Inactive</div>
        </div>
      </div>

      {/* Branches table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>City</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BranchAvatar branch={branch} />
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{branch.name}</div>
                      <div style={{ fontSize: '12px', color: '#a8a29e' }}>{branch.description?.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td>{branch.city}</td>
                <td style={{ fontSize: '14px' }}>{branch.address}</td>
                <td>{branch.phone}</td>
                <td>
                  <span className={branch.active ? 'badge badge-confirmed' : 'badge badge-cancelled'}>
                    {branch.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(branch)} title="Edit">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(branch.id, branch.name)} title="Delete">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#78716c' }}>No branches yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Branch' : 'Add New Branch'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#78716c' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <ValidatedInput
                  label="Branch Name"
                  required
                  field="name"
                  value={form.name}
                  touched={touched.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. The Bean Haven"
                  showCounter
                  limit={LIMITS.name}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <ValidatedInput
                    label="City"
                    required
                    field="city"
                    value={form.city}
                    touched={touched.city}
                    onChange={e => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="e.g. San Francisco"
                    showCounter
                    limit={LIMITS.city}
                  />
                  <ValidatedInput
                    label="Phone"
                    field="phone"
                    value={form.phone}
                    touched={touched.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+1 415-555-0123"
                    showCounter={false}
                    limit={LIMITS.phone}
                  />
                </div>
                <ValidatedInput
                  label="Address"
                  required
                  field="address"
                  value={form.address}
                  touched={touched.address}
                  onChange={e => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="Full street address"
                  showCounter
                  limit={LIMITS.address}
                />
                <ValidatedInput
                  label="Description"
                  field="description"
                  value={form.description}
                  touched={touched.description}
                  onChange={e => handleChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  placeholder="Describe the branch..."
                  as="textarea"
                  rows={3}
                  showCounter
                  limit={LIMITS.description}
                />
                <ImageUploader
                  imageUrl={form.imageUrl}
                  onImageUrlChange={url => handleChange('imageUrl', url)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!formValid}
                  style={!formValid ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                >
                  {editing ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBranchesPage;
