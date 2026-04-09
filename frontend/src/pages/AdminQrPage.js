import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';
import '../App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8081';

const AdminQrPage = () => {
  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/branches')
      .then(res => {
        setBranches(res.data);
        if (res.data.length > 0) {
          setSelectedBranch(res.data[0].id);
        }
      })
      .catch(() => toast.error('Failed to load branches'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      api.get(`/api/tables/branch/${selectedBranch}`)
        .then(res => setTables(res.data))
        .catch(() => setTables([]));
    }
  }, [selectedBranch]);

  const downloadQr = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${filename}`);
  };

  const downloadAllTableQrs = () => {
    tables.forEach((table, i) => {
      setTimeout(() => {
        downloadQr(
          `${API_BASE}/api/qr/table/${table.id}`,
          `qr-table-${table.tableNumber}-${currentBranchName}.png`
        );
      }, i * 300);
    });
  };

  const currentBranch = branches.find(b => b.id === Number(selectedBranch));
  const currentBranchName = currentBranch ? currentBranch.name.replace(/\s+/g, '-') : 'branch';

  if (loading) {
    return (
      <AdminLayout activeItem="qr">
        <div style={{ padding: '48px', textAlign: 'center', color: '#78716c' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="qr">
      <div className="admin-header">
        <h1>QR Code Management</h1>
        <p style={{ color: '#78716c', marginTop: '4px' }}>Generate and download QR codes for your branches and tables</p>
      </div>

      {/* Branch Selector */}
      <div style={{ marginBottom: '32px' }}>
        <label className="form-label">Select Branch</label>
        <select
          className="form-select"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          style={{ maxWidth: '400px' }}
        >
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
          ))}
        </select>
      </div>

      {/* Branch-level QR codes */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '16px', fontSize: '20px' }}>Branch QR Codes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>

          {/* Branch Landing QR */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '4px', color: 'var(--primary)' }}>Branch Landing Page</h3>
            <p style={{ color: '#78716c', fontSize: '13px', marginBottom: '16px' }}>
              Leads to branch info, menu & reviews
            </p>
            <img
              src={`${API_BASE}/api/qr/branch/${selectedBranch}`}
              alt="Branch QR"
              style={{ width: '200px', height: '200px', borderRadius: '12px', border: '1px solid #e7e5e4' }}
            />
            <p style={{ color: '#a8a29e', fontSize: '12px', margin: '12px 0' }}>
              /branch/{selectedBranch}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => downloadQr(`${API_BASE}/api/qr/branch/${selectedBranch}`, `qr-branch-${currentBranchName}.png`)}
            >
              Download PNG
            </button>
          </div>

          {/* Review QR */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '4px', color: 'var(--primary)' }}>Review Submission</h3>
            <p style={{ color: '#78716c', fontSize: '13px', marginBottom: '16px' }}>
              Customers can leave a review directly
            </p>
            <img
              src={`${API_BASE}/api/qr/review/${selectedBranch}`}
              alt="Review QR"
              style={{ width: '200px', height: '200px', borderRadius: '12px', border: '1px solid #e7e5e4' }}
            />
            <p style={{ color: '#a8a29e', fontSize: '12px', margin: '12px 0' }}>
              /review?branch={selectedBranch}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => downloadQr(`${API_BASE}/api/qr/review/${selectedBranch}`, `qr-review-${currentBranchName}.png`)}
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>

      {/* Table QR codes */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '20px' }}>
            Table QR Codes ({tables.length} tables)
          </h2>
          {tables.length > 0 && (
            <button className="btn btn-outline" onClick={downloadAllTableQrs}>
              Download All
            </button>
          )}
        </div>

        {tables.length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: '#78716c' }}>
            No tables found for this branch
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {tables.map(table => (
              <div className="card" key={table.id} style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '2px' }}>Table #{table.tableNumber}</h3>
                <p style={{ color: '#78716c', fontSize: '13px', marginBottom: '12px' }}>
                  Capacity: {table.capacity} guests
                </p>
                <img
                  src={`${API_BASE}/api/qr/table/${table.id}`}
                  alt={`Table ${table.tableNumber} QR`}
                  style={{ width: '160px', height: '160px', borderRadius: '8px', border: '1px solid #e7e5e4' }}
                />
                <p style={{ color: '#a8a29e', fontSize: '11px', margin: '8px 0' }}>
                  /menu?table={table.id}
                </p>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => downloadQr(`${API_BASE}/api/qr/table/${table.id}`, `qr-table-${table.tableNumber}-${currentBranchName}.png`)}
                  style={{ width: '100%' }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQrPage;
