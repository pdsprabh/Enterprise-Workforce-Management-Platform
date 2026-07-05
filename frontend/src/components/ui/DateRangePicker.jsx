import { useEffect } from 'react';
import { getBusinessDays } from '../../utils/formatters';
import './DateRangePicker.css';

/**
 * DateRangePicker — start/end date selector with automatic business-day calculation.
 *
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {string} endDate   - ISO date string (YYYY-MM-DD)
 * @param {(range: { startDate: string, endDate: string, businessDays: number }) => void} onChange
 * @param {string} minDate   - ISO date string; defaults to today
 */
export default function DateRangePicker({ startDate, endDate, onChange, minDate }) {
  const today = new Date().toISOString().split('T')[0];
  const min = minDate || today;

  // Recalculate business days whenever dates change
  useEffect(() => {
    if (startDate && endDate && endDate >= startDate) {
      const businessDays = getBusinessDays(startDate, endDate);
      onChange({ startDate, endDate, businessDays });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  function handleStartChange(e) {
    const newStart = e.target.value;
    const resolvedEnd = endDate && endDate >= newStart ? endDate : newStart;
    const businessDays = getBusinessDays(newStart, resolvedEnd);
    onChange({ startDate: newStart, endDate: resolvedEnd, businessDays });
  }

  function handleEndChange(e) {
    const newEnd = e.target.value;
    const businessDays = startDate && newEnd >= startDate ? getBusinessDays(startDate, newEnd) : 0;
    onChange({ startDate: startDate || '', endDate: newEnd, businessDays });
  }

  const businessDays = startDate && endDate && endDate >= startDate
    ? getBusinessDays(startDate, endDate)
    : 0;

  return (
    <div className="drp">
      <div className="drp__fields">
        <div className="drp__field">
          <label className="drp__label">Start Date</label>
          <input
            type="date"
            className="drp__input"
            value={startDate || ''}
            min={min}
            onChange={handleStartChange}
          />
        </div>
        <span className="drp__arrow" aria-hidden="true">→</span>
        <div className="drp__field">
          <label className="drp__label">End Date</label>
          <input
            type="date"
            className="drp__input"
            value={endDate || ''}
            min={startDate || min}
            onChange={handleEndChange}
          />
        </div>
      </div>
      {startDate && endDate && endDate >= startDate && (
        <p className="drp__summary">
          <span className="drp__days">{businessDays}</span> working day{businessDays !== 1 ? 's' : ''}
        </p>
      )}
      {endDate && startDate && endDate < startDate && (
        <p className="drp__error">End date must be on or after start date.</p>
      )}
    </div>
  );
}
