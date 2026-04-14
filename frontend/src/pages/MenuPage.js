import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const ITEM_IMAGE_MAP = {
  'Flat White': '/images/menu/flat-white.jpg',
  'Cappuccino': '/images/menu/cappuccino.jpg',
  'Americano': '/images/menu/americano.jpg',
  'Iced Vanilla Latte': '/images/menu/iced-latte.jpg',
  'Iced Latte': '/images/menu/iced-latte.jpg',
  'Hazelnut Croissant': '/images/menu/croissant.jpg',
  'Croissant': '/images/menu/croissant.jpg',
  'Single Origin V60': '/images/menu/pour-over.jpg',
  'V60 Pour Over': '/images/menu/pour-over.jpg',
  'Artisan Avo Toast': '/images/menu/avo-toast.jpg',
  'Avocado Toast': '/images/menu/avo-toast.jpg',
  'Signature Cold Brew': '/images/menu/cold-brew.jpg',
  'Cold Brew': '/images/menu/cold-brew.jpg',
  'Matcha Latte': '/images/menu/matcha-latte.jpg',
  'Mochi Set': '/images/menu/mochi.jpg',
  'Tiramisu': '/images/menu/tiramisu.jpg',
  'Cheesecake': '/images/menu/cheesecake.jpg',
  'Macarons': '/images/menu/macarons.jpg',
  'Brownie': '/images/menu/brownie.jpg',
  'Pancakes': '/images/menu/pancakes.jpg',
  'Burger': '/images/menu/burger.jpg',
  'Pasta': '/images/menu/pasta.jpg',
  'Bagel': '/images/menu/bagel.jpg',
};

const PLACEHOLDER_IMAGES = [
  '/images/menu/flat-white.jpg',
  '/images/menu/iced-latte.jpg',
  '/images/menu/croissant.jpg',
  '/images/menu/pour-over.jpg',
  '/images/menu/avo-toast.jpg',
  '/images/menu/cold-brew.jpg',
  '/images/menu/matcha-latte.jpg',
  '/images/menu/cappuccino.jpg',
];

const API_BASE = api.defaults.baseURL || '';
const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/api/')) return `${API_BASE}${url}`;
  return url;
};

const getItemImage = (item, index) => {
  if (item.imageUrl) return resolveImg(item.imageUrl);
  if (ITEM_IMAGE_MAP[item.name]) return ITEM_IMAGE_MAP[item.name];
  for (const key in ITEM_IMAGE_MAP) {
    if (item.name?.toLowerCase().includes(key.toLowerCase())) return ITEM_IMAGE_MAP[key];
  }
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};

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
    ? menuItems.filter((item) => Number(item.categoryId) === Number(activeCategory))
    : menuItems;

  const getPlaceholderImage = (index) => PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde8d8 0%, #d4ecd6 33%, #f5deb3 66%, #fde8d8 100%)',
      marginTop: 64,
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: '3rem',
          paddingBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1c1917', margin: 0 }}>
              Artisan Menu
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: '#7A6E64',
              fontStyle: 'italic',
              maxWidth: 540,
              margin: '0.5rem 0 0',
            }}>
              "Sourced with integrity, roasted with precision, and served with a story in every cup."
            </p>
          </div>

          {/* Branch Selector */}
          <select
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e.target.value);
              setActiveCategory(null);
            }}
            style={{
              maxWidth: 240,
              borderRadius: 9999,
              border: '1.5px solid rgba(80, 69, 62, 0.2)',
              padding: '0.5rem 2.5rem 0.5rem 1rem',
              background: '#fff',
              fontSize: '0.9rem',
              color: '#1c1917',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'auto',
            }}
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              background: activeCategory === null ? '#1c1917' : '#f5f0eb',
              color: activeCategory === null ? '#fff' : '#3D3028',
              border: 'none',
              borderRadius: 9999,
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? '#1c1917' : '#f5f0eb',
                color: activeCategory === cat.id ? '#fff' : '#3D3028',
                border: 'none',
                borderRadius: 9999,
                padding: '0.5rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c', fontSize: '1rem' }}>
            Loading menu...
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c', fontSize: '1rem' }}>
            <p>No items found in this category.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            paddingBottom: '2rem',
          }}>
            {filteredItems.map((item, index) => (
              <div key={item.id} style={{
                borderRadius: 24,
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{
                  position: 'relative', width: '100%', height: 200, overflow: 'hidden',
                  background: 'linear-gradient(135deg, #6F4E37, #A0785A)',
                }}>
                  <img
                    src={getItemImage(item, index)}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  {item.discount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: '#D94452',
                      color: '#fff',
                      padding: '0.25rem 0.7rem',
                      borderRadius: 9999,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      -{item.discount}%
                    </span>
                  )}
                  {!item.available && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      letterSpacing: '0.5px',
                    }}>
                      Sold Out
                    </div>
                  )}
                </div>
                <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#1c1917' }}>{item.name}</span>
                    {item.available ? (
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#6F4E37' }}>
                        {item.discount > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#A89E95', fontSize: '0.9rem', marginRight: '0.4rem' }}>
                              ${item.price?.toFixed(2)}
                            </span>
                            <span>${(item.price * (1 - item.discount / 100)).toFixed(2)}</span>
                          </>
                        ) : (
                          <span>${item.price?.toFixed(2)}</span>
                        )}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>Unavailable</span>
                    )}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: '#78716c', margin: '0.4rem 0 0', lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promotional Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2C1810, #6F4E37)',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            The Morning Ritual
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', margin: 0, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Start every day with intention. Our signature morning blends are crafted to awaken your senses.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuPage;
