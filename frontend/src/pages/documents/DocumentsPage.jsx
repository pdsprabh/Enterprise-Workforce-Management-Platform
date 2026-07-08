import { useState, useEffect, useMemo } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import DocumentRow from '../../components/documents/DocumentRow';
const DOCUMENT_TYPES = {
  OFFER_LETTER: 'Offer Letter',
  CONTRACT: 'Contract',
  PAYSLIP: 'Payslip',
  ID_PROOF: 'ID Proof',
  POLICY: 'Policy',
  CERTIFICATE: 'Certificate',
  OTHER: 'Other'
};
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import { deleteDocument } from '../../api/documentApi';
import './DocumentsPage.css';

const FILTER_TABS = [
  { key: 'all',                       label: 'All' },
  { key: DOCUMENT_TYPES.OFFER_LETTER, label: 'Offer Letters' },
  { key: DOCUMENT_TYPES.CONTRACT,     label: 'Contracts' },
  { key: DOCUMENT_TYPES.PAYSLIP,      label: 'Payslips' },
  { key: DOCUMENT_TYPES.ID_PROOF,     label: 'ID Proofs' },
  { key: DOCUMENT_TYPES.POLICY,       label: 'Policies' },
  { key: DOCUMENT_TYPES.OTHER,        label: 'Other' },
];

export default function DocumentsPage() {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await api.get('/documents/me');
        const data = res.data.data || [];
        const mappedDocs = data.map(d => ({
          ...d,
          id: d._id,
          name: d.documentName || 'Untitled Document', // Fix: map from documentName
          size: '1 MB', // Dummy size until backend handles it
          uploadedDate: d.createdAt, // Fix: map to uploadedDate as expected by DocumentRow
          uploadedBy: d.uploadedBy ? d.uploadedBy.name : 'System',
          type: d.docType || DOCUMENT_TYPES.OTHER, // Fix: map from docType
          url: d.url
        }));
        setDocuments(mappedDocs);
      } catch (err) {
        console.error(err);
        addToast({ type: 'error', message: 'Failed to load documents.' });
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, [addToast]);

  const filtered = useMemo(() => {
    return documents
      .filter((d) => activeTab === 'all' || d.type === activeTab)
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [documents, activeTab, search]);

  function handleDownload(doc) {
    if (!doc.url) {
      addToast({ type: 'error', message: `No file URL found for "${doc.name}"` });
      return;
    }
    addToast({ type: 'info', message: `Downloading "${doc.name}"…` });
    const link = document.createElement('a');
    link.href = doc.url;
    link.target = '_blank';
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleDelete(id) {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      addToast({ type: 'success', message: 'Document deleted.' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete document.' });
    }
  }

  function handleUpload() {
    addToast({ type: 'info', message: 'Upload feature coming soon!' });
  }

  return (
    <div className="documents-page">
      <div className="documents-page__header">
        <h1 className="documents-page__title">Documents</h1>
        <Button onClick={handleUpload}>↑ Upload Document</Button>
      </div>

      <TabNav tabs={FILTER_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="documents-page__toolbar" style={{ marginTop: 16 }}>
        {/* SearchBar is uncontrolled — it debounces internally and calls onSearch */}
        <SearchBar
          onSearch={setSearch}
          placeholder="Search documents…"
        />
      </div>

      <div className="documents-card">
        {filtered.length === 0 ? (
          <div className="documents-empty">No documents found.</div>
        ) : (
          filtered.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
