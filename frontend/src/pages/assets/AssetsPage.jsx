import { useState, useEffect, useCallback } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axiosInstance';
import { formatDate } from '../../utils/formatters';
import './AssetsPage.css';

// ── Helpers ────────────────────────────────────────────────────────
const STATUS_BADGE = {
  Available:   'success',
  Assigned:    'primary',
  Maintenance: 'warning',
  Retired:     'secondary',
};

const ASSET_TYPES = ['Laptop', 'Monitor', 'Phone', 'Keyboard', 'Mouse', 'Tablet', 'Printer', 'Server', 'Other'];
const STATUSES    = ['Available', 'Assigned', 'Maintenance', 'Retired'];

const EMPTY_FORM = {
  assetName:    '',
  assetType:    'Laptop',
  serialNumber: '',
  status:       'Available',
  purchaseDate: '',
};

// ── Summary card ───────────────────────────────────────────────────
function SummaryCard({ label, value, color }) {
  return (
    <div className="assets-summary-card">
      <span className="assets-summary-card__value" style={{ color }}>
        {value}
      </span>
      <span className="assets-summary-card__label">{label}</span>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function AssetsPage() {
  const { user }       = useAuth();
  const { addToast }   = useToast();
  const canManage      = user?.role === 'Super Admin' || user?.role === 'IT Administrator';

  const [assets,      setAssets]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal
  const [showModal,   setShowModal]   = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [formErrors,  setFormErrors]  = useState({});
  const [submitting,  setSubmitting]  = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/assets');
      setAssets(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to load assets' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  // ── Derived data ─────────────────────────────────────────────────
  const filtered = assets.filter(a => {
    const matchSearch =
      a.assetName?.toLowerCase().includes(search.toLowerCase()) ||
      a.assetType?.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
      a.assignedTo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = assets.filter(a => a.status === s).length;
    return acc;
  }, {});

  // ── Form helpers ─────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errors = {};
    if (!form.assetName.trim())    errors.assetName    = 'Asset name is required';
    if (!form.serialNumber.trim()) errors.serialNumber = 'Serial number is required';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.purchaseDate) delete payload.purchaseDate;

      const res = await api.post('/assets', payload);
      setAssets(prev => [res.data.data, ...prev]);
      addToast({ type: 'success', message: `Asset "${form.assetName}" added successfully!` });
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add asset';
      addToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function closeModal() {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="assets-page">
      {/* Header */}
      <div className="assets-page__header">
        <div>
          <h1 className="assets-page__title">Assets</h1>
          <p className="assets-page__subtitle">Hardware and software inventory tracker</p>
        </div>
        {canManage && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Asset
          </Button>
        )}
      </div>

      {/* Summary cards */}
      <div className="assets-summary-row">
        <SummaryCard label="Total Assets"  value={assets.length}         color="var(--color-text-primary)" />
        <SummaryCard label="Available"     value={counts.Available   || 0} color="var(--color-success)"      />
        <SummaryCard label="Assigned"      value={counts.Assigned    || 0} color="var(--color-primary)"      />
        <SummaryCard label="Maintenance"   value={counts.Maintenance || 0} color="var(--color-warning)"      />
        <SummaryCard label="Retired"       value={counts.Retired     || 0} color="var(--color-text-muted)"   />
      </div>

      {/* Filters */}
      <div className="assets-filters">
        <div className="assets-filters__search-wrap">
          <svg className="assets-filters__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="assets-filters__search"
            type="text"
            placeholder="Search by name, type, serial, or assignee…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="assets-filters__status-tabs">
          {['All', ...STATUSES].map(s => (
            <button
              key={s}
              className={`assets-filters__tab ${filterStatus === s ? 'assets-filters__tab--active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="assets-table-wrap">
        {loading ? (
          <p className="assets-empty">Loading assets…</p>
        ) : filtered.length === 0 ? (
          <p className="assets-empty">No assets found.</p>
        ) : (
          <table className="assets-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset._id}>
                  <td className="assets-table__name">{asset.assetName}</td>
                  <td>{asset.assetType}</td>
                  <td className="assets-table__serial">{asset.serialNumber || '—'}</td>
                  <td>{asset.assignedTo?.name || <span className="assets-table__unassigned">Unassigned</span>}</td>
                  <td>
                    <Badge color={STATUS_BADGE[asset.status] || 'secondary'}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td>{asset.purchaseDate ? formatDate(asset.purchaseDate) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Asset Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title="Add New Asset">
        <form onSubmit={handleSubmit} className="asset-form" noValidate>
          <div className="asset-form__grid">
            {/* Asset Name */}
            <div className="asset-form__field asset-form__field--full">
              <label htmlFor="af-name" className="asset-form__label">
                Asset Name <span className="asset-form__required">*</span>
              </label>
              <Input
                id="af-name"
                name="assetName"
                placeholder="e.g. MacBook Pro 14"
                value={form.assetName}
                onChange={handleChange}
              />
              {formErrors.assetName && <p className="asset-form__error">{formErrors.assetName}</p>}
            </div>

            {/* Asset Type */}
            <div className="asset-form__field">
              <label htmlFor="af-type" className="asset-form__label">Asset Type</label>
              <select id="af-type" name="assetType" className="asset-form__select" value={form.assetType} onChange={handleChange}>
                {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Serial Number */}
            <div className="asset-form__field">
              <label htmlFor="af-serial" className="asset-form__label">
                Serial Number <span className="asset-form__required">*</span>
              </label>
              <Input
                id="af-serial"
                name="serialNumber"
                placeholder="e.g. SN-20240701"
                value={form.serialNumber}
                onChange={handleChange}
              />
              {formErrors.serialNumber && <p className="asset-form__error">{formErrors.serialNumber}</p>}
            </div>

            {/* Status */}
            <div className="asset-form__field">
              <label htmlFor="af-status" className="asset-form__label">Status</label>
              <select id="af-status" name="status" className="asset-form__select" value={form.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Purchase Date */}
            <div className="asset-form__field">
              <label htmlFor="af-date" className="asset-form__label">Purchase Date</label>
              <input
                id="af-date"
                name="purchaseDate"
                type="date"
                className="asset-form__select"
                value={form.purchaseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="asset-form__actions">
            <Button type="button" variant="secondary" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? 'Adding…' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
