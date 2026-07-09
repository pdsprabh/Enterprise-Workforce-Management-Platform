import { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import './SearchBar.css';

export default function SearchBar({ onSearch, placeholder = 'Search...', delay = 300 }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="search-bar">
      <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button className="search-bar__clear" onClick={() => setQuery('')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
    </div>
  );
}
