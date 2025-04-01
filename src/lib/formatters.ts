/**
 * Format a currency to a readable format
 * @param amount Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format a time string to a readable format
 * @param time Time string in HH:MM:SS format or Date object
 * @param isoFormat Whether to return in ISO format (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(time: string | Date, isoFormat = false): string {
  if (!time) return '';
  
  let timeObj: Date;
  
  if (typeof time === 'string') {
    // Handle SQL time format (HH:MM:SS)
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      timeObj = new Date();
      timeObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    } else {
      timeObj = new Date(time);
    }
  } else {
    timeObj = time;
  }
  
  if (isoFormat) {
    return timeObj.toTimeString().substring(0, 5); // HH:MM format
  }
  
  return timeObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/**
 * Format a date to a readable format
 * @param date Date string or Date object
 * @returns Formatted date string (YYYY-MM-DD if isoFormat is true)
 */
export function formatDate(date: string | Date, isoFormat = false): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isoFormat) {
    return dateObj.toISOString().split('T')[0];
  }
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
