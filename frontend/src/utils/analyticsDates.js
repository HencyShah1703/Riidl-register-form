/**
 * Formats a Date object as YYYY-MM-DD in the Asia/Kolkata timezone.
 * 
 * @param {Date} [date] 
 * @returns {string}
 */
export function getKolkataDateString(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  
  const parts = formatter.formatToParts(date);
  const month = parts.find(p => p.type === 'month').value.padStart(2, '0');
  const day = parts.find(p => p.type === 'day').value.padStart(2, '0');
  const year = parts.find(p => p.type === 'year').value;
  
  return `${year}-${month}-${day}`;
}

/**
 * Gets the from and to date strings (in Asia/Kolkata YYYY-MM-DD format) for a given predefined period.
 * 
 * @param {string} period - 'week', 'month', 'year'
 * @returns {{ from: string, to: string }}
 */
export function getPeriodDateRange(period) {
  const today = new Date();
  
  if (period === 'week') {
    const start = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    return {
      from: getKolkataDateString(start),
      to: getKolkataDateString(today)
    };
  }
  
  if (period === 'month') {
    const start = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
    return {
      from: getKolkataDateString(start),
      to: getKolkataDateString(today)
    };
  }
  
  if (period === 'year') {
    const start = new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000);
    return {
      from: getKolkataDateString(start),
      to: getKolkataDateString(today)
    };
  }
  
  // Default to today
  return {
    from: getKolkataDateString(today),
    to: getKolkataDateString(today)
  };
}
