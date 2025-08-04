import { BrowserTextService } from '@/services/TextService';
import { CaseType } from '@/types/services';

describe('BrowserTextService', () => {
  let service: BrowserTextService;

  beforeEach(() => {
    service = new BrowserTextService();
  });

  describe('convertCase', () => {
    const testText = 'hello world test';

    it('should convert to uppercase', () => {
      const result = service.convertCase(testText, CaseType.UPPER);
      expect(result).toBe('HELLO WORLD TEST');
    });

    it('should convert to lowercase', () => {
      const result = service.convertCase('HELLO WORLD TEST', CaseType.LOWER);
      expect(result).toBe('hello world test');
    });

    it('should convert to title case', () => {
      const result = service.convertCase(testText, CaseType.TITLE);
      expect(result).toBe('Hello World Test');
    });

    it('should convert to camelCase', () => {
      const result = service.convertCase(testText, CaseType.CAMEL);
      expect(result).toBe('helloWorldTest');
    });

    it('should convert to PascalCase', () => {
      const result = service.convertCase(testText, CaseType.PASCAL);
      expect(result).toBe('HelloWorldTest');
    });

    it('should convert to snake_case', () => {
      const result = service.convertCase(testText, CaseType.SNAKE);
      expect(result).toBe('hello_world_test');
    });

    it('should convert to kebab-case', () => {
      const result = service.convertCase(testText, CaseType.KEBAB);
      expect(result).toBe('hello-world-test');
    });
  });

  describe('Base64 operations', () => {
    const testText = 'Hello, World!';
    const expectedBase64 = 'SGVsbG8sIFdvcmxkIQ==';

    it('should encode text to Base64', () => {
      const result = service.encodeBase64(testText);
      expect(result).toBe(expectedBase64);
    });

    it('should decode Base64 to text', () => {
      const result = service.decodeBase64(expectedBase64);
      expect(result).toBe(testText);
    });

    it('should throw error for invalid Base64', () => {
      expect(() => service.decodeBase64('invalid-base64!')).toThrow();
    });
  });
});
