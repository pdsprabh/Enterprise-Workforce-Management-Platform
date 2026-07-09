import Card, { CardBody } from '../ui/Card';
import Counter from '../ui/Counter';
import './Dashboard.css';

const ICONS = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'check-circle': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
};

export default function StatCard({ label, value, change, icon, color }) {
  const isPositive = change >= 0;
  const changeClass = isPositive ? 'text-success' : 'text-danger';
  const changeIcon = isPositive ? '▲' : '▼';

  return (
    <Card className="stat-card">
      <CardBody className="stat-card__body">
        <div className="stat-card__content">
          <p className="stat-card__label">{label}</p>

          {/* Animated rolling counter */}
          <div className="stat-card__value">
            <Counter
              value={value}
              fontSize={32}
              gap={2}
              horizontalPadding={0}
              borderRadius={0}
              textColor="var(--color-text-primary)"
              fontWeight={700}
            />
          </div>

          <p className={`stat-card__change ${changeClass}`}>
            {changeIcon} {Math.abs(change)}% <span>vs last month</span>
          </p>
        </div>
        <div className={`stat-card__icon bg-${color}-light text-${color}`}>
          {ICONS[icon]}
        </div>
      </CardBody>
    </Card>
  );
}
