import './Charts.css';

/**
 * Pure SVG bar chart.
 * Props:
 *   data=[{label, value, color?}] — single-series
 *   OR data=[{label, values:[{value, color, key}]}] — multi-series
 *   maxValue — optional Y ceiling
 *   height   — px height of chart area
 *   title    — optional heading
 *   formatValue — fn(val) => string for value labels
 */
export default function BarChart({
  data = [],
  maxValue,
  height = 200,
  title,
  formatValue = (v) => v,
}) {
  if (!data.length) return null;

  const isMulti = Array.isArray(data[0]?.values);

  const paddingLeft = 48;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 32;
  const svgWidth = 500;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Determine max
  let computedMax;
  if (maxValue != null) {
    computedMax = maxValue;
  } else if (isMulti) {
    computedMax = Math.max(...data.flatMap((d) => d.values.map((v) => v.value)));
  } else {
    computedMax = Math.max(...data.map((d) => d.value));
  }
  computedMax = computedMax || 1;

  const groupCount = data.length;
  const groupWidth = chartWidth / groupCount;
  const groupPad = groupWidth * 0.15;

  // Y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = (computedMax * i) / 4;
    const y = paddingTop + chartHeight - (val / computedMax) * chartHeight;
    return { val, y };
  });

  function getGroupX(i) {
    return paddingLeft + i * groupWidth;
  }

  return (
    <div className="chart-container">
      {title && <p className="chart-title">{title}</p>}
      <div className="bar-chart">
        <svg
          className="bar-chart__svg"
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={title || 'Bar chart'}
          role="img"
        >
          {/* Grid lines */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                className="bar-chart__gridline"
                x1={paddingLeft}
                y1={t.y}
                x2={svgWidth - paddingRight}
                y2={t.y}
              />
              <text
                className="bar-chart__x-label"
                style={{ fontSize: '0.65rem', textAnchor: 'end', fill: 'var(--color-text-secondary, #6B7280)' }}
                x={paddingLeft - 6}
                y={t.y + 4}
              >
                {formatValue(Math.round(t.val))}
              </text>
            </g>
          ))}

          {/* Bars */}
          {data.map((group, i) => {
            const gx = getGroupX(i);

            if (isMulti) {
              const barCount = group.values.length;
              const barWidth = (groupWidth - groupPad * 2) / barCount;
              return (
                <g key={i}>
                  {group.values.map((v, j) => {
                    const barH = (v.value / computedMax) * chartHeight;
                    const bx = gx + groupPad + j * barWidth + barWidth * 0.1;
                    const bw = barWidth * 0.8;
                    const by = paddingTop + chartHeight - barH;
                    return (
                      <g key={j}>
                        <rect
                          className="bar-chart__bar"
                          x={bx}
                          y={by}
                          width={bw}
                          height={Math.max(barH, 2)}
                          fill={v.color || '#4F46E5'}
                          rx={3}
                          aria-label={`${group.label} ${v.key}: ${v.value}`}
                        />
                      </g>
                    );
                  })}
                  <text
                    className="bar-chart__x-label"
                    x={gx + groupWidth / 2}
                    y={height - 8}
                  >
                    {group.label}
                  </text>
                </g>
              );
            }

            // Single series
            const barWidth = groupWidth - groupPad * 2;
            const barH = (group.value / computedMax) * chartHeight;
            const bx = gx + groupPad;
            const by = paddingTop + chartHeight - barH;

            return (
              <g key={i}>
                <rect
                  className="bar-chart__bar"
                  x={bx}
                  y={by}
                  width={barWidth}
                  height={Math.max(barH, 2)}
                  fill={group.color || '#4F46E5'}
                  rx={3}
                  aria-label={`${group.label}: ${group.value}`}
                />
                <text
                  className="bar-chart__value-label"
                  x={bx + barWidth / 2}
                  y={Math.max(by - 4, paddingTop + 10)}
                >
                  {formatValue(group.value)}
                </text>
                <text
                  className="bar-chart__x-label"
                  x={gx + groupWidth / 2}
                  y={height - 8}
                >
                  {group.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
