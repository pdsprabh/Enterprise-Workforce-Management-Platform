import { useState } from 'react';
import './Charts.css';

/**
 * Pure SVG line chart.
 * Props: data=[{label, value}], color, height, unit, title
 */
export default function LineChart({ data = [], color = '#4F46E5', height = 180, unit = '', title }) {
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) return null;

  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;
  const svgWidth = 500; // viewBox width (responsive via preserveAspectRatio)
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  function getX(i) {
    return paddingLeft + (i / (data.length - 1)) * chartWidth;
  }

  function getY(val) {
    return paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
  }

  // Build SVG path (cubic bezier for smoothness)
  function buildPath() {
    return data
      .map((d, i) => {
        const x = getX(i);
        const y = getY(d.value);
        if (i === 0) return `M ${x} ${y}`;
        const prevX = getX(i - 1);
        const prevY = getY(data[i - 1].value);
        const cpX = (prevX + x) / 2;
        return `C ${cpX} ${prevY}, ${cpX} ${y}, ${x} ${y}`;
      })
      .join(' ');
  }

  // Area path (closed below the line)
  function buildArea() {
    const linePath = buildPath();
    const lastX = getX(data.length - 1);
    const firstX = getX(0);
    const baseY = paddingTop + chartHeight;
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }

  // Y-axis labels (4 ticks)
  const yTicks = Array.from({ length: 4 }, (_, i) => {
    const val = minVal + (range * i) / 3;
    return { val: Math.round(val), y: getY(val) };
  });

  return (
    <div className="chart-container">
      {title && <p className="chart-title">{title}</p>}
      <div className="line-chart">
        <svg
          className="line-chart__svg"
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={title || 'Line chart'}
          role="img"
        >
          {/* Grid lines */}
          {yTicks.map((t) => (
            <g key={t.val}>
              <line
                className="line-chart__gridline"
                x1={paddingLeft}
                y1={t.y}
                x2={svgWidth - paddingRight}
                y2={t.y}
              />
              <text className="line-chart__y-label" x={paddingLeft - 6} y={t.y + 4}>
                {t.val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={buildArea()} fill={color} className="line-chart__area" />

          {/* Line */}
          <path d={buildPath()} stroke={color} className="line-chart__line" />

          {/* X-axis labels & data points */}
          {data.map((d, i) => (
            <g key={i}>
              <text className="line-chart__x-label" x={getX(i)} y={height - 6}>
                {d.label}
              </text>
              <circle
                className="line-chart__point"
                cx={getX(i)}
                cy={getY(d.value)}
                r={4}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
                onMouseEnter={() => setTooltip({ x: getX(i), y: getY(d.value), label: d.label, value: d.value })}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          ))}

          {/* Tooltip */}
          {tooltip && (
            <g className="line-chart__tooltip">
              <rect
                x={tooltip.x - 32}
                y={tooltip.y - 34}
                width={64}
                height={24}
                rx={4}
                fill="var(--color-text-primary)"
                fillOpacity={0.85}
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 18}
                textAnchor="middle"
                fontSize={11}
                fill="#fff"
              >
                {tooltip.value}{unit}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
