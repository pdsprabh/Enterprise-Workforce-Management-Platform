import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  getAllDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats,
} from '../../api/documentApi';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../components/ui/Toast';
import DocumentFormModal from '../../components/documents/DocumentFormModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/ui/SearchBar';
import { formatDate } from '../../utils/formatters';
import './SuperAdminDocumentsPage.css';

const DOC_TYPES = ['Policy', 'ID Proof', 'Certificate', 'Offer Letter', 'Other'];
const ALL_ROLES = ['Organization Admin', 'HR Manager', 'Employee', 'IT Administrator'];

const TYPE_BADGE_VARIANT = {
  Policy: 'success',
  'ID Proof': 'warning',
  Certificate: 'info',
  'Offer Letter': 'primary',
  Other: 'default',
};

const FILE_ICONS = { pdf: '📄', docx: '📝', doc: '📝' };
function fileIcon(name = '') {
  const ext = name.split('.').pop().toLowerCase();
  return FILE_ICONS[ext] || '📁';
}


// ── Main page ────────────────────────────────────────────
export default function SuperAdminDocumentsPage() {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const showToast = (message, type = 'info') => addToast({ type, message });

  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterOrg, setFilterOrg] = useState('');
  const [filterType, setFilterType] = useState('');

  // Modals
  const [showUpload, setShowUpload] = useState(false);
  const [editDoc, setEditDoc] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterOrg) params.organizationId = filterOrg;
      if (filterType) params.docType = filterType;

      const [docsRes, statsRes] = await Promise.all([
        getAllDocuments(params),
        getDocumentStats(),
      ]);
      setDocuments(docsRes.data.data || []);
      setStats(statsRes.data.data || null);
    } catch (err) {
      showToast('Failed to load documents.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterOrg, filterType, showToast]);

  // Load organizations once
  useEffect(() => {
    axiosInstance.get('/organizations')
      .then(res => setOrganizations(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.documentName}"? This cannot be undone.`)) return;
    try {
      await deleteDocument(doc._id);
      showToast('Document deleted.', 'success');
      fetchDocuments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed.', 'error');
    }
  }

  function handleModalSaved() {
    setShowUpload(false);
    setEditDoc(null);
    fetchDocuments();
  }

  return (
    <div className="sa-docs">
      {/* Header */}
      <div className="sa-docs__header">
        <div>
          <h1 className="sa-docs__title">Document Management</h1>
          <p className="sa-docs__subtitle">Platform-wide document repository across all organizations</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>↑ Upload Document</Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="sa-docs__stats">
          <div className="sa-docs__stat-card">
            <span className="sa-docs__stat-num">{documents.length}</span>
            <span className="sa-docs__stat-label">Total Documents</span>
          </div>
          {stats.byType?.map(s => (
            <div className="sa-docs__stat-card" key={s._id}>
              <span className="sa-docs__stat-num">{s.count}</span>
              <span className="sa-docs__stat-label">{s._id}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="sa-docs__filters">
        <SearchBar onSearch={setSearch} placeholder="Search by document name…" />

        <select
          className="sa-docs__filter-select"
          value={filterOrg}
          onChange={e => setFilterOrg(e.target.value)}
        >
          <option value="">All Organizations</option>
          {organizations.map(org => (
            <option key={org._id} value={org._id}>{org.name}</option>
          ))}
        </select>

        <select
          className="sa-docs__filter-select"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {DOC_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="sa-docs__card">
        {loading ? (
          <div className="sa-docs__empty">Loading documents…</div>
        ) : documents.length === 0 ? (
          <div className="sa-docs__empty">No documents found.</div>
        ) : (
          <table className="sa-docs__table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Organization</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc._id}>
                  <td>
                    <div className="sa-docs__doc-name">
                      <span className="sa-docs__doc-icon">{fileIcon(doc.documentName)}</span>
                      <span title={doc.documentName}>{doc.documentName}</span>
                    </div>
                  </td>
                  <td>
                    <Badge variant={TYPE_BADGE_VARIANT[doc.docType] || 'default'}>
                      {doc.docType}
                    </Badge>
                  </td>
                  <td>{doc.organization?.name || <em className="sa-docs__platform">Platform-Wide</em>}</td>
                  <td>{doc.uploadedBy?.name || '—'}</td>
                  <td>{formatDate(doc.createdAt)}</td>
                  <td>
                    {doc.allowedRoles?.length === 0
                      ? <span className="sa-docs__all-roles">All</span>
                      : doc.allowedRoles.map(r => (
                          <span key={r} className="sa-docs__role-chip">{r}</span>
                        ))
                    }
                  </td>
                  <td>
                    <div className="sa-docs__actions">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="sa-docs__action-btn"
                        aria-label="View"
                      >
                        👁 View
                      </a>
                      <button
                        className="sa-docs__action-btn"
                        onClick={() => setEditDoc(doc)}
                        aria-label="Edit"
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="sa-docs__action-btn sa-docs__action-btn--delete"
                        onClick={() => handleDelete(doc)}
                        aria-label="Delete"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload modal */}
      <DocumentFormModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSaved={handleModalSaved}
        organizations={organizations}
        editDoc={null}
        isAdmin={true}
      />

      {/* Edit modal */}
      <DocumentFormModal
        isOpen={!!editDoc}
        onClose={() => setEditDoc(null)}
        onSaved={handleModalSaved}
        organizations={organizations}
        editDoc={editDoc}
        isAdmin={true}
      />
    </div>
  );
}
