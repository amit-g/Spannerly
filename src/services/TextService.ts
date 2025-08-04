import { TextService, CaseType } from '@/types/services';

export class BrowserTextService implements TextService {
  convertCase(text: string, caseType: CaseType): string {
    switch (caseType) {
      case CaseType.UPPER:
        return text.toUpperCase();
      case CaseType.LOWER:
        return text.toLowerCase();
      case CaseType.TITLE:
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case CaseType.CAMEL:
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
      case CaseType.PASCAL:
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
      case CaseType.SNAKE:
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
      case CaseType.KEBAB:
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
      default:
        return text;
    }
  }

  encodeBase64(text: string): string {
    try {
      return btoa(text);
    } catch (error) {
      throw new Error('Failed to encode to Base64');
    }
  }

  decodeBase64(encodedText: string): string {
    try {
      return atob(encodedText);
    } catch (error) {
      throw new Error('Failed to decode from Base64');
    }
  }
}
