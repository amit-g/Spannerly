export interface TextService {
  convertCase(text: string, caseType: CaseType): string;
  encodeBase64(text: string): string;
  decodeBase64(encodedText: string): string;
}

export interface MeasurementService {
  milesToKm(miles: number): number;
  kmToMiles(km: number): number;
}

export interface DateTimeService {
  getTimeInJapan(): string;
  convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date;
}

export interface ImageService {
  base64ToImage(base64String: string): string;
  imageToBase64(imageFile: File): Promise<string>;
}

export enum CaseType {
  UPPER = 'upper',
  LOWER = 'lower',
  TITLE = 'title',
  CAMEL = 'camel',
  PASCAL = 'pascal',
  SNAKE = 'snake',
  KEBAB = 'kebab',
}
