import { Notification } from 'core/modules/notifications/models';

export function isDateBeforeToday(date: Date): boolean {
  return date ? new Date(date) <= new Date() : false;
}

export function sortByDate<T>(items: T[], dateProperty: string): T[] {
  return items.sort((a, b) => new Date(b[dateProperty]).getTime() - new Date(a[dateProperty]).getTime());
}

export function convertToUTCTimestamp(date: string | Date): number {
    const currDate = typeof(date) === 'string' ? new Date(date) : date;
    return Math.floor((currDate.getTime() - currDate.getTimezoneOffset() * 6000) / 1000);
}
