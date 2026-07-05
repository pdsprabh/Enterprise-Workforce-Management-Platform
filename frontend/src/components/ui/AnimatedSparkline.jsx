import { useRef, useState, useEffect, useId } from 'react';
import './AnimatedSparkline.css';

/**
 * AnimatedSparkline
 *
 * A self-contained SVG sparkline that:
 *  - Draws its line with a stroke-dashoffset animation on mount
 *  - Fills the area under the curve with a gradient (fades in after draw)
 *  - Pulses a dot at the most recent data point
 *  - Shows an interactive tooltip on hover
 *
 * Props:
 *   data        {Array<{label:string, value:number}>}  required
 *   height      {number}   default 100
 *   color       {string}   default '#6366f1'   — line + gradient start colour
 *   showArea    {boolean}  default true
 *   showDot     {boolean}  default true
 *   showLabels  {boolean}  default true        — x-axis labels
 *   showTooltip {boolean}  default true
 *   strokeWidth {number}   default 2.5
 *   smooth      {boolean}  default true        — cubic bezier vs straight segments
 *   formatValue {function} default v => v      — formats tooltip value
 */
export default function AnimatedSparkline({
  data = [],
  height = 100,
  color = '#6366f1',
  showArea = true,
  showDot = true,
  showLabels = true,
  showTooltip = true,
  strokeWidth = 2.5,
  smooth = true,
  formatValue = v => v,
}) {
  const id          = useId().replace(/:/g, '');
  const svgRef      = useRef(null);
  const [pathLen,   setPathLen]   = useState(0);
  const [tooltip,   setTooltip]   = useState(null); // {x, y, label, value}
  const [hovIdx,    setHovIdx]    = useState(null);

  // ── Layout constants ──────────────────────────────────────────
  const PAD_L = 4, PAD_R = 4, PAD_T = 10, PAD_B = showLabels ? 0 : 4;
  const W = 500; // SVG viewBox width (scales with CSS)
  const H = height - (showLabels ? 18 : 0);

  if (!data || data.length < 2) return null;

  const values  = data.map(d => d.value);
  const minVal  = Math.min(...values);
  const maxVal  = Math.max(...values);
  const range   = maxVal - minVal || 1;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  // Map data → SVG coordinates
  const points = data.map((d, i) => ({
    x: PAD_L + (i / (data.length - 1)) * chartW,
    y: PAD_T + chartH - ((d.value - minVal) / range) * chartH,
    label: d.label,
    value: d.value,
  }));

  // ── Path builders ─────────────────────────────────────────────
  function buildLinePath(pts) {
    if (!smooth) {
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    }
    // Catmull-Rom → cubic bezier
    return pts.map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev  = pts[i - 1];
      const cp1x  = prev.x + (p.x - prev.x) * 0.4;
      const cp1y  = prev.y;
      const cp2x  = p.x   - (p.x - prev.x) * 0.4;
      const cp2y  = p.y;
      return `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`;
    }).join(' ');
  }

  function buildAreaPath(pts) {
    const base = PAD_T + chartH;
    const line = buildLinePath(pts);
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `${line} L${last.x},${base} L${first.x},${base} Z`;
  }

  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);
  const lastPt   = points[points.length - 1];

  // Measure path length after render to drive the draw animation
  useEffect(() => {
    if (!svgRef.current) return;
    const pathEl = svgRef.current.querySelector('.sparkline__line');
    if (pathEl) setPathLen(pathEl.getTotalLength());
  }, [data, smooth]);

  // ── Hover interaction ─────────────────────────────────────────
  function handleMouseMove(e) {
    if (!showTooltip) return;
    const rect   = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    // Find nearest point
    let closest = 0;
    let minDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - mouseX);
      if (d < minDist) { minDist = d; closest = i; }
    });
    const pt = points[closest];
    const px = (pt.x / W) * rect.width + rect.left - rect.left; // px within SVG element
    const py = (pt.y / H) * rect.height;
    setHovIdx(closest);
    setTooltip({ x: (pt.x / W) * 100, y: py, label: pt.label, value: pt.value });
  }

  function handleMouseLeave() {
    setHovIdx(null);
    setTooltip(null);
  }

  const gradId  = `sg-${id}`;
  const clipId  = `sc-${id}`;

  return (
    <div
      className="sparkline"
      style={{ height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        ref={svgRef}
        className="sparkline__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient fill */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>

          {/* Clip so the area doesn't overflow padded area */}
          <clipPath id={clipId}>
            <rect x={PAD_L} y={PAD_T} width={chartW} height={chartH} />
          </clipPath>
        </defs>

        {/* Subtle horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = PAD_T + chartH - pct * chartH;
          return (
            <line
              key={pct}
              x1={PAD_L} y1={y} x2={PAD_L + chartW} y2={y}
              stroke="var(--color-border, #374151)"
              strokeWidth="0.8"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          );
        })}

        {/* Area fill */}
        {showArea && pathLen > 0 && (
          <path
            className="sparkline__area"
            d={areaPath}
            fill={`url(#${gradId})`}
            clipPath={`url(#${clipId})`}
          />
        )}

        {/* Animated line */}
        {pathLen > 0 ? (
          <path
            key={`line-${data.length}`}
            className="sparkline__line"
            d={linePath}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen}
            style={{ '--sparkline-len': pathLen }}
          />
        ) : (
          /* Render once (no animation) to measure length */
          <path
            className="sparkline__line"
            d={linePath}
            stroke={color}
            strokeWidth={strokeWidth}
            style={{ strokeDasharray: 'none' }}
          />
        )}

        {/* Pulse dot at last point */}
        {showDot && pathLen > 0 && (
          <>
            <circle
              className="sparkline__dot-pulse"
              cx={lastPt.x} cy={lastPt.y}
              r={6}
              fill={color}
              opacity={0}
            />
            <circle
              className="sparkline__dot"
              cx={lastPt.x} cy={lastPt.y}
              r={4}
              fill={color}
              stroke="var(--color-bg-primary, #1f2937)"
              strokeWidth={2}
            />
          </>
        )}

        {/* Hover crosshair dot */}
        {hovIdx !== null && (
          <>
            <line
              x1={points[hovIdx].x} y1={PAD_T}
              x2={points[hovIdx].x} y2={PAD_T + chartH}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <circle
              className="sparkline__hover-dot"
              cx={points[hovIdx].x} cy={points[hovIdx].y}
              r={5}
              fill="var(--color-bg-primary, #1f2937)"
              stroke={color}
              strokeWidth={2}
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div
          className="sparkline__tooltip"
          style={{
            left: `${tooltip.x}%`,
            top: `${tooltip.y}px`,
          }}
        >
          <strong>{formatValue(tooltip.value)}</strong>
          {tooltip.label && <span style={{ marginLeft: 4, opacity: 0.7 }}>{tooltip.label}</span>}
        </div>
      )}

      {/* X-axis labels — only show first, middle, last */}
      {showLabels && (
        <div className="sparkline__labels">
          {data.map((d, i) => {
            const show = i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2);
            return (
              <span key={i} className="sparkline__label" style={{ opacity: show ? 1 : 0 }}>
                {show ? d.label : '·'}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
