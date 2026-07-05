import './Payroll.css';
import { formatCurrency } from '../../utils/formatters';

/**
 * SalaryBreakdown — CSS horizontal stacked bar showing salary components.
 *
 * @param {{ label: string, amount: number, color: string }[]} components
 * @param {number} gross - total gross salary for percentage calculation
 */
export default function SalaryBreakdown({ components = [], gross }) {
  const total = gross || components.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="salary-breakdown">
      {/* Stacked bar */}
      <div className="salary-breakdown__bar" role="img" aria-label="Salary component breakdown">
        {components.map((comp) => {
          const pct = total > 0 ? (comp.amount / total) * 100 : 0;
          return (
            <div
              key={comp.label}
              className="salary-breakdown__segment"
              style={{ width: `${pct}%`, background: comp.color }}
              title={`${comp.label}: ${formatCurrency(comp.amount)}`}
            />
          );
        })}
      </div>

      {/* Legend rows */}
      <div className="salary-breakdown__legend">
        {components.map((comp) => {
          const pct = total > 0 ? ((comp.amount / total) * 100).toFixed(1) : 0;
          return (
            <div key={comp.label} className="salary-breakdown__row">
              <div className="salary-breakdown__row-left">
                <span className="salary-breakdown__dot" style={{ background: comp.color }} aria-hidden="true" />
                <span className="salary-breakdown__comp-name">{comp.label}</span>
              </div>
              <div className="salary-breakdown__row-right">
                <span className="salary-breakdown__pct">{pct}%</span>
                <span className="salary-breakdown__amount">{formatCurrency(comp.amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
