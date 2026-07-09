import { useRef, useEffect } from 'react';
import './TabNav.css';

/**
 * TabNav — tabbed navigation with animated underline indicator.
 *
 * @param {{ label: string, key: string, icon?: string }[]} tabs
 * @param {string} activeTab
 * @param {(key: string) => void} onTabChange
 */
export default function TabNav({ tabs = [], activeTab, onTabChange }) {
  const tabRefs = useRef({});
  const indicatorRef = useRef(null);

  // Move the animated underline to the active tab
  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    const indicator = indicatorRef.current;
    if (activeEl && indicator) {
      indicator.style.left = `${activeEl.offsetLeft}px`;
      indicator.style.width = `${activeEl.offsetWidth}px`;
    }
  }, [activeTab, tabs]);

  function handleKeyDown(e, key) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(key);
    }
    if (e.key === 'ArrowRight') {
      const idx = tabs.findIndex((t) => t.key === activeTab);
      const next = tabs[(idx + 1) % tabs.length];
      onTabChange(next.key);
    }
    if (e.key === 'ArrowLeft') {
      const idx = tabs.findIndex((t) => t.key === activeTab);
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      onTabChange(prev.key);
    }
  }

  return (
    <div className="tabnav" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={(el) => { tabRefs.current[tab.key] = el; }}
          className={`tabnav__tab${activeTab === tab.key ? ' tabnav__tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.key}
          tabIndex={activeTab === tab.key ? 0 : -1}
          onClick={() => onTabChange(tab.key)}
          onKeyDown={(e) => handleKeyDown(e, tab.key)}
        >
          {tab.label}
        </button>
      ))}
      <span className="tabnav__indicator" ref={indicatorRef} aria-hidden="true" />
    </div>
  );
}
