import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { uploadDocument, updateDocument } from '../../api/documentApi';

const DOC_TYPES = ['Policy', 'ID Proof', 'Certificate', 'Offer Letter', 'Other'];
const ALL_ROLES = ['Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'];

export default function DocumentFormModal({ isOpen, onClose, onSaved, organizations = [], editDoc = null, isAdmin = false }) {
  const { addToast } = useToast();
  // Compatibility shim for showToast('msg', 'type') call pattern
  const showToast = (message, type = 'info') => addToast({ type, message });
  const isEdit = !!editDoc;

  const [form, setForm] = useState({
    documentName: '',
    docType: 'Policy',
    organizationId: '',
    allowedRoles: [],
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editDoc) {
        setForm({
          documentName: editDoc.documentName || '',
          docType: editDoc.docType || 'Policy',
          organizationId: editDoc.organization?._id || '',
          allowedRoles: editDoc.allowedRoles || [],
        });
      } else {
        setForm({ documentName: '', docType: 'Policy', organizationId: '', allowedRoles: [] });
      }
      setFile(null);
    }
  }, [isOpen, editDoc]);

  function toggleRole(role) {
    setForm(prev => ({
      ...prev,
      allowedRoles: prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter(r => r !== role)
        : [...prev.allowedRoles, role],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isEdit && !file) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    if (!form.documentName.trim()) {
      showToast('Document name is required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('documentName', form.documentName.trim());
      fd.append('docType', form.docType);
      
      // Only append organizationId if admin and selected
      if (isAdmin && form.organizationId) {
        fd.append('organizationId', form.organizationId);
      }
      
      fd.append('allowedRoles', JSON.stringify(form.allowedRoles));
      if (file) fd.append('file', file);

      if (isEdit) {
        await updateDocument(editDoc._id, fd);
        showToast('Document updated successfully.', 'success');
      } else {
        await uploadDocument(fd);
        showToast('Document uploaded successfully.', 'success');
      }
      onSaved();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Document' : 'Upload Document'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" form="doc-form" loading={saving}>
            {isEdit ? 'Save Changes' : 'Upload'}
          </Button>
        </>
      }
    >
      <form id="doc-form" onSubmit={handleSubmit} className="doc-form">
        <div className="doc-form__field">
          <label htmlFor="doc-name">Document Name *</label>
          <input
            id="doc-name"
            type="text"
            value={form.documentName}
            onChange={e => setForm(f => ({ ...f, documentName: e.target.value }))}
            placeholder="e.g. Employee Handbook 2025"
            required
          />
        </div>

        <div className="doc-form__field">
          <label htmlFor="doc-type">Document Type *</label>
          <select
            id="doc-type"
            value={form.docType}
            onChange={e => setForm(f => ({ ...f, docType: e.target.value }))}
          >
            {DOC_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <div className="doc-form__field">
            <label htmlFor="doc-org">Organization (leave blank for platform-wide)</label>
            <select
              id="doc-org"
              value={form.organizationId}
              onChange={e => setForm(f => ({ ...f, organizationId: e.target.value }))}
            >
              <option value="">— Platform-Wide —</option>
              {organizations.map(org => (
                <option key={org._id} value={org._id}>{org.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="doc-form__field">
          <label>Allowed Roles (empty = all roles)</label>
          <div className="doc-form__roles">
            {ALL_ROLES.map(role => (
              <label key={role} className="doc-form__role-check">
                <input
                  type="checkbox"
                  checked={form.allowedRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>

        <div className="doc-form__field">
          <label htmlFor="doc-file">
            {isEdit ? 'Replace File (optional)' : 'File * (PDF, DOC, DOCX — max 5 MB)'}
          </label>
          <input
            id="doc-file"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => setFile(e.target.files[0] || null)}
          />
        </div>
      </form>
    </Modal>
  );
}
