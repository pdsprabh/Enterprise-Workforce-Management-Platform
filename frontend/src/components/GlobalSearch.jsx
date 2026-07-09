import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { NAV_SECTIONS } from '../utils/constants';
import './GlobalSearch.css';

// ── Icon map ────────────────────────────────────────────
const CATEGORY_ICONS = {
  Pages:     '🧭',
  Employees: '👤',
  Projects:  '📁',
  Documents: '📄',
  Tickets:   '🎫',
};

// ── Build the static pages list allowed for this user ──
function getPageResults(query, userRole) {
  if (!query) return [];
  const q = query.toLowerCase();
  const pages = NAV_SECTIONS.flatMap(s => s.items).filter(item =>
    (item.allowedRoles.includes('All') || item.allowedRoles.includes(userRole)) &&
    item.label.toLowerCase().includes(q)
  );
  return pages.map(p => ({
    id: `page-${p.path}`,
    category: 'Pages',
    label: p.label,
    subtitle: p.description,
    path: p.path,
  }));
}

export default function GlobalSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 280);

  // ── Fetch live API results ────────────────────────────
  const runSearch = useCallback(async (q) => {
    if (!q || q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const items = [];

    // Pages (static, instant)
    items.push(...getPageResults(q, user?.role));

    // Parallel API calls — each is best-effort
    const [empRes, projRes, docRes, ticketRes] = await Promise.allSettled([
      axiosInstance.get('/employees', { params: { search: q, limit: 5 } }),
      axiosInstance.get('/projects',  { params: { search: q, limit: 5 } }),
      axiosInstance.get('/documents', { params: { search: q } }),
      axiosInstance.get('/helpdesk',  { params: { search: q, limit: 5 } }),
    ]);

    if (empRes.status === 'fulfilled') {
      const data = empRes.value.data?.data || [];
      data.forEach(e => items.push({
        id: `emp-${e._id}`,
        category: 'Employees',
        label: e.name || e.firstName,
        subtitle: `${e.designation || ''} · ${e.department || ''}`.replace(/^ · | · $/, ''),
        path: `/employees/${e._id}`,
      }));
    }

    if (projRes.status === 'fulfilled') {
      const data = projRes.value.data?.data || [];
      data.forEach(p => items.push({
        id: `proj-${p._id}`,
        category: 'Projects',
        label: p.title || p.name,
        subtitle: p.status,
        path: '/projects',
      }));
    }

    if (docRes.status === 'fulfilled') {
      const data = docRes.value.data?.data || [];
      data.slice(0, 5).forEach(d => items.push({
        id: `doc-${d._id}`,
        category: 'Documents',
        label: d.documentName,
        subtitle: d.docType,
        path: '/documents',
      }));
    }

    if (ticketRes.status === 'fulfilled') {
      const data = ticketRes.value.data?.data || ticketRes.value.data || [];
      (Array.isArray(data) ? data : []).slice(0, 5).forEach(t => items.push({
        id: `tkt-${t._id}`,
        category: 'Tickets',
        label: t.title,
        subtitle: `${t.status} · ${t.category || ''}`.replace(/ · $/, ''),
        path: '/helpdesk',
      }));
    }

    setResults(items);
    setIsOpen(items.length > 0);
    setActiveIndex(-1);
    setLoading(false);
  }, [user?.role]);

  useEffect(() => {
    runSearch(debouncedQuery);
  }, [debouncedQuery, runSearch]);

  // ── Keyboard navigation ───────────────────────────────
  function handleKeyDown(e) {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        goTo(results[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function goTo(item) {
    navigate(item.path);
    close();
  }

  function close() {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
    inputRef.current?.blur();
  }

  // ── Close on outside click ────────────────────────────
  useEffect(() => {
    function onOutsideClick(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  // Group results by category for display
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Flat list index → used for arrow-key active tracking
  let flatIndex = -1;

  return (
    <div className="gs-wrapper">
      {/* Input */}
      <div className="gs-input-wrap">
        <svg className="gs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="gs-input"
          placeholder="Search pages, employees, docs…"
          value={query}
          onChange={e => { setQuery(e.target.value); if (!e.target.value) setIsOpen(false); }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          data-global-search-input
        />
        {loading && <span className="gs-spinner" aria-hidden="true" />}
        {query && !loading && (
          <button className="gs-clear" onClick={close} aria-label="Clear search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <kbd className="gs-kbd">⌘K</kbd>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className="gs-dropdown" role="listbox" aria-label="Search results">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="gs-group">
              <div className="gs-group-label">
                <span>{CATEGORY_ICONS[category]}</span> {category}
              </div>
              {items.map(item => {
                flatIndex += 1;
                const idx = flatIndex;
                return (
                  <button
                    key={item.id}
                    className={`gs-result${activeIndex === idx ? ' gs-result--active' : ''}`}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goTo(item)}
                  >
                    <span className="gs-result-icon">{CATEGORY_ICONS[category]}</span>
                    <span className="gs-result-text">
                      <span className="gs-result-label">{item.label}</span>
                      {item.subtitle && <span className="gs-result-sub">{item.subtitle}</span>}
                    </span>
                    <span className="gs-result-arrow">→</span>
                  </button>
                );
              })}
            </div>
          ))}
          <div className="gs-footer">
            <kbd>↑↓</kbd> navigate &nbsp;&nbsp; <kbd>↵</kbd> open &nbsp;&nbsp; <kbd>Esc</kbd> close
          </div>
        </div>
      )}
    </div>
  );
}
