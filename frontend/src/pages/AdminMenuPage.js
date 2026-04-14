import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const API_BASE = api.defaults.baseURL || '';

const resolveImageSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ImageUploadField = ({ value, onChange }) => {
  const [mode, setMode] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Max 10 MB'); return; }
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = resolveImageSrc(value);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button type="button" onClick={() => setMode('upload')} style={{
          padding: '6px 16px', borderRadius: 8, border: '1px solid',
          borderColor: mode === 'upload' ? '#6F4E37' : '#d6d3d1',
          background: mode === 'upload' ? '#6F4E37' : 'transparent',
          color: mode === 'upload' ? '#fff' : '#57534e',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}>Upload Image</button>
        <button type="button" onClick={() => setMode('url')} style={{
          padding: '6px 16px', borderRadius: 8, border: '1px solid',
          borderColor: mode === 'url' ? '#6F4E37' : '#d6d3d1',
          background: mode === 'url' ? '#6F4E37' : 'transparent',
          color: mode === 'url' ? '#fff' : '#57534e',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}>Paste URL</button>
      </div>

      {mode === 'upload' ? (
        <>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])} />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border: `2px dashed ${dragOver ? '#6F4E37' : '#d6d3d1'}`,
              borderRadius: 12, padding: 24, textAlign: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              background: dragOver ? 'rgba(111,78,55,0.05)' : '#fafaf9',
              transition: 'all 0.2s',
            }}>
            {uploading ? <div style={{ color: '#78716c' }}>Uploading...</div> : (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ color: '#57534e', fontWeight: 500 }}>Click or drag to upload image</div>
                <div style={{ color: '#a8a29e', fontSize: 12, marginTop: 4 }}>PNG, JPG, WEBP up to 10 MB</div>
              </>
            )}
          </div>
        </>
      ) : (
        <input
          type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{
            width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8,
            border: '1px solid #e7e5e4', fontSize: '0.95rem', background: '#fafaf9',
          }}
        />
      )}

      {value && (
        <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
          <img src={previewSrc} alt="Preview"
            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid #e7e5e4' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <button type="button" onClick={() => onChange('')} style={{
            position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%',
            background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700,
          }}>×</button>
        </div>
      )}
    </div>
  );
};

const emptyCategory = { name: '', description: '', branchId: '' };
const emptyMenuItem = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  categoryId: '',
  discount: 0,
  available: true,
};

const thStyle = {
  padding: '14px 20px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#78716c',
  textTransform: 'uppercase',
  textAlign: 'left',
  borderBottom: '1px solid #e7e5e4',
  letterSpacing: '0.05em',
  background: '#fafaf9',
};

const tdStyle = {
  padding: '14px 20px',
  fontSize: '14px',
  color: '#1c1917',
  borderBottom: '1px solid #f5f5f4',
};

const modalLabelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#78716c',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
};

const modalInputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.9rem',
  border: '1.5px solid #e7e5e4',
  borderRadius: 10,
  outline: 'none',
  background: '#FFF8F6',
  color: '#1c1917',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const AdminMenuPage = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ ...emptyCategory });
  const [menuForm, setMenuForm] = useState({ ...emptyMenuItem });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, menuRes, branchRes] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/menu'),
        api.get('/api/branches'),
      ]);
      setCategories(catRes.data || []);
      setMenuItems(menuRes.data || []);
      setBranches(branchRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // --- Category CRUD ---
  const openAddCategory = () => {
    setCategoryForm({ ...emptyCategory });
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat) => {
    setCategoryForm({ name: cat.name, description: cat.description || '', branchId: cat.branchId || '' });
    setEditingCategory(cat);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const catPayload = {
        name: categoryForm.name,
        description: categoryForm.description,
        branchId: categoryForm.branchId ? parseInt(categoryForm.branchId, 10) : null,
      };
      if (editingCategory) {
        await api.put(`/api/categories/${editingCategory.id}`, catPayload);
        toast.success('Category updated');
      } else {
        await api.post('/api/categories', catPayload);
        toast.success('Category created');
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success('Category deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  // --- Menu Item CRUD ---
  const openAddMenuItem = () => {
    setMenuForm({ ...emptyMenuItem });
    setEditingMenuItem(null);
    setShowMenuModal(true);
  };

  const openEditMenuItem = (item) => {
    setMenuForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      categoryId: item.categoryId || item.category?.id || '',
      discount: item.discount || 0,
      available: item.available !== false,
    });
    setEditingMenuItem(item);
    setShowMenuModal(true);
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: menuForm.name,
      description: menuForm.description,
      price: parseFloat(menuForm.price),
      imageUrl: menuForm.imageUrl,
      categoryId: parseInt(menuForm.categoryId, 10),
      discount: parseFloat(menuForm.discount) || 0,
      isAvailable: menuForm.available,
    };
    try {
      if (editingMenuItem) {
        await api.put(`/api/menu/${editingMenuItem.id}`, payload);
        toast.success('Menu item updated');
      } else {
        await api.post('/api/menu', payload);
        toast.success('Menu item created');
      }
      setShowMenuModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    }
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/api/menu/${id}`);
      toast.success('Menu item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleAddNew = () => {
    if (activeTab === 'categories') openAddCategory();
    else openAddMenuItem();
  };

  const tabStyle = (isActive) => ({
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: isActive ? '#6F4E37' : '#78716c',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2.5px solid #6F4E37' : '2.5px solid transparent',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  });

  if (loading) {
    return (
      <AdminLayout activeItem="menu">
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>Loading menu data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="menu">
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', margin: 0 }}>
          Menu Management
        </h1>
        <button
          onClick={handleAddNew}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: '#6F4E37',
            color: '#fff',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
        >
          + Add New Item
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e7e5e4', marginBottom: '1.5rem' }}>
        <button style={tabStyle(activeTab === 'categories')} onClick={() => setActiveTab('categories')}>
          Categories
        </button>
        <button style={tabStyle(activeTab === 'items')} onClick={() => setActiveTab('items')}>
          Menu Items
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          {categories.length === 0 ? (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              padding: '48px',
              textAlign: 'center',
              color: '#78716c',
              fontSize: '15px',
            }}>
              No categories yet.
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: '1px solid #e7e5e4',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>#</th>
                      <th style={thStyle}>Category Name</th>
                      <th style={thStyle}>Branch</th>
                      <th style={thStyle}>Description</th>
                      <th style={thStyle}>Items</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, idx) => {
                      const itemCount = menuItems.filter(
                        (m) => (m.categoryId || m.category?.id) === cat.id
                      ).length;
                      return (
                        <tr key={cat.id}>
                          <td style={tdStyle}>{idx + 1}</td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{cat.name}</td>
                          <td style={tdStyle}>{branches.find((b) => b.id === cat.branchId)?.name || '\u2014'}</td>
                          <td style={tdStyle}>{cat.description || '\u2014'}</td>
                          <td style={tdStyle}>{itemCount}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => openEditCategory(cat)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: 6,
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  border: '1px solid #d6d3d1',
                                  background: '#fff',
                                  color: '#57534e',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteCategory(cat.id)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: 6,
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  border: '1px solid #dc2626',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'items' && (
        <>
          {menuItems.length === 0 ? (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              padding: '48px',
              textAlign: 'center',
              color: '#78716c',
              fontSize: '15px',
            }}>
              No menu items yet.
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: '1px solid #e7e5e4',
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Image</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Discount</th>
                      <th style={thStyle}>Available</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => {
                      const catName = categories.find(
                        (c) => c.id === (item.categoryId || item.category?.id)
                      )?.name || '\u2014';
                      return (
                        <tr key={item.id}>
                          <td style={tdStyle}>
                            {item.imageUrl ? (
                              <img
                                src={resolveImageSrc(item.imageUrl)}
                                alt=""
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 8,
                                background: '#f5f0eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                color: '#a8a29e',
                              }}>
                                {'\uD83D\uDDBC\uFE0F'}
                              </div>
                            )}
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 600 }}>{item.name}</td>
                          <td style={tdStyle}>{catName}</td>
                          <td style={tdStyle}>${parseFloat(item.price).toFixed(2)}</td>
                          <td style={tdStyle}>{item.discount ? `${item.discount}%` : '\u2014'}</td>
                          <td style={tdStyle}>
                            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                              <input
                                type="checkbox"
                                checked={item.available !== false}
                                onChange={async () => {
                                  try {
                                    await api.put(`/api/menu/${item.id}`, {
                                      name: item.name,
                                      description: item.description,
                                      price: parseFloat(item.price),
                                      imageUrl: item.imageUrl,
                                      categoryId: item.categoryId || item.category?.id,
                                      discount: parseFloat(item.discount) || 0,
                                      isAvailable: !(item.available !== false),
                                    });
                                    toast.success('Availability updated');
                                    fetchData();
                                  } catch (error) {
                                    toast.error('Failed to update availability');
                                  }
                                }}
                                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                              />
                              <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: item.available !== false ? '#16a34a' : '#d6d3d1',
                                borderRadius: 12,
                                transition: 'background 0.2s',
                              }}>
                                <span style={{
                                  position: 'absolute',
                                  content: '""',
                                  height: 18,
                                  width: 18,
                                  left: item.available !== false ? 22 : 3,
                                  bottom: 3,
                                  background: '#fff',
                                  borderRadius: '50%',
                                  transition: 'left 0.2s',
                                }} />
                              </span>
                            </label>
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                onClick={() => openEditMenuItem(item)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: 6,
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  border: '1px solid #d6d3d1',
                                  background: '#fff',
                                  color: '#57534e',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMenuItem(item.id)}
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: 6,
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  border: '1px solid #dc2626',
                                  background: 'transparent',
                                  color: '#dc2626',
                                  fontFamily: 'inherit',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div
          onClick={() => setShowCategoryModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '2rem',
              width: '100%',
              maxWidth: 480,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', margin: '0 0 1.5rem' }}>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleCategorySubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Name</label>
                <input
                  style={modalInputStyle}
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Description</label>
                <textarea
                  style={{ ...modalInputStyle, resize: 'vertical', minHeight: 80 }}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={modalLabelStyle}>Branch</label>
                <select
                  style={{ ...modalInputStyle, appearance: 'auto' }}
                  value={categoryForm.branchId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, branchId: e.target.value })}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '1px solid #d6d3d1',
                    background: '#fff',
                    color: '#57534e',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: '#6F4E37',
                    color: '#fff',
                    fontFamily: 'inherit',
                  }}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div
          onClick={() => setShowMenuModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '2rem',
              width: '100%',
              maxWidth: 520,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', margin: '0 0 1.5rem' }}>
              {editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleMenuSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Name</label>
                <input
                  style={modalInputStyle}
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Description</label>
                <textarea
                  style={{ ...modalInputStyle, resize: 'vertical', minHeight: 80 }}
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>Price</label>
                  <input
                    style={modalInputStyle}
                    type="number"
                    step="0.01"
                    min="0"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>Discount (%)</label>
                  <input
                    style={modalInputStyle}
                    type="number"
                    min="0"
                    max="100"
                    value={menuForm.discount}
                    onChange={(e) => setMenuForm({ ...menuForm, discount: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Image</label>
                <ImageUploadField
                  value={menuForm.imageUrl}
                  onChange={(url) => setMenuForm({ ...menuForm, imageUrl: url })}
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={modalLabelStyle}>Category</label>
                <select
                  style={{ ...modalInputStyle, appearance: 'auto' }}
                  value={menuForm.categoryId}
                  onChange={(e) => setMenuForm({ ...menuForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="available"
                  checked={menuForm.available}
                  onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#6F4E37' }}
                />
                <label htmlFor="available" style={{ fontSize: '0.9rem', color: '#1c1917', fontWeight: 500 }}>
                  Available
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: '1px solid #d6d3d1',
                    background: '#fff',
                    color: '#57534e',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: '#6F4E37',
                    color: '#fff',
                    fontFamily: 'inherit',
                  }}
                >
                  {editingMenuItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMenuPage;
