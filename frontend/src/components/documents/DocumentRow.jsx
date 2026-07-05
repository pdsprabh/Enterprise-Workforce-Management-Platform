import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import { DOCUMENT_TYPE_LABELS } from '../../utils/constants';
import './Documents.css';

const FILE_ICONS = {
  pdf: '📄',
  xlsx: '📊',
  xls: '📊',
  docx: '📝',
  doc: '📝',
  png: '🖼',
  jpg: '🖼',
  jpeg: '🖼',
};

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return FILE_ICONS[ext] || '📁';
}

export default function DocumentRow({ document, onDownload, onDelete }) {
  const { name, type, uploadedBy, uploadedDate, size } = document;

  function handleDelete() {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      if (onDelete) onDelete(document.id);
    }
  }

  return (
    <div className="document-row">
      <div className="document-row__icon" aria-hidden="true">
        {getFileIcon(name)}
      </div>

      <div className="document-row__info">
        <p className="document-row__name" title={name}>{name}</p>
        <p className="document-row__meta">
          Uploaded by {uploadedBy} · {formatDate(uploadedDate)}
        </p>
      </div>

      <Badge variant="default">{DOCUMENT_TYPE_LABELS[type] || type}</Badge>

      <span className="document-row__size">{size}</span>

      <div className="document-row__actions">
        <button
          className="document-row__action-btn"
          onClick={() => { if (onDownload) onDownload(document); }}
          aria-label={`Download ${name}`}
        >
          ↓ Download
        </button>
        <button
          className="document-row__action-btn document-row__action-btn--delete"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
