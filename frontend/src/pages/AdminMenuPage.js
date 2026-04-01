import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

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

  if (loading) {
    return (
      <AdminLayout activeItem="menu">
        <div className="loading">Loading menu data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="menu">
      <div className="admin-header-row">
        <h1>Menu Management</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Item
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button
          className={`tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Menu Items
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          {categories.length === 0 ? (
            <div className="empty-state"><p>No categories yet.</p></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Branch</th>
                    <th>Description</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => {
                    const itemCount = menuItems.filter(
                      (m) => (m.categoryId || m.category?.id) === cat.id
                    ).length;
                    return (
                      <tr key={cat.id}>
                        <td>{idx + 1}</td>
                        <td><strong>{cat.name}</strong></td>
                        <td>{branches.find((b) => b.id === cat.branchId)?.name || '\u2014'}</td>
                        <td>{cat.description || '\u2014'}</td>
                        <td>{itemCount}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-secondary" onClick={() => openEditCategory(cat)}>
                              {'\u270F\uFE0F'}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(cat.id)}>
                              {'\uD83D\uDDD1\uFE0F'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Menu Items Tab */}
      {activeTab === 'items' && (
        <>
          {menuItems.length === 0 ? (
            <div className="empty-state"><p>No menu items yet.</p></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => {
                    const catName = categories.find(
                      (c) => c.id === (item.categoryId || item.category?.id)
                    )?.name || '\u2014';
                    return (
                      <tr key={item.id}>
                        <td>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="table-thumb" />
                          ) : (
                            <div className="table-thumb-placeholder">{'\uD83D\uDDBC\uFE0F'}</div>
                          )}
                        </td>
                        <td><strong>{item.name}</strong></td>
                        <td>{catName}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.discount ? `${item.discount}%` : '\u2014'}</td>
                        <td>
                          <label className="toggle-switch">
                            <input type="checkbox" checked={item.available !== false} readOnly />
                            <span className="toggle-slider"></span>
                          </label>
                        </td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-secondary" onClick={() => openEditMenuItem(item)}>
                              {'\u270F\uFE0F'}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteMenuItem(item.id)}>
                              {'\uD83D\uDDD1\uFE0F'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-textarea"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Branch</label>
                <select
                  className="form-select"
                  value={categoryForm.branchId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, branchId: e.target.value })}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div className="modal-overlay" onClick={() => setShowMenuModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
            <form onSubmit={handleMenuSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-textarea"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    max="100"
                    value={menuForm.discount}
                    onChange={(e) => setMenuForm({ ...menuForm, discount: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  className="form-input"
                  type="text"
                  value={menuForm.imageUrl}
                  onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
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
              <div className="form-group">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="available"
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                  />
                  <label htmlFor="available">Available</label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMenuModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
