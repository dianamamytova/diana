import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const MenuPage = () => {
  const { branchId } = useParams();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(branchId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await api.get('/api/branches');
        setBranches(res.data);
      } catch (err) {
        console.error('Failed to fetch branches:', err);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const branch = selectedBranch || branchId;
        const categoriesUrl = branch
          ? `/api/categories/branch/${branch}`
          : '/api/categories';
        const menuUrl = branch
          ? `/api/menu/branch/${branch}`
          : '/api/menu';

        const [catRes, menuRes] = await Promise.all([
          api.get(categoriesUrl),
          api.get(menuUrl),
        ]);

        setCategories(catRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [branchId, selectedBranch]);

  const filteredItems = activeCategory
    ? menuItems.filter((item) => item.categoryId === activeCategory)
    : menuItems;

  return (
    <div className="page-bg">
      <div className="container">
        {/* Header Section */}
        <div className="section" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Artisan Menu</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Sourced with integrity, roasted with precision, and served with a story in every cup.
          </p>
        </div>

        {/* Branch Selector */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <select
            className="form-select"
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setActiveCategory(null);
            }}
            style={{ maxWidth: '240px', borderRadius: '24px' }}
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-pills">
          <button
            className={`category-pill${activeCategory === null ? ' category-pill-active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill${activeCategory === cat.id ? ' category-pill-active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="loading">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found in this category.</p>
          </div>
        ) : (
          <div className="card-grid-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-img">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#bbb' }}>
                      No Image
                    </span>
                  )}
                  {item.discount > 0 && (
                    <span className="menu-card-badge-discount">-{item.discount}%</span>
                  )}
                  {!item.available && (
                    <div className="menu-card-badge-soldout">
                      Sold Out
                    </div>
                  )}
                </div>
                <div className="menu-card-info">
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-price">
                    {item.discount > 0 ? (
                      <>
                        <span className="original">${item.price?.toFixed(2)}</span>
                        <span className="discounted">
                          ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span>${item.price?.toFixed(2)}</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="menu-card-desc">{item.description}</p>
                  )}
                  <button
                    className="btn-outline"
                    disabled={!item.available}
                    style={!item.available ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promotional Banner */}
        <div className="promo-banner">
          <h3>The Morning Ritual</h3>
          <p>Start every day with intention. Our signature morning blends are crafted to awaken your senses.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;
