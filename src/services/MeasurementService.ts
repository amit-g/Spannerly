import { MeasurementService } from '@/types/services';

export class BrowserMeasurementService implements MeasurementService {
  milesToKm(miles: number): number {
    if (miles < 0) {
      throw new Error('Miles cannot be negative');
    }
    return Number((miles * 1.60934).toFixed(4));
  }

  kmToMiles(km: number): number {
    if (km < 0) {
      throw new Error('Kilometers cannot be negative');
    }
    return Number((km / 1.60934).toFixed(4));
  }
}
