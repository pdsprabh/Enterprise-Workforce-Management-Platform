import { useState } from 'react';
import './Attendance.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LEGEND = [
  { status: 'present',  label: 'Present',  color: '#d1fae5' },
  { status: 'absent',   label: 'Absent',   color: '#fee2e2' },
  { status: 'late',     label: 'Late',     color: '#fef3c7' },
  { status: 'half_day', label: 'Half Day', color: '#dbeafe' },
  { status: 'holiday',  label: 'Holiday',  color: '#ede9fe' },
];

/**
 * AttendanceCalendar — CSS grid calendar with color-coded attendance days.
 *
 * @param {{ date: string, status: string }[]} records - attendance records for the visible month
 * @param {number} month - 1–12
 * @param {number} year
 * @param {(month: number, year: number) => void} onMonthChange
 * @param {(record) => void} onDayClick
 */
export default function AttendanceCalendar({ records = [], month, year, onMonthChange, onDayClick }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();

  // Build a map of date string → status for O(1) lookup
  const statusMap = {};
  records.forEach((r) => { statusMap[r.date] = r.status; });

  // First day of the month (0 = Sunday, 1 = Monday, …)
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Shift so Monday = 0
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });

  function prev() {
    if (month === 1) onMonthChange(12, year - 1);
    else onMonthChange(month - 1, year);
  }

  function next() {
    if (month === 12) onMonthChange(1, year + 1);
    else onMonthChange(month + 1, year);
  }

  function handleCellClick(dateStr, status) {
    if (status === 'weekend' || status === 'future' || !status) return;
    setSelectedDate(dateStr);
    if (onDayClick) onDayClick(records.find((r) => r.date === dateStr));
  }

  // Build grid cells
  const cells = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`empty-${i}`} className="att-calendar__cell att-calendar__cell--empty" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cellDate = new Date(year, month - 1, day);
    const isFuture = cellDate > today;
    const status = isFuture ? 'future' : (statusMap[dateStr] || (cellDate.getDay() === 0 || cellDate.getDay() === 6 ? 'weekend' : undefined));
    const isSelected = selectedDate === dateStr;

    cells.push(
      <div
        key={dateStr}
        className={[
          'att-calendar__cell',
          status ? `att-calendar__cell--${status}` : '',
          isSelected ? 'att-calendar__cell--selected' : '',
        ].filter(Boolean).join(' ')}
        role={status && status !== 'weekend' && status !== 'future' ? 'button' : undefined}
        tabIndex={status && status !== 'weekend' && status !== 'future' ? 0 : undefined}
        aria-label={`${dateStr}: ${status || 'no data'}`}
        onClick={() => handleCellClick(dateStr, status)}
        onKeyDown={(e) => e.key === 'Enter' && handleCellClick(dateStr, status)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="att-calendar">
      <div className="att-calendar__nav">
        <button className="att-calendar__nav-btn" onClick={prev} aria-label="Previous month">
          ‹
        </button>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {monthName} {year}
        </span>
        <button className="att-calendar__nav-btn" onClick={next} aria-label="Next month">
          ›
        </button>
      </div>

      <div className="att-calendar__grid">
        {DAYS.map((d) => (
          <div key={d} className="att-calendar__day-header">{d}</div>
        ))}
        {cells}
      </div>

      <div className="att-calendar__legend" role="list" aria-label="Attendance status legend">
        {LEGEND.map((l) => (
          <div key={l.status} className="att-calendar__legend-item" role="listitem">
            <span className="att-calendar__legend-dot" style={{ background: l.color }} aria-hidden="true" />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
