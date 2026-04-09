/**
 * Calendar utility functions for date operations and formatting
 */

export const HOLIDAYS: Record<string, string> = {
  '01-01': 'New Year',
  '02-14': "Valentine's Day",
  '03-17': "St. Patrick's Day",
  '07-04': 'Independence Day',
  '10-31': 'Halloween',
  '12-25': 'Christmas',
  '12-31': "New Year's Eve",
};

export const HERO_IMAGES = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663404158534/eeU6Ai8D5ruqxfAcvdKcEU/calendar-hero-1-fPrzBPppAtScpyvnsCTB2j.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663404158534/eeU6Ai8D5ruqxfAcvdKcEU/calendar-hero-2-ZzG4jkVs9HRQbW5wVvZY8J.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663404158534/eeU6Ai8D5ruqxfAcvdKcEU/calendar-hero-3-8CWTu9dTtFPrz8tmhQH5Gx.webp',
];

export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;

  const [rangeStart, rangeEnd] = start <= end ? [start, end] : [end, start];
  const dateTime = date.getTime();
  const startTime = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime();
  const endTime = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime();

  return dateTime >= startTime && dateTime <= endTime;
}

export function isRangeStart(date: Date, start: Date | null): boolean {
  if (!start) return false;
  return isSameDay(date, start);
}

export function isRangeEnd(date: Date, end: Date | null): boolean {
  if (!end) return false;
  return isSameDay(date, end);
}

export function getHolidayName(date: Date): string | null {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return HOLIDAYS[key] || null;
}

export function getMonthDays(date: Date): (number | null)[] {
  const daysInMonth = getDaysInMonth(date);
  const firstDay = getFirstDayOfMonth(date);
  const days: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate > today;
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

export function createDateFromDay(baseDate: Date, day: number): Date {
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
}
