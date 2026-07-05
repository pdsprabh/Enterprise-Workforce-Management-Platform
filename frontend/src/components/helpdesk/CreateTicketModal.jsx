import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { TICKET_CATEGORY, TICKET_CATEGORY_LABELS, TICKET_PRIORITY, TICKET_PRIORITY_LABELS } from '../../utils/constants';
import './Helpdesk.css';

const PRIORITY_OPTIONS = [
  { key: TICKET_PRIORITY.LOW,    label: TICKET_PRIORITY_LABELS[TICKET_PRIORITY.LOW] },
  { key: TICKET_PRIORITY.MEDIUM, label: TICKET_PRIORITY_LABELS[TICKET_PRIORITY.MEDIUM] },
  { key: TICKET_PRIORITY.HIGH,   label: TICKET_PRIORITY_LABELS[TICKET_PRIORITY.HIGH] },
  { key: TICKET_PRIORITY.URGENT, label: TICKET_PRIORITY_LABELS[TICKET_PRIORITY.URGENT] },
];

const CATEGORY_OPTIONS = [
  { key: TICKET_CATEGORY.IT,         label: TICKET_CATEGORY_LABELS[TICKET_CATEGORY.IT] },
  { key: TICKET_CATEGORY.HR,         label: TICKET_CATEGORY_LABELS[TICKET_CATEGORY.HR] },
  { key: TICKET_CATEGORY.ADMIN,      label: TICKET_CATEGORY_LABELS[TICKET_CATEGORY.ADMIN] },
  { key: TICKET_CATEGORY.FACILITIES, label: TICKET_CATEGORY_LABELS[TICKET_CATEGORY.FACILITIES] },
  { key: TICKET_CATEGORY.OTHER,      label: TICKET_CATEGORY_LABELS[TICKET_CATEGORY.OTHER] },
];

const DEFAULT_FORM = {
  title: '',
  category: TICKET_CATEGORY.IT,
  priority: TICKET_PRIORITY.MEDIUM,
  description: '',
};

export default function CreateTicketModal({ isOpen, onClose, onSubmit }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    else if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    if (onSubmit) onSubmit({ ...form, id: `tkt-${Date.now()}`, createdAt: new Date().toISOString() });
    showToast('Ticket created successfully!', 'success');
    setForm(DEFAULT_FORM);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  }

  function handleClose() {
    setForm(DEFAULT_FORM);
    setErrors({});
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Support Ticket"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Ticket
          </Button>
        </>
      }
    >
      <div className="create-ticket-modal">
        <Input
          label="Title"
          placeholder="Brief description of the issue"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          error={errors.title}
          required
        />

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', display: 'block', marginBottom: 6 }}>
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9rem',
            }}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="create-ticket-modal__priority-label">Priority</span>
          <div className="priority-selector">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p.key}
                className={`priority-pill priority-pill--${p.key}${form.priority === p.key ? ' priority-pill--selected' : ''}`}
                onClick={() => setForm((f) => ({ ...f, priority: p.key }))}
                type="button"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', display: 'block', marginBottom: 6 }}>
            Description <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the issue in detail (min. 20 characters)"
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${errors.description ? '#EF4444' : 'var(--color-border)'}`,
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9rem',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
          {errors.description && (
            <p style={{ color: '#EF4444', fontSize: '0.8125rem', marginTop: 4 }}>{errors.description}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
