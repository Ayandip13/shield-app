/**
 * Utility functions for formatting timestamps in user-friendly formats
 */

/**
 * Format timestamp into HH:mm AM/PM time string (e.g. 08:02 AM)
 */
export function formatTimeString(dateInput?: string | Date | null): string {
  if (!dateInput) return '--:--';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '--:--';

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;

  return `${hoursStr}:${minutesStr} ${ampm}`;
}

/**
 * Relative date formatter:
 * Today -> "Today, 08:02 AM"
 * Yesterday -> "Yesterday, 08:02 AM"
 * Older -> "Sep 16 · 08:02 PM"
 */
export function formatRelativeDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '--';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '--';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const timeStr = formatTimeString(d);

  if (targetDate.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const day = d.getDate();

  return `${month} ${day} · ${timeStr}`;
}
