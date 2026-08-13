/**
 * Gets the UTC start and end bounds of a day in the Asia/Kolkata timezone.
 * 
 * @param {Date|string} [dateStringOrObject] 
 * @returns {{ start: Date, end: Date }}
 */
export function getKolkataDayBounds(dateStringOrObject) {
  // If it's a string in the format YYYY-MM-DD, parse it safely as local date components to avoid UTC offset jumps
  let date;
  if (typeof dateStringOrObject === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStringOrObject.trim())) {
    const [year, month, day] = dateStringOrObject.trim().split('-').map(Number);
    // Create date representation in Kolkata time (we can construct UTC first, then adjust)
    date = new Date(Date.UTC(year, month - 1, day));
  } else {
    date = dateStringOrObject ? new Date(dateStringOrObject) : new Date();
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const parts = formatter.formatToParts(date);
  const month = parseInt(parts.find(p => p.type === 'month').value, 10);
  const day = parseInt(parts.find(p => p.type === 'day').value, 10);
  const year = parseInt(parts.find(p => p.type === 'year').value, 10);

  // Kolkata is UTC + 5:30 (330 minutes)
  const startOfKolkataDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - 330 * 60 * 1000);
  const endOfKolkataDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999) - 330 * 60 * 1000);

  return {
    start: startOfKolkataDay,
    end: endOfKolkataDay
  };
}

/**
 * Gets the start and end dates for predefined and custom ranges in Asia/Kolkata.
 * 
 * @param {string} period - 'week', 'month', 'year', 'custom'
 * @param {string|Date} [customFrom] 
 * @param {string|Date} [customTo] 
 * @returns {{ start: Date, end: Date }}
 */
export function getKolkataPeriodBounds(period, customFrom, customTo) {
  const todayBounds = getKolkataDayBounds(new Date());
  let start;
  let end = todayBounds.end;

  if (period === 'week') {
    // 7 days ending today
    start = new Date(todayBounds.start.getTime() - 6 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    // 30 days ending today
    start = new Date(todayBounds.start.getTime() - 29 * 24 * 60 * 60 * 1000);
  } else if (period === 'year') {
    // 365 days ending today
    start = new Date(todayBounds.start.getTime() - 364 * 24 * 60 * 60 * 1000);
  } else if (period === 'custom') {
    const fromBounds = getKolkataDayBounds(customFrom);
    const toBounds = getKolkataDayBounds(customTo);
    start = fromBounds.start;
    end = toBounds.end;
  } else {
    // Fallback to week
    start = new Date(todayBounds.start.getTime() - 6 * 24 * 60 * 60 * 1000);
  }

  return { start, end };
}

/**
 * Formats a Date object into a local string in Asia/Kolkata timezone.
 * 
 * @param {Date|string} date 
 * @param {string} [formatType] - 'YYYY-MM-DD', 'MMM DD', 'MMM YYYY'
 * @returns {string}
 */
export function formatKolkataDate(date, formatType = 'YYYY-MM-DD') {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  const parts = formatter.formatToParts(d);
  const month = parts.find(p => p.type === 'month').value.padStart(2, '0');
  const day = parts.find(p => p.type === 'day').value.padStart(2, '0');
  const year = parts.find(p => p.type === 'year').value;

  if (formatType === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  if (formatType === 'MMM DD') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month, 10) - 1]} ${day}`;
  }
  if (formatType === 'MMM YYYY') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  }
  return `${year}-${month}-${day}`;
}
