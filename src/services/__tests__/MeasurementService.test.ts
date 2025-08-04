import { BrowserMeasurementService } from '@/services/MeasurementService';

describe('BrowserMeasurementService', () => {
  let service: BrowserMeasurementService;

  beforeEach(() => {
    service = new BrowserMeasurementService();
  });

  describe('milesToKm', () => {
    it('should convert miles to kilometers correctly', () => {
      expect(service.milesToKm(1)).toBe(1.6093);
      expect(service.milesToKm(10)).toBe(16.0934);
      expect(service.milesToKm(0)).toBe(0);
    });

    it('should throw error for negative miles', () => {
      expect(() => service.milesToKm(-1)).toThrow('Miles cannot be negative');
    });
  });

  describe('kmToMiles', () => {
    it('should convert kilometers to miles correctly', () => {
      expect(service.kmToMiles(1.6093)).toBeCloseTo(1, 4);
      expect(service.kmToMiles(16.0934)).toBeCloseTo(10, 4);
      expect(service.kmToMiles(0)).toBe(0);
    });

    it('should throw error for negative kilometers', () => {
      expect(() => service.kmToMiles(-1)).toThrow('Kilometers cannot be negative');
    });
  });
});
