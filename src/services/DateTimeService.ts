import { DateTimeService } from '@/types/services';

export class BrowserDateTimeService implements DateTimeService {
  getTimeInJapan(): string {
    const now = new Date();
    const japanTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    
    return japanTime;
  }

  convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
    // Create a date string in the source timezone
    const sourceTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    // Parse the source time and convert to target timezone
    const sourceDate = new Date(sourceTime);
    
    // Get the time in the target timezone
    const targetTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: toTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(sourceDate);

    return new Date(targetTime);
  }
}
