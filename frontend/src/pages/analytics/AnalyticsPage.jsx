import { useState } from 'react';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';
import DonutChart from '../../components/ui/DonutChart';
import StarRating from '../../components/ui/StarRating';
import { mockAnalyticsData, mockDepartmentDistribution } from '../../utils/mockData';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const [year, setYear] = useState(2026);
  const data = mockAnalyticsData;

  // Payroll trend — multi-series bar chart
  const payrollBars = data.payrollTrend.map((p) => ({
    label: p.month,
    values: [
      { key: 'gross', value: p.gross, color: '#4F46E5' },
      { key: 'net',   value: p.net,   color: '#10B981' },
    ],
  }));

  return (
    <div className="analytics-page">
      <div className="analytics-page__header">
        <h1 className="analytics-page__title">Analytics Dashboard</h1>
        <div className="analytics-year-nav">
          <button onClick={() => setYear((y) => y - 1)} aria-label="Previous year">◀</button>
          <span>{year}</span>
          <button onClick={() => setYear((y) => y + 1)} aria-label="Next year">▶</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="analytics-kpi-row">
        <div className="analytics-kpi-card">
          <p className="analytics-kpi-card__label">Total Employees</p>
          <p className="analytics-kpi-card__value">156</p>
          <p className="analytics-kpi-card__sub">as of {year}</p>
        </div>
        <div className="analytics-kpi-card">
          <p className="analytics-kpi-card__label">Avg Tenure</p>
          <p className="analytics-kpi-card__value">2.4 yrs</p>
          <p className="analytics-kpi-card__sub">across all departments</p>
        </div>
        <div className="analytics-kpi-card">
          <p className="analytics-kpi-card__label">Attrition Rate</p>
          <p className="analytics-kpi-card__value">8.2%</p>
          <p className="analytics-kpi-card__sub">annual average</p>
        </div>
        <div className="analytics-kpi-card">
          <p className="analytics-kpi-card__label">Avg Performance</p>
          <p className="analytics-kpi-card__value">4.1 / 5</p>
          <p className="analytics-kpi-card__sub">last review cycle</p>
        </div>
      </div>

      {/* Headcount trend */}
      <div className="analytics-chart-card">
        <h3 className="analytics-chart-card__title">Headcount Trend — {year}</h3>
        <LineChart
          data={data.headcountTrend.map((d) => ({ label: d.month, value: d.count }))}
          color="#4F46E5"
          height={200}
          unit=" emp"
        />
      </div>

      {/* Department + Leave stats */}
      <div className="analytics-two-col">
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Department Distribution</h3>
          <DonutChart
            segments={mockDepartmentDistribution.map((d) => ({
              label: d.department.split(' ')[0],
              value: d.count,
              color: d.color,
            }))}
            size={140}
            innerLabel="156"
          />
        </div>
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Leave Stats Breakdown</h3>
          <DonutChart
            segments={data.leaveStats.map((s) => ({
              label: s.type,
              value: s.days,
              color: s.color,
            }))}
            size={140}
            innerLabel={`${data.leaveStats.reduce((a, s) => a + s.days, 0)} days`}
          />
        </div>
      </div>

      {/* Payroll trend */}
      <div className="analytics-chart-card">
        <h3 className="analytics-chart-card__title">Payroll Trend (6 months)</h3>
        <BarChart
          data={payrollBars}
          height={200}
          formatValue={(v) => `₹${(v / 100000).toFixed(1)}L`}
        />
        <div className="analytics-bar-legend">
          <div className="analytics-bar-legend__item">
            <span className="analytics-bar-legend__dot" style={{ background: '#4F46E5' }} />
            Gross
          </div>
          <div className="analytics-bar-legend__item">
            <span className="analytics-bar-legend__dot" style={{ background: '#10B981' }} />
            Net
          </div>
        </div>
      </div>

      {/* Top Performers + Gender Split */}
      <div className="analytics-two-col">
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Top Performers</h3>
          <div className="analytics-performers-list">
            {data.topPerformers.map((p, i) => (
              <div key={p.name} className="analytics-performer-item">
                <div className="analytics-performer-item__rank">{i + 1}</div>
                <div className="analytics-performer-item__info">
                  <p className="analytics-performer-item__name">{p.name}</p>
                  <p className="analytics-performer-item__dept">{p.department}</p>
                </div>
                <StarRating rating={p.rating} />
              </div>
            ))}
          </div>
        </div>
        <div className="analytics-chart-card">
          <h3 className="analytics-chart-card__title">Gender Split</h3>
          <DonutChart
            segments={data.genderSplit}
            size={140}
            innerLabel="156"
          />
        </div>
      </div>
    </div>
  );
}
