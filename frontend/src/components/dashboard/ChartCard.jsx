import Card, { CardHeader, CardBody } from '../ui/Card';
import AnimatedSparkline from '../ui/AnimatedSparkline';
import { mockAttendanceTrend, mockDepartmentDistribution } from '../../utils/mockData';
import './Dashboard.css';

/* ── Attendance Trend Chart ─────────────────────────────────── */
function AttendanceTrendChart() {
  const data = mockAttendanceTrend.map(d => ({
    label: d.day,
    value: d.present,
  }));

  return (
    <div className="chart-card__section">
      <div className="chart-card__legend">
        <span className="chart-card__legend-dot" style={{ background: '#6366f1' }} />
        <span>Present</span>
        <span className="chart-card__legend-dot" style={{ background: '#ef4444', marginLeft: 16 }} />
        <span>Absent</span>
      </div>

      <AnimatedSparkline
        data={data}
        height={160}
        color="#6366f1"
        showArea
        showDot
        showLabels
        showTooltip
        smooth
        formatValue={v => `${v} employees`}
      />

      {/* Absent overlay sparkline (lighter, dashed style via second instance) */}
      <div style={{ marginTop: 8 }}>
        <AnimatedSparkline
          data={mockAttendanceTrend.map(d => ({ label: d.day, value: d.absent }))}
          height={80}
          color="#ef4444"
          showArea={false}
          showDot={false}
          showLabels={false}
          showTooltip
          smooth
          strokeWidth={1.8}
          formatValue={v => `${v} absent`}
        />
      </div>
    </div>
  );
}

/* ── Department Distribution Chart ─────────────────────────── */
function DepartmentChart() {
  // Sort by count descending, take top 6
  const sorted = [...mockDepartmentDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const data = sorted.map(d => ({
    label: d.department.split(' ')[0], // first word only
    value: d.count,
  }));

  return (
    <div className="chart-card__section">
      <AnimatedSparkline
        data={data}
        height={140}
        color="#10b981"
        showArea
        showDot
        showLabels
        showTooltip
        smooth={false}   /* bar-chart feel with straight segments */
        strokeWidth={2}
        formatValue={v => `${v} employees`}
      />

      {/* Compact legend */}
      <div className="chart-card__dept-legend">
        {sorted.slice(0, 4).map(d => (
          <div key={d.department} className="chart-card__dept-item">
            <span className="chart-card__legend-dot" style={{ background: d.color }} />
            <span className="chart-card__dept-name">{d.department.split(' ')[0]}</span>
            <span className="chart-card__dept-count">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ChartCard wrapper ──────────────────────────────────────── */
export default function ChartCard({ title, type }) {
  const isAttendance = type === 'Bar Chart';

  return (
    <Card className="h-full">
      <CardHeader>{title}</CardHeader>
      <CardBody>
        {isAttendance ? <AttendanceTrendChart /> : <DepartmentChart />}
      </CardBody>
    </Card>
  );
}
