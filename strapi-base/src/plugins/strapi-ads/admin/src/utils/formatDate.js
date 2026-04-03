/**
 * Formats a date to YYYY-MM-DD string format
 * @param {Date|string|null} date - The date to format
 * @returns {string|null} - Formatted date string or null
 */
export const formatDateToString = (date) => {
  if (!date) return null;

  // If already a string in YYYY-MM-DD format, return as is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Convert Date object to YYYY-MM-DD using local timezone
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default formatDateToString;
