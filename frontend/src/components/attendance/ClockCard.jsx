import { useState, useEffect, useRef } from 'react';
import './Attendance.css';

/**
 * ClockCard — Live clock with clock-in / clock-out toggle.
 *
 * @param {boolean} isClockedIn
 * @param {Date|null} clockInTime
 * @param {(notes: string) => void} onClockIn
 * @param {(notes: string) => void} onClockOut
 * @param {boolean} loading
 */
export default function ClockCard({ isClockedIn, isClockedOutToday, clockInTime, onClockIn, onClockOut, loading }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsed, setElapsed] = useState(0); // seconds since clock-in
  const [notes, setNotes] = useState('');
  const intervalRef = useRef(null);

  // Tick the clock every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn && clockInTime) {
        setElapsed(Math.floor((Date.now() - new Date(clockInTime).getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isClockedIn, clockInTime]);

  // Reset elapsed when clocked in
  useEffect(() => {
    if (isClockedIn && clockInTime) {
      setElapsed(Math.floor((Date.now() - new Date(clockInTime).getTime()) / 1000));
    } else {
      setElapsed(0);
    }
  }, [isClockedIn, clockInTime]);

  function formatElapsed(secs) {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function handleAction() {
    if (isClockedIn) {
      onClockOut(notes);
    } else {
      onClockIn(notes);
    }
    setNotes('');
  }

  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  let statusText = isClockedIn ? 'Working' : 'Not Started';
  if (isClockedOutToday) statusText = 'Clocked Out';

  return (
    <div className="clock-card">
      <div className="clock-card__bg-circle" aria-hidden="true" />

      <div className="clock-card__time">{timeStr}</div>

      <div className="clock-card__status-row">
        <span className={`clock-card__dot ${isClockedIn ? 'clock-card__dot--pulse' : 'clock-card__dot--idle'}`} aria-hidden="true" />
        <span>{statusText}</span>
      </div>

      {isClockedIn && (
        <div className="clock-card__timer" aria-label="Time elapsed since clock-in">
          {formatElapsed(elapsed)}
        </div>
      )}

      <textarea
        className="clock-card__notes"
        rows={2}
        placeholder={isClockedIn ? 'Notes before clocking out (optional)…' : 'Notes (optional)…'}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isClockedOutToday}
      />

      <button
        className={`clock-card__btn ${isClockedIn ? 'clock-card__btn--out' : 'clock-card__btn--in'}`}
        onClick={handleAction}
        disabled={loading || isClockedOutToday}
        aria-label={isClockedOutToday ? 'Clocked Out Today' : (isClockedIn ? 'Clock Out' : 'Clock In')}
      >
        {isClockedOutToday ? 'Clocked Out Today' : (loading ? 'Please wait…' : isClockedIn ? 'Clock Out' : 'Clock In')}
      </button>
    </div>
  );
}
