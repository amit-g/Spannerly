// Calculator Services
export interface CalculatorService {
  basicMath: BasicMathService;
  financial: FinancialService;
  scientific: ScientificService;
}

export interface BasicMathService {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
  percentage(value: number, percent: number): number;
  sqrt(value: number): number;
  power(base: number, exponent: number): number;
}

export interface FinancialService {
  calculateLoan(principal: number, rate: number, months: number): number;
  calculateInterest(principal: number, rate: number, time: number): number;
  calculateCompoundInterest(principal: number, rate: number, compounds: number, time: number): number;
}

export interface ScientificService {
  sin(value: number): number;
  cos(value: number): number;
  tan(value: number): number;
  log(value: number): number;
  ln(value: number): number;
  factorial(n: number): number;
}

// Unit Converter Services
export interface UnitConverterService {
  length: LengthService;
  temperature: TemperatureService;
  area: AreaService;
  volume: VolumeService;
  weight: WeightService;
  time: TimeService;
  currency: CurrencyService;
}

export interface LengthService {
  convert(value: number, from: LengthUnit, to: LengthUnit): number;
}

export interface TemperatureService {
  convert(value: number, from: TemperatureUnit, to: TemperatureUnit): number;
}

export interface AreaService {
  convert(value: number, from: AreaUnit, to: AreaUnit): number;
}

export interface VolumeService {
  convert(value: number, from: VolumeUnit, to: VolumeUnit): number;
}

export interface WeightService {
  convert(value: number, from: WeightUnit, to: WeightUnit): number;
}

export interface TimeService {
  convert(value: number, from: TimeUnit, to: TimeUnit): number;
}

export interface CurrencyService {
  convert(value: number, from: string, to: string): Promise<number>;
}

// Converter Services
export interface ConverterService {
  base64: Base64Service;
  html: HtmlService;
  url: UrlService;
  json: JsonService;
  number: NumberService;
  markdown: MarkdownService;
  stringCase: StringCaseService;
  image: ImageService;
}

export interface Base64Service {
  encode(text: string): string;
  decode(encoded: string): string;
}

export interface HtmlService {
  encode(text: string): string;
  decode(encoded: string): string;
}

export interface UrlService {
  encode(text: string): string;
  decode(encoded: string): string;
}

export interface JsonService {
  toXml(json: string): string;
  fromXml(xml: string): string;
  toCsv(json: string): string;
  fromCsv(csv: string): string;
  validate(json: string): boolean;
  beautify(json: string): string;
  minify(json: string): string;
}

export interface NumberService {
  decimalToBinary(decimal: number): string;
  binaryToDecimal(binary: string): number;
  decimalToHex(decimal: number): string;
  hexToDecimal(hex: string): number;
  decimalToOctal(decimal: number): string;
  octalToDecimal(octal: string): number;
}

export interface MarkdownService {
  toHtml(markdown: string): string;
  fromHtml(html: string): string;
}

export interface StringCaseService {
  convertCase(text: string, caseType: CaseType): string;
}

export interface ImageService {
  base64ToImage(base64: string): string;
  imageToBase64(file: File): Promise<string>;
}

// Validator Services
export interface ValidatorService {
  json: JsonValidatorService;
  javascript: JavascriptValidatorService;
  css: CssValidatorService;
}

export interface JsonValidatorService {
  validate(json: string): ValidationResult;
}

export interface JavascriptValidatorService {
  validate(code: string): ValidationResult;
}

export interface CssValidatorService {
  validate(css: string): ValidationResult;
}

// Beautifier Services
export interface BeautifierService {
  json: JsonBeautifierService;
  csharp: CsharpBeautifierService;
  sql: SqlBeautifierService;
  css: CssBeautifierService;
  javascript: JavascriptBeautifierService;
  typescript: TypescriptBeautifierService;
}

export interface JsonBeautifierService {
  beautify(json: string): string;
}

export interface CsharpBeautifierService {
  beautify(code: string): string;
}

export interface SqlBeautifierService {
  beautify(sql: string): string;
}

export interface CssBeautifierService {
  beautify(css: string): string;
}

export interface JavascriptBeautifierService {
  beautify(code: string): string;
}

export interface TypescriptBeautifierService {
  beautify(code: string): string;
}

// Minifier Services
export interface MinifierService {
  json: JsonMinifierService;
  javascript: JavascriptMinifierService;
  css: CssMinifierService;
}

export interface JsonMinifierService {
  minify(json: string): string;
}

export interface JavascriptMinifierService {
  minify(code: string): string;
}

export interface CssMinifierService {
  minify(css: string): string;
}

// Cryptography Services
export interface CryptographyService {
  encryption: EncryptionService;
  hash: HashService;
}

export interface EncryptionService {
  encrypt(text: string, algorithm: string, key: string): string;
  decrypt(encrypted: string, algorithm: string, key: string): string;
}

export interface HashService {
  md5(text: string): string;
  sha1(text: string): string;
  sha256(text: string): string;
  sha512(text: string): string;
}

// Random Generator Services
export interface RandomGeneratorService {
  digit(): string;
  number(min?: number, max?: number): number;
  decimal(min?: number, max?: number, decimals?: number): number;
  character(): string;
  string(length: number): string;
  phrase(words: number): string;
  paragraph(sentences: number): string;
  page(paragraphs: number): string;
  image(width: number, height: number): string;
  color(): string;
  ipAddress(): string;
  dateTime(): Date;
  name(): string;
  password(length: number, includeSymbols?: boolean): string;
}

// String Utilities Services
export interface StringUtilitiesService {
  case: StringCaseService;
  reverse(text: string): string;
  countWords(text: string): number;
  removeDuplicateWhitespace(text: string): string;
  removeEmptyLines(text: string): string;
}

// Miscellaneous Services
export interface MiscellaneousService {
  asciiArt: AsciiArtService;
  whitespace: WhitespaceService;
}

export interface AsciiArtService {
  textToAscii(text: string, font?: string): string;
}

export interface WhitespaceService {
  removeDuplicateWhitespace(text: string): string;
  removeEmptyLines(text: string): string;
}

// Enums and Types
export enum CaseType {
  UPPER = 'upper',
  LOWER = 'lower',
  TITLE = 'title',
  CAMEL = 'camel',
  PASCAL = 'pascal',
  SNAKE = 'snake',
  KEBAB = 'kebab',
}

export enum LengthUnit {
  METER = 'meter',
  KILOMETER = 'kilometer',
  CENTIMETER = 'centimeter',
  MILLIMETER = 'millimeter',
  INCH = 'inch',
  FOOT = 'foot',
  YARD = 'yard',
  MILE = 'mile',
}

export enum TemperatureUnit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit',
  KELVIN = 'kelvin',
}

export enum AreaUnit {
  SQUARE_METER = 'square_meter',
  SQUARE_KILOMETER = 'square_kilometer',
  SQUARE_FOOT = 'square_foot',
  SQUARE_INCH = 'square_inch',
  ACRE = 'acre',
  HECTARE = 'hectare',
}

export enum VolumeUnit {
  LITER = 'liter',
  MILLILITER = 'milliliter',
  GALLON = 'gallon',
  QUART = 'quart',
  PINT = 'pint',
  CUP = 'cup',
  FLUID_OUNCE = 'fluid_ounce',
}

export enum WeightUnit {
  KILOGRAM = 'kilogram',
  GRAM = 'gram',
  POUND = 'pound',
  OUNCE = 'ounce',
  TON = 'ton',
}

export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
