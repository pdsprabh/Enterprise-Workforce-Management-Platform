import './Leave.css';

/**
 * LeaveBalanceCard — visual card showing used / total leave with animated progress bar.
 *
 * @param {{ type, label, total, used, color }} balance
 */
export default function LeaveBalanceCard({ balance }) {
  const { label, total, used, color } = balance;
  const remaining = total - used;
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  // Bar turns red when ≥ 80% used, yellow when ≥ 50%
  let barColor = color;
  if (pct >= 80) barColor = '#ef4444';
  else if (pct >= 50) barColor = '#f59e0b';

  return (
    <div className="leave-balance-card">
      <div className="leave-balance-card__header">
        <div className="leave-balance-card__type">
          <span
            className="leave-balance-card__dot"
            style={{ background: color }}
            aria-hidden="true"
          />
          <span className="leave-balance-card__label">{label}</span>
        </div>
        <span className="leave-balance-card__counts">
          <span className="leave-balance-card__used">{used}</span> / {total} used
        </span>
      </div>

      <div className="leave-balance-card__progress" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={total} aria-label={`${label}: ${used} of ${total} used`}>
        <div
          className="leave-balance-card__bar"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      <p className="leave-balance-card__remaining">
        <strong>{remaining}</strong> day{remaining !== 1 ? 's' : ''} remaining
      </p>
    </div>
  );
}
