import './KanbanBoard.css';

/**
 * KanbanBoard — column-based board layout (no drag-and-drop).
 *
 * @param {{ title: string, key: string, color: string, items: any[] }[]} columns
 * @param {(item: any, column: { key, title }) => React.ReactNode} renderItem
 */
export default function KanbanBoard({ columns = [], renderItem }) {
  return (
    <div
      className="kanban"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))` }}
    >
      {columns.map((col) => (
        <div key={col.key} className="kanban__column">
          <div className="kanban__column-header" style={{ background: col.color || '#6b7280' }}>
            <span>{col.title}</span>
            <span className="kanban__column-count">{col.items.length}</span>
          </div>
          <div className="kanban__column-body">
            {col.items.length === 0 ? (
              <p className="kanban__empty">No items</p>
            ) : (
              col.items.map((item, idx) => (
                <div key={item.id || idx}>
                  {renderItem ? renderItem(item, col) : null}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
