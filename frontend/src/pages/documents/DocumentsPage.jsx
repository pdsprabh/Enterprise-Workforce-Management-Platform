import { useState, useMemo } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import DocumentRow from '../../components/documents/DocumentRow';
import { mockDocuments } from '../../utils/mockData';
import { DOCUMENT_TYPES } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';
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
  const { showToast } = useToast();
  const [documents, setDocuments] = useState(mockDocuments);
  const [activeTab, setActiveTab] = useState('all');
  // SearchBar manages its own debounce internally; we just receive the final value
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return documents
      .filter((d) => activeTab === 'all' || d.type === activeTab)
      .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [documents, activeTab, search]);

  function handleDownload(doc) {
    showToast(`Downloading "${doc.name}"…`, 'info');
  }

  function handleDelete(id) {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Document deleted.', 'success');
  }

  function handleUpload() {
    showToast('Upload feature coming soon!', 'info');
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
