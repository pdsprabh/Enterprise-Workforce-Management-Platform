import './DataTable.css';

export default function DataTable({ 
  columns, 
  data, 
  onRowClick,
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No data available'
}) {
  if (isLoading) {
    return (
      <div className="datatable__loading">
        <div className="spinner spinner--md" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="datatable__empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="datatable-wrapper">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr 
              key={row[keyField]} 
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? 'datatable__row--clickable' : ''}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
