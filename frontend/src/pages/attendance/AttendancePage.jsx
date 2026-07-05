import { useState, useMemo } from 'react';
import ClockCard from '../../components/attendance/ClockCard';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import Badge from '../../components/ui/Badge';
import { mockAttendanceLog } from '../../utils/mockData';
import { formatDate, formatTime, formatDuration } from '../../utils/formatters';
import { ATTENDANCE_STATUS_LABELS } from '../../utils/constants';
import './AttendancePage.css';

function statusBadgeColor(status) {
  switch (status) {
    case 'present':  return 'success';
    case 'absent':   return 'danger';
    case 'late':     return 'warning';
    case 'half_day': return 'info';
    case 'holiday':  return 'primary';
    default:         return 'secondary';
  }
}

export default function AttendancePage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  // Mock clock-in state
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockLoading, setClockLoading] = useState(false);

  function handleMonthChange(m, y) {
    setMonth(m);
    setYear(y);
  }

  function handleClockIn(_notes) {
    setClockLoading(true);
    setTimeout(() => {
      setIsClockedIn(true);
      setClockInTime(new Date());
      setClockLoading(false);
    }, 600);
  }

  function handleClockOut(_notes) {
    setClockLoading(true);
    setTimeout(() => {
      setIsClockedIn(false);
      setClockInTime(null);
      setClockLoading(false);
    }, 600);
  }

  // Filter records to the selected month/year
  const monthRecords = useMemo(() =>
    mockAttendanceLog.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }),
  [month, year]);

  // Summary counts
  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, half_day: 0 };
    monthRecords.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status]++;
    });
    return counts;
  }, [monthRecords]);

  const monthLabel = new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Log table columns
  const logColumns = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'clockIn', label: 'Clock In', render: (r) => formatTime(r.clockIn) },
    { key: 'clockOut', label: 'Clock Out', render: (r) => formatTime(r.clockOut) },
    { key: 'totalMinutes', label: 'Hours', render: (r) => formatDuration(r.totalMinutes) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge color={statusBadgeColor(r.status)}>
          {ATTENDANCE_STATUS_LABELS[r.status] || r.status}
        </Badge>
      ),
    },
    { key: 'notes', label: 'Notes', render: (r) => r.notes || '—' },
  ];

  // Show only non-weekend records in the log
  const logRecords = [...monthRecords]
    .filter((r) => r.status !== 'weekend')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="attendance-page">
      {/* Header */}
      <div className="attendance-page__header">
        <h1 className="attendance-page__title">Attendance Overview</h1>
        <div className="attendance-page__month-nav">
          <button
            onClick={() => handleMonthChange(month === 1 ? 12 : month - 1, month === 1 ? year - 1 : year)}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="attendance-page__month-label">{monthLabel}</span>
          <button
            onClick={() => handleMonthChange(month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year)}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="attendance-page__summary">
        <div className="att-stat att-stat--present">
          <span className="att-stat__label">Present</span>
          <span className="att-stat__value">{summary.present}</span>
        </div>
        <div className="att-stat att-stat--absent">
          <span className="att-stat__label">Absent</span>
          <span className="att-stat__value">{summary.absent}</span>
        </div>
        <div className="att-stat att-stat--late">
          <span className="att-stat__label">Late</span>
          <span className="att-stat__value">{summary.late}</span>
        </div>
        <div className="att-stat att-stat--halfday">
          <span className="att-stat__label">Half Day</span>
          <span className="att-stat__value">{summary.half_day}</span>
        </div>
      </div>

      {/* Clock card + Calendar */}
      <div className="attendance-page__top">
        <ClockCard
          isClockedIn={isClockedIn}
          clockInTime={clockInTime}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          loading={clockLoading}
        />
        <div className="attendance-page__card">
          <AttendanceCalendar
            records={monthRecords}
            month={month}
            year={year}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Attendance log */}
      <div className="attendance-page__log-section">
        <h2>Attendance Log</h2>
        <div className="attendance-page__card">
          {logRecords.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
              No attendance records for this month.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    {logColumns.map((col) => (
                      <th
                        key={col.key}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          borderBottom: '2px solid var(--color-border, #e5e7eb)',
                          color: 'var(--color-text-secondary)',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logRecords.map((r) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}
                    >
                      {logColumns.map((col) => (
                        <td key={col.key} style={{ padding: '10px 12px', color: 'var(--color-text-primary)' }}>
                          {col.render ? col.render(r) : r[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
