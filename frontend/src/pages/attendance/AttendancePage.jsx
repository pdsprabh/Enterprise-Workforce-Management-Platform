import { useState, useEffect, useMemo } from 'react';
import ClockCard from '../../components/attendance/ClockCard';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import Badge from '../../components/ui/Badge';
import { formatDate, formatTime, formatDuration } from '../../utils/formatters';
import { ATTENDANCE_STATUS_LABELS } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
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

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Clock-in state
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockLoading, setClockLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      const res = await api.get('/attendance/me');
      const data = res.data.data || [];
      setRecords(data);

      // Check if there's a record for today with a clockIn but no clockOut
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      const todayRecord = data.find(r => new Date(r.date).getTime() === t.getTime());
      
      if (todayRecord && todayRecord.clockIn && !todayRecord.clockOut) {
        setIsClockedIn(true);
        setClockInTime(new Date(todayRecord.clockIn));
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
      }
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: 'Failed to fetch attendance records' });
    } finally {
      setLoading(false);
    }
  }

  function handleMonthChange(m, y) {
    setMonth(m);
    setYear(y);
  }

  async function handleClockIn(_notes) {
    setClockLoading(true);
    try {
      await api.post('/attendance/clock-in');
      await fetchAttendance();
      addToast({ type: 'success', message: 'Clocked in successfully!' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to clock in' });
    } finally {
      setClockLoading(false);
    }
  }

  async function handleClockOut(_notes) {
    setClockLoading(true);
    try {
      await api.post('/attendance/clock-out');
      await fetchAttendance();
      addToast({ type: 'success', message: 'Clocked out successfully!' });
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to clock out' });
    } finally {
      setClockLoading(false);
    }
  }

  // Filter records to the selected month/year
  const monthRecords = useMemo(() =>
    records.filter((r) => {
      const d = new Date(r.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    }),
  [month, year, records]);

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
    { key: 'clockIn', label: 'Clock In', render: (r) => r.clockIn ? formatTime(r.clockIn) : '—' },
    { key: 'clockOut', label: 'Clock Out', render: (r) => r.clockOut ? formatTime(r.clockOut) : '—' },
    { key: 'workHours', label: 'Hours', render: (r) => r.workHours ? formatDuration(r.workHours * 60) : '—' },
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
                      key={r._id || r.id}
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
