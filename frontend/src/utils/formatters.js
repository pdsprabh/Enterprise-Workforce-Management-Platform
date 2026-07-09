/**
 * Format a date string to a human-readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format a date to relative time (e.g., "2 hours ago").
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '—';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get initials from a full name (e.g., "Ayush Singh" → "AS").
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a phone number for display.
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '—';
  // Simple formatting: +91-XXXXX-XXXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
}

/**
 * Truncate a string to a max length and append ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 50) {
  if (!str || str.length <= maxLen) return str || '';
  return str.slice(0, maxLen) + '…';
}

/**
 * Format a datetime string to time only (e.g., "09:12 AM").
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format minutes into hours and minutes string (e.g., 495 → "8h 15m").
 * @param {number} totalMinutes
 * @returns {string}
 */
export function formatDuration(totalMinutes) {
  if (totalMinutes == null || isNaN(totalMinutes)) return '—';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Calculate working (business) days between two dates, excluding weekends.
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {number}
 */
export function getBusinessDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++; // exclude Sunday (0) and Saturday (6)
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

/**
 * Format a number as a salary string (e.g., 120000 → "₹1,20,000").
 * @param {number} amount
 * @returns {string}
 */
export function formatSalary(amount) {
  return formatCurrency(amount, 'INR');
}

/**
 * Format a decimal as a percentage string (e.g., 0.75 → "75%", 75 → "75%").
 * @param {number} value — either 0–1 or 0–100
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercentage(value, decimals = 0) {
  if (value == null) return '—';
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Format a notification timestamp to a human-readable relative string.
 * @param {string|Date} date
 * @returns {string} — "Just now" / "5m ago" / "2h ago" / "Yesterday" / date string
 */
export function formatNotificationTime(date) {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  return formatDate(date);
}
