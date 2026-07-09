import './Charts.css';

/**
 * CSS conic-gradient donut chart.
 * Props:
 *   segments=[{label, value, color}]
 *   size      — px diameter of the ring (default 160)
 *   innerLabel — string or null for center label
 *   title     — optional heading above chart
 */
export default function DonutChart({ segments = [], size = 160, innerLabel, title }) {
  if (!segments.length) return null;

  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Build conic-gradient stops
  let cumulative = 0;
  const stops = segments.map((seg) => {
    const pct = (seg.value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return `${seg.color} ${start.toFixed(2)}% ${cumulative.toFixed(2)}%`;
  });

  const ringStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: `conic-gradient(${stops.join(', ')})`,
    flexShrink: 0,
  };

  // Donut hole via inner circle overlay
  const holeSize = size * 0.58;
  const holeStyle = {
    position: 'absolute',
    width: holeSize,
    height: holeSize,
    borderRadius: '50%',
    background: 'var(--color-bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="chart-container">
      {title && <p className="chart-title">{title}</p>}
      <div className="donut-chart">
        <div className="donut-chart__ring-wrapper">
          <div style={ringStyle} role="img" aria-label={title || 'Donut chart'} />
          <div style={holeStyle}>
            {innerLabel && (
              <span className="donut-chart__center-value">{innerLabel}</span>
            )}
          </div>
        </div>

        <div className="donut-chart__legend">
          {segments.map((seg) => (
            <div key={seg.label} className="donut-chart__legend-item">
              <span
                className="donut-chart__legend-dot"
                style={{ background: seg.color }}
                aria-hidden="true"
              />
              {seg.label} {((seg.value / total) * 100).toFixed(0)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
