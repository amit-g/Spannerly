/**
 * Random Generators Service
 * Provides various random generation functions
 */

// UUID Generator Types
export interface UuidOptions {
  version: 'v4' | 'v1' | 'nil';
  format: 'standard' | 'uppercase' | 'no-hyphens';
  quantity: number;
}

export interface UuidResult {
  uuids: string[];
  version: string;
  format: string;
  quantity: number;
}

// Lorem Ipsum Generator Types
export interface LoremOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
  startWithLorem: boolean;
}

export interface LoremResult {
  text: string;
  type: string;
  count: number;
  wordCount: number;
  characterCount: number;
}

// Number Generator Types
export interface NumberOptions {
  min: number;
  max: number;
  quantity: number;
  allowDecimals: boolean;
  decimalPlaces?: number;
  allowNegative: boolean;
}

export interface NumberResult {
  numbers: number[];
  min: number;
  max: number;
  quantity: number;
  average: number;
}

// QR Code Generator Types
export interface QrCodeOptions {
  text: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  format: 'png' | 'svg';
}

export interface QrCodeResult {
  dataUrl: string;
  text: string;
  size: string;
  format: string;
}

// Password Generator Types
export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  customCharacters?: string;
  quantity: number;
}

export interface PasswordResult {
  passwords: string[];
  length: number;
  strength: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  charset: string;
  entropy: number;
  quantity: number;
}

// Random String Generator Types
export interface RandomStringOptions {
  length: number;
  charset: 'alphanumeric' | 'alphabetic' | 'numeric' | 'lowercase' | 'uppercase' | 'custom';
  customCharset?: string;
  quantity: number;
  prefix?: string;
  suffix?: string;
}

export interface RandomStringResult {
  strings: string[];
  length: number;
  charset: string;
  quantity: number;
}

// Color Generator Types
export interface ColorOptions {
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'all';
  quantity: number;
  saturationRange?: { min: number; max: number };
  lightnessRange?: { min: number; max: number };
  hueRange?: { min: number; max: number };
  alphaRange?: { min: number; max: number };
  includeNames?: boolean;
}

export interface RandomColorResult {
  colors: Array<{
    value: string;
    hex: string;
    name?: string;
  }>;
  format: string;
  quantity: number;
}

// Name Generator Types
export interface NameOptions {
  type: 'first' | 'last' | 'full' | 'username' | 'company';
  quantity: number;
  gender?: 'male' | 'female' | 'any';
  nationality?: string;
}

export interface NameResult {
  names: string[];
  type: string;
  quantity: number;
}

/**
 * Random Generators Service
 * Centralized service for random generation operations
 */
export class RandomGeneratorsService {
  // Lorem Ipsum word bank
  private static loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
    'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
    'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
    'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
  ];

  // Sample names for name generator
  private static firstNames = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'],
  };

  private static lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  private static companyWords = [
    'Tech', 'Solutions', 'Systems', 'Global', 'Digital', 'Innovation', 'Dynamics', 'Corporation',
    'Industries', 'Technologies', 'Enterprises', 'Group', 'Labs', 'Studio', 'Works', 'Pro'
  ];

  // Character sets for password and string generation
  private static charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>',
  };

  /**
   * UUID Generator
   */
  static generateUuids(options: UuidOptions): UuidResult {
    const { version, format, quantity } = options;
    const uuids: string[] = [];

    for (let i = 0; i < quantity; i++) {
      let uuid: string;

      if (version === 'v4') {
        uuid = this.generateUuidV4();
      } else if (version === 'v1') {
        uuid = this.generateUuidV1();
      } else {
        uuid = '00000000-0000-0000-0000-000000000000'; // nil UUID
      }

      // Apply formatting
      switch (format) {
        case 'uppercase':
          uuid = uuid.toUpperCase();
          break;
        case 'no-hyphens':
          uuid = uuid.replace(/-/g, '');
          break;
        default:
          // standard format, no changes needed
          break;
      }

      uuids.push(uuid);
    }

    return {
      uuids,
      version,
      format,
      quantity,
    };
  }

  private static generateUuidV4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private static generateUuidV1(): string {
    // Simplified v1 UUID (timestamp-based)
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 14);
    return `${timestamp.toString(16)}-1000-1000-8000-${random}`;
  }

  /**
   * Lorem Ipsum Generator
   */
  static generateLorem(options: LoremOptions): LoremResult {
    const { type, count, startWithLorem } = options;
    let text = '';

    switch (type) {
      case 'words':
        text = this.generateLoremWords(count, startWithLorem);
        break;
      case 'sentences':
        text = this.generateLoremSentences(count, startWithLorem);
        break;
      case 'paragraphs':
        text = this.generateLoremParagraphs(count, startWithLorem);
        break;
    }

    return {
      text,
      type,
      count,
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
    };
  }

  private static generateLoremWords(count: number, startWithLorem: boolean): string {
    const words: string[] = [];
    
    if (startWithLorem && count > 0) {
      words.push('Lorem');
      count--;
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.loremWords.length);
      words.push(this.loremWords[randomIndex]);
    }

    return words.join(' ');
  }

  private static generateLoremSentences(count: number, startWithLorem: boolean): string {
    const sentences: string[] = [];

    for (let i = 0; i < count; i++) {
      const sentenceLength = Math.floor(Math.random() * 15) + 5; // 5-20 words per sentence
      const isFirst = i === 0 && startWithLorem;
      const sentence = this.generateLoremWords(sentenceLength, isFirst);
      const capitalizedSentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      sentences.push(capitalizedSentence + '.');
    }

    return sentences.join(' ');
  }

  private static generateLoremParagraphs(count: number, startWithLorem: boolean): string {
    const paragraphs: string[] = [];

    for (let i = 0; i < count; i++) {
      const sentenceCount = Math.floor(Math.random() * 6) + 3; // 3-8 sentences per paragraph
      const isFirst = i === 0 && startWithLorem;
      const paragraph = this.generateLoremSentences(sentenceCount, isFirst);
      paragraphs.push(paragraph);
    }

    return paragraphs.join('\n\n');
  }

  /**
   * Random Number Generator
   */
  static generateNumbers(options: NumberOptions): NumberResult {
    const { min, max, quantity, allowDecimals, decimalPlaces = 2, allowNegative } = options;
    const numbers: number[] = [];

    for (let i = 0; i < quantity; i++) {
      let randomNum: number;

      if (allowDecimals) {
        randomNum = Math.random() * (max - min) + min;
        randomNum = Number(randomNum.toFixed(decimalPlaces));
      } else {
        randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      }

      if (!allowNegative && randomNum < 0) {
        randomNum = Math.abs(randomNum);
      }

      numbers.push(randomNum);
    }

    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;

    return {
      numbers,
      min,
      max,
      quantity,
      average: Number(average.toFixed(2)),
    };
  }

  /**
   * Password Generator
   */
  static generatePasswords(options: PasswordOptions): PasswordResult {
    const { 
      length, 
      includeUppercase, 
      includeLowercase, 
      includeNumbers, 
      includeSymbols,
      excludeSimilar,
      excludeAmbiguous,
      customCharacters,
      quantity 
    } = options;

    // Build character set
    let charset = '';
    if (includeUppercase) charset += this.charSets.uppercase;
    if (includeLowercase) charset += this.charSets.lowercase;
    if (includeNumbers) charset += this.charSets.numbers;
    if (includeSymbols) charset += this.charSets.symbols;
    if (customCharacters) charset += customCharacters;

    // Remove similar characters if requested
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !this.charSets.similar.includes(char)).join('');
    }

    // Remove ambiguous characters if requested
    if (excludeAmbiguous) {
      charset = charset.split('').filter(char => !this.charSets.ambiguous.includes(char)).join('');
    }

    if (!charset) {
      throw new Error('No character set selected');
    }

    const passwords: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let password = '';
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      passwords.push(password);
    }

    // Calculate password strength
    const strength = this.calculatePasswordStrength(passwords[0], options);
    const entropy = Math.log2(charset.length) * length;

    return {
      passwords,
      length,
      strength,
      charset,
      entropy: Math.round(entropy * 100) / 100,
      quantity,
    };
  }

  private static calculatePasswordStrength(password: string, options: PasswordOptions): PasswordResult['strength'] {
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety scoring
    if (options.includeUppercase) score += 1;
    if (options.includeLowercase) score += 1;
    if (options.includeNumbers) score += 1;
    if (options.includeSymbols) score += 1;
    
    // Additional complexity
    if (password.length >= 20) score += 1;
    
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Fair';
    if (score <= 6) return 'Good';
    if (score <= 7) return 'Strong';
    return 'Very Strong';
  }

  /**
   * Random String Generator
   */
  static generateRandomStrings(options: RandomStringOptions): RandomStringResult {
    const { length, charset, customCharset, quantity, prefix = '', suffix = '' } = options;

    let characters = '';
    switch (charset) {
      case 'alphanumeric':
        characters = this.charSets.uppercase + this.charSets.lowercase + this.charSets.numbers;
        break;
      case 'alphabetic':
        characters = this.charSets.uppercase + this.charSets.lowercase;
        break;
      case 'numeric':
        characters = this.charSets.numbers;
        break;
      case 'lowercase':
        characters = this.charSets.lowercase;
        break;
      case 'uppercase':
        characters = this.charSets.uppercase;
        break;
      case 'custom':
        characters = customCharset || this.charSets.lowercase;
        break;
    }

    const strings: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let randomString = '';
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
      }
      strings.push(prefix + randomString + suffix);
    }

    return {
      strings,
      length: length + prefix.length + suffix.length,
      charset,
      quantity,
    };
  }

  /**
   * Color Generator
   */
  static generateColors(options: ColorOptions): RandomColorResult {
    const { 
      format, 
      quantity, 
      saturationRange = { min: 50, max: 100 },
      lightnessRange = { min: 30, max: 70 },
      hueRange = { min: 0, max: 360 },
      alphaRange = { min: 0.8, max: 1.0 },
      includeNames = false
    } = options;

    const colors: RandomColorResult['colors'] = [];

    // Simple color names mapping for common hue ranges
    const colorNames = [
      { min: 0, max: 15, name: 'Red' },
      { min: 16, max: 45, name: 'Orange' },
      { min: 46, max: 75, name: 'Yellow' },
      { min: 76, max: 165, name: 'Green' },
      { min: 166, max: 195, name: 'Cyan' },
      { min: 196, max: 255, name: 'Blue' },
      { min: 256, max: 285, name: 'Indigo' },
      { min: 286, max: 315, name: 'Purple' },
      { min: 316, max: 345, name: 'Magenta' },
      { min: 346, max: 360, name: 'Red' },
    ];

    for (let i = 0; i < quantity; i++) {
      // Generate random HSL values within ranges
      const hue = Math.floor(Math.random() * (hueRange.max - hueRange.min + 1)) + hueRange.min;
      const saturation = Math.floor(Math.random() * (saturationRange.max - saturationRange.min + 1)) + saturationRange.min;
      const lightness = Math.floor(Math.random() * (lightnessRange.max - lightnessRange.min + 1)) + lightnessRange.min;
      const alpha = Math.random() * (alphaRange.max - alphaRange.min) + alphaRange.min;

      // Convert HSL to RGB
      const rgb = this.hslToRgb(hue, saturation, lightness);
      
      // Convert RGB to HEX
      const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

      // Generate color name if requested
      let colorName: string | undefined;
      if (includeNames) {
        const nameEntry = colorNames.find(entry => hue >= entry.min && hue <= entry.max);
        const intensity = lightness < 30 ? 'Dark' : lightness > 70 ? 'Light' : '';
        const saturationDesc = saturation < 30 ? 'Muted' : saturation > 80 ? 'Vibrant' : '';
        const parts = [intensity, saturationDesc, nameEntry?.name || 'Gray'].filter(Boolean);
        colorName = parts.join(' ');
      }

      // Format the color value based on requested format
      let value: string;
      switch (format) {
        case 'hex':
          value = hex;
          break;
        case 'rgb':
          value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          break;
        case 'rgba':
          value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
          break;
        case 'hsl':
          value = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          break;
        case 'hsla':
          value = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha.toFixed(2)})`;
          break;
        case 'all':
        default:
          value = hex; // Default to hex for 'all' format
          break;
      }

      colors.push({
        value,
        hex,
        name: colorName,
      });
    }

    return {
      colors,
      format,
      quantity,
    };
  }

  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }

  /**
   * QR Code Generator (using a simple approach)
   */
  static async generateQrCode(options: QrCodeOptions): Promise<QrCodeResult> {
    const { text, size, errorCorrectionLevel, format } = options;
    
    // Size mapping
    const sizeMap = {
      small: 150,
      medium: 200,
      large: 300,
      xlarge: 400,
    };

    const qrSize = sizeMap[size];
    
    // For now, we'll use a simple QR code API service
    // In a real implementation, you might want to use a proper QR code library
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(text)}&ecc=${errorCorrectionLevel}&format=${format}`;
    
    return {
      dataUrl: apiUrl,
      text,
      size,
      format,
    };
  }

  /**
   * Name Generator
   */
  static generateNames(options: NameOptions): NameResult {
    const { type, quantity, gender = 'any' } = options;
    const names: string[] = [];

    for (let i = 0; i < quantity; i++) {
      let name: string;

      switch (type) {
        case 'first':
          name = this.generateFirstName(gender);
          break;
        case 'last':
          name = this.generateLastName();
          break;
        case 'full':
          name = `${this.generateFirstName(gender)} ${this.generateLastName()}`;
          break;
        case 'username':
          name = this.generateUsername();
          break;
        case 'company':
          name = this.generateCompanyName();
          break;
        default:
          name = this.generateFirstName(gender);
      }

      names.push(name);
    }

    return {
      names,
      type,
      quantity,
    };
  }

  private static generateFirstName(gender: 'male' | 'female' | 'any'): string {
    if (gender === 'any') {
      gender = Math.random() > 0.5 ? 'male' : 'female';
    }
    
    const nameList = this.firstNames[gender];
    return nameList[Math.floor(Math.random() * nameList.length)];
  }

  private static generateLastName(): string {
    return this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
  }

  private static generateUsername(): string {
    const firstName = this.generateFirstName('any').toLowerCase();
    const lastName = this.generateLastName().toLowerCase();
    const number = Math.floor(Math.random() * 1000);
    const separator = Math.random() > 0.5 ? '_' : '';
    
    return `${firstName}${separator}${lastName}${number}`;
  }

  private static generateCompanyName(): string {
    const word1 = this.companyWords[Math.floor(Math.random() * this.companyWords.length)];
    const word2 = this.companyWords[Math.floor(Math.random() * this.companyWords.length)];
    
    if (word1 === word2) {
      return word1;
    }
    
    return `${word1} ${word2}`;
  }

  /**
   * Validation helpers
   */
  static validateNumberRange(min: number, max: number): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (min >= max) {
      errors.push('Minimum value must be less than maximum value');
    }
    
    if (max - min > 1000000) {
      errors.push('Range is too large (max 1,000,000)');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateQuantity(quantity: number, maxAllowed = 1000): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (quantity < 1) {
      errors.push('Quantity must be at least 1');
    }
    
    if (quantity > maxAllowed) {
      errors.push(`Quantity cannot exceed ${maxAllowed}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
