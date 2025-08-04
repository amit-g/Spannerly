/**
 * Validator utilities service
 * Provides methods for validating different formats and data types
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  lineNumber?: number;
  columnNumber?: number;
}

export class ValidatorService {
  /**
   * JSON validation
   */
  static validateJson(jsonString: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: []
    };

    if (!jsonString.trim()) {
      result.errors.push('JSON input is empty');
      return result;
    }

    try {
      const parsed = JSON.parse(jsonString);
      result.isValid = true;

      // Add some helpful warnings for common issues
      if (typeof parsed === 'string') {
        result.warnings?.push('JSON contains a single string value - consider if this is intentional');
      } else if (typeof parsed === 'number') {
        result.warnings?.push('JSON contains a single number value - consider if this is intentional');
      } else if (parsed === null) {
        result.warnings?.push('JSON contains null value');
      } else if (Array.isArray(parsed) && parsed.length === 0) {
        result.warnings?.push('JSON contains an empty array');
      } else if (typeof parsed === 'object' && Object.keys(parsed).length === 0) {
        result.warnings?.push('JSON contains an empty object');
      }

    } catch (error) {
      result.isValid = false;
      if (error instanceof SyntaxError) {
        const errorMessage = error.message;
        result.errors.push(`Syntax Error: ${errorMessage}`);
        
        // Try to extract line/column information
        const lineMatch = errorMessage.match(/line (\d+)/i);
        const columnMatch = errorMessage.match(/column (\d+)/i);
        const positionMatch = errorMessage.match(/position (\d+)/i);
        
        if (lineMatch) {
          result.lineNumber = parseInt(lineMatch[1]);
        }
        if (columnMatch) {
          result.columnNumber = parseInt(columnMatch[1]);
        } else if (positionMatch) {
          // Convert position to line/column
          const position = parseInt(positionMatch[1]);
          const lines = jsonString.substring(0, position).split('\n');
          result.lineNumber = lines.length;
          result.columnNumber = lines[lines.length - 1].length + 1;
        }
      } else {
        result.errors.push(`Parsing Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  }

  /**
   * CSS validation (basic)
   */
  static validateCss(cssString: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: []
    };

    if (!cssString.trim()) {
      result.errors.push('CSS input is empty');
      return result;
    }

    try {
      // Basic CSS syntax validation
      const errors: string[] = [];
      const warnings: string[] = [];
      const lines = cssString.split('\n');

      let braceCount = 0;
      let inSelector = false;
      let inProperty = false;
      let currentSelector = '';

      for (let i = 0; i < lines.length; i++) {
        const lineNumber = i + 1;
        const line = lines[i].trim();
        
        if (!line || line.startsWith('/*')) continue;

        // Check for unmatched braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;

        if (braceCount < 0) {
          errors.push(`Line ${lineNumber}: Unexpected closing brace '}'`);
          braceCount = 0;
        }

        // Check for selector syntax
        if (line.includes('{')) {
          inSelector = false;
          inProperty = true;
          currentSelector = line.substring(0, line.indexOf('{')).trim();
          
          if (!currentSelector) {
            errors.push(`Line ${lineNumber}: Missing selector before opening brace`);
          }
        }

        if (line.includes('}')) {
          inProperty = false;
          inSelector = false;
        }

        // Check property syntax inside rules
        if (inProperty && line.includes(':') && !line.includes('{') && !line.includes('}')) {
          const colonIndex = line.indexOf(':');
          const property = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();

          if (!property) {
            errors.push(`Line ${lineNumber}: Missing property name before ':'`);
          }

          if (!value || !value.endsWith(';')) {
            if (!value) {
              errors.push(`Line ${lineNumber}: Missing property value after ':'`);
            } else {
              warnings.push(`Line ${lineNumber}: Property declaration should end with ';'`);
            }
          }

          // Check for common property names
          if (property && !this.isValidCssProperty(property)) {
            warnings.push(`Line ${lineNumber}: '${property}' might not be a valid CSS property`);
          }
        }

        // Check for invalid characters in selectors
        if (!inProperty && line && !line.includes('{') && !line.includes('}') && !line.includes(':')) {
          inSelector = true;
          if (line.includes(';;') || line.includes('::')) {
            warnings.push(`Line ${lineNumber}: Suspicious selector syntax`);
          }
        }
      }

      if (braceCount > 0) {
        errors.push(`Unclosed braces: ${braceCount} opening brace(s) without corresponding closing brace(s)`);
      }

      result.errors = errors;
      result.warnings = warnings;
      result.isValid = errors.length === 0;

    } catch (error) {
      result.errors.push(`Validation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private static isValidCssProperty(property: string): boolean {
    // Common CSS properties - this is a basic check
    const commonProperties = [
      'color', 'background', 'background-color', 'background-image', 'font-size', 'font-family',
      'font-weight', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position',
      'top', 'left', 'right', 'bottom', 'z-index', 'opacity', 'transform', 'transition',
      'animation', 'flex', 'grid', 'justify-content', 'align-items', 'text-align', 'line-height',
      'letter-spacing', 'word-spacing', 'text-decoration', 'text-transform', 'white-space',
      'overflow', 'box-shadow', 'border-radius', 'outline', 'cursor', 'visibility',
      'min-width', 'max-width', 'min-height', 'max-height', 'float', 'clear'
    ];

    return commonProperties.includes(property.toLowerCase()) || 
           property.startsWith('-webkit-') || 
           property.startsWith('-moz-') || 
           property.startsWith('-ms-') || 
           property.startsWith('-o-') ||
           property.startsWith('--'); // CSS custom properties
  }

  /**
   * Email validation
   */
  static validateEmail(email: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: []
    };

    if (!email.trim()) {
      result.errors.push('Email address is empty');
      return result;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      result.errors.push('Invalid email format');
    } else {
      result.isValid = true;
      
      // Additional checks for warnings
      if (email.length > 254) {
        result.warnings?.push('Email address is unusually long (>254 characters)');
      }
      
      const [localPart, domain] = email.split('@');
      if (localPart.length > 64) {
        result.warnings?.push('Local part of email is unusually long (>64 characters)');
      }
      
      if (domain.includes('..')) {
        result.warnings?.push('Domain contains consecutive dots');
      }
      
      if (!domain.includes('.')) {
        result.warnings?.push('Domain should contain at least one dot');
      }
    }

    return result;
  }

  /**
   * URL validation
   */
  static validateUrl(url: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: []
    };

    if (!url.trim()) {
      result.errors.push('URL is empty');
      return result;
    }

    try {
      const urlObject = new URL(url);
      result.isValid = true;

      // Add warnings for potential issues
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        result.warnings?.push(`Protocol '${urlObject.protocol}' might not be web-accessible`);
      }

      if (urlObject.hostname === 'localhost' || urlObject.hostname.startsWith('127.')) {
        result.warnings?.push('URL points to localhost');
      }

      if (urlObject.port && !['80', '443'].includes(urlObject.port)) {
        result.warnings?.push(`Non-standard port ${urlObject.port} specified`);
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * XML validation (basic)
   */
  static validateXml(xmlString: string): ValidationResult {
    const result: ValidationResult = {
      isValid: false,
      errors: [],
      warnings: []
    };

    if (!xmlString.trim()) {
      result.errors.push('XML input is empty');
      return result;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        result.isValid = false;
        result.errors.push(`XML Parse Error: ${parserError.textContent || 'Unknown parsing error'}`);
      } else {
        result.isValid = true;
        
        // Check for potential issues
        if (!xmlString.trim().startsWith('<?xml')) {
          result.warnings?.push('XML declaration not found at the beginning');
        }
        
        const rootElements = xmlDoc.children.length;
        if (rootElements > 1) {
          result.warnings?.push('Multiple root elements found (not well-formed XML)');
        } else if (rootElements === 0) {
          result.warnings?.push('No root element found');
        }
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`XML Validation Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }
}
