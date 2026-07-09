import { useState } from 'react';
import Modal from '../ui/Modal';
import DateRangePicker from '../ui/DateRangePicker';
import Button from '../ui/Button';
import { LEAVE_TYPES, LEAVE_TYPE_LABELS } from '../../utils/constants';

/**
 * ApplyLeaveModal — form modal for submitting a leave request.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {(data) => void} onSubmit
 * @param {boolean} loading
 */
export default function ApplyLeaveModal({ isOpen, onClose, onSubmit, loading }) {
  const today = new Date().toISOString().split('T')[0];

  const [type, setType] = useState(LEAVE_TYPES.CASUAL);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [businessDays, setBusinessDays] = useState(0);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  function handleDateChange({ startDate: s, endDate: e, businessDays: bd }) {
    setStartDate(s);
    setEndDate(e);
    setBusinessDays(bd);
  }

  function validate() {
    if (!startDate) return 'Please select a start date.';
    if (!endDate) return 'Please select an end date.';
    if (endDate < startDate) return 'End date must be on or after start date.';
    if (startDate < today) return 'Start date cannot be in the past.';
    if (!reason.trim()) return 'Please provide a reason for your leave.';
    return '';
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    onSubmit({ type, startDate, endDate, businessDays, reason: reason.trim() });
  }

  function handleClose() {
    setType(LEAVE_TYPES.CASUAL);
    setStartDate('');
    setEndDate('');
    setBusinessDays(0);
    setReason('');
    setError('');
    onClose();
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid var(--color-border, #d1d5db)',
    borderRadius: '8px',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: '6px',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Apply for Leave"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>Submit Request</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Leave type */}
        <div>
          <label style={labelStyle}>Leave Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            {Object.values(LEAVE_TYPES).map((t) => (
              <option key={t} value={t}>{LEAVE_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Date range */}
        <div>
          <label style={labelStyle}>Leave Duration</label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            minDate={today}
          />
        </div>

        {/* Reason */}
        <div>
          <label style={labelStyle}>Reason <span style={{ color: 'var(--color-danger)' }}>*</span></label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Briefly describe your reason for leave…"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.85rem', margin: 0 }}>{error}</p>
        )}
      </form>
    </Modal>
  );
}
