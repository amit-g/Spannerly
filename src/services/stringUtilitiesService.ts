/**
 * String Utilities Service
 * Provides various string manipulation and utility functions
 */

// Escape Utilities Types
export interface EscapeOptions {
  escapeType: 'json' | 'html' | 'url' | 'sql' | 'javascript' | 'xml';
  direction: 'escape' | 'unescape';
}

export interface EscapeResult {
  original: string;
  result: string;
  escapeType: string;
  direction: string;
  characterCount: number;
}

// Quote Utilities Types
export interface QuoteOptions {
  quoteType: 'single' | 'double' | 'backtick' | 'smart';
  action: 'add' | 'remove' | 'convert';
  targetQuoteType?: 'single' | 'double' | 'backtick' | 'smart';
}

export interface QuoteResult {
  original: string;
  result: string;
  action: string;
  quoteType: string;
  lineCount: number;
}

// Text Joiner Types
export interface JoinerOptions {
  separator: string;
  removeEmptyLines: boolean;
  trimLines: boolean;
  addFinalSeparator: boolean;
  prefix?: string;
  suffix?: string;
}

export interface JoinerResult {
  original: string[];
  result: string;
  separator: string;
  lineCount: number;
  finalLength: number;
}

// Text Splitter Types
export interface SplitterOptions {
  splitType: 'delimiter' | 'length' | 'lines' | 'words' | 'regex';
  delimiter?: string;
  chunkSize?: number;
  preserveDelimiter: boolean;
  removeEmpty: boolean;
  regex?: string;
}

export interface SplitterResult {
  original: string;
  result: string[];
  splitType: string;
  chunkCount: number;
  totalCharacters: number;
}

// Slug Generator Types
export interface SlugOptions {
  separator: '-' | '_' | '.';
  case: 'lower' | 'upper' | 'preserve';
  removeStopWords: boolean;
  maxLength?: number;
  allowNumbers: boolean;
  customReplacements?: Record<string, string>;
}

export interface SlugResult {
  original: string;
  result: string;
  separator: string;
  transformations: string[];
  finalLength: number;
}

/**
 * String Utilities Service
 * Centralized service for string manipulation operations
 */
export class StringUtilitiesService {
  // Common stop words for slug generation
  private static stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they', 'have',
    'had', 'what', 'said', 'each', 'which', 'she', 'do', 'how', 'their'
  ]);

  /**
   * String Escape Utilities
   */
  static escapeString(text: string, options: EscapeOptions): EscapeResult {
    const { escapeType, direction } = options;
    let result = text;
    
    if (direction === 'escape') {
      switch (escapeType) {
        case 'json':
          result = JSON.stringify(text).slice(1, -1); // Remove surrounding quotes
          break;
        case 'html':
          result = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          break;
        case 'url':
          result = encodeURIComponent(text);
          break;
        case 'sql':
          result = text.replace(/'/g, "''").replace(/\\/g, '\\\\');
          break;
        case 'javascript':
          result = text
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
          break;
        case 'xml':
          result = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
          break;
      }
    } else {
      // Unescape
      switch (escapeType) {
        case 'json':
          try {
            result = JSON.parse(`"${text}"`);
          } catch {
            result = 'Invalid JSON string';
          }
          break;
        case 'html':
          result = text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
          break;
        case 'url':
          try {
            result = decodeURIComponent(text);
          } catch {
            result = 'Invalid URL encoding';
          }
          break;
        case 'sql':
          result = text.replace(/''/g, "'").replace(/\\\\/g, '\\');
          break;
        case 'javascript':
          result = text
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
          break;
        case 'xml':
          result = text
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
          break;
      }
    }

    return {
      original: text,
      result,
      escapeType,
      direction,
      characterCount: result.length,
    };
  }

  /**
   * Quote Utilities
   */
  static handleQuotes(text: string, options: QuoteOptions): QuoteResult {
    const { quoteType, action, targetQuoteType } = options;
    const lines = text.split('\n');
    let result: string[];

    switch (action) {
      case 'add':
        result = lines.map(line => {
          if (!line.trim()) return line;
          return this.addQuotes(line, quoteType);
        });
        break;
      case 'remove':
        result = lines.map(line => this.removeQuotes(line));
        break;
      case 'convert':
        if (!targetQuoteType) throw new Error('Target quote type required for conversion');
        result = lines.map(line => {
          const unquoted = this.removeQuotes(line);
          return this.addQuotes(unquoted, targetQuoteType);
        });
        break;
      default:
        result = lines;
    }

    return {
      original: text,
      result: result.join('\n'),
      action,
      quoteType: targetQuoteType || quoteType,
      lineCount: lines.length,
    };
  }

  private static addQuotes(text: string, quoteType: QuoteOptions['quoteType']): string {
    const quotes = {
      single: "'",
      double: '"',
      backtick: '`',
      smart: '\u201C', // Smart double quote start
    };
    
    const quote = quotes[quoteType];
    const smartEnd = quoteType === 'smart' ? '\u201D' : quote; // Smart double quote end
    
    return `${quote}${text}${smartEnd}`;
  }

  private static removeQuotes(text: string): string {
    const trimmed = text.trim();
    
    // Check for various quote pairs
    const quotePairs = [
      ['"', '"'], 
      ["'", "'"], 
      ['`', '`'], 
      ['\u201C', '\u201D'], // Smart double quotes
      ['\u2018', '\u2019']  // Smart single quotes
    ];
    
    for (const [start, end] of quotePairs) {
      if (trimmed.startsWith(start) && trimmed.endsWith(end) && trimmed.length > 1) {
        return trimmed.slice(start.length, -end.length);
      }
    }
    
    return trimmed;
  }

  /**
   * Text Joiner
   */
  static joinText(lines: string[], options: JoinerOptions): JoinerResult {
    const { separator, removeEmptyLines, trimLines, addFinalSeparator, prefix = '', suffix = '' } = options;
    
    let processedLines = [...lines];
    
    // Trim lines if requested
    if (trimLines) {
      processedLines = processedLines.map(line => line.trim());
    }
    
    // Remove empty lines if requested
    if (removeEmptyLines) {
      processedLines = processedLines.filter(line => line.length > 0);
    }
    
    // Add prefix and suffix if specified
    if (prefix || suffix) {
      processedLines = processedLines.map(line => `${prefix}${line}${suffix}`);
    }
    
    // Join with separator
    let result = processedLines.join(separator);
    
    // Add final separator if requested
    if (addFinalSeparator && processedLines.length > 0) {
      result += separator;
    }
    
    return {
      original: lines,
      result,
      separator,
      lineCount: processedLines.length,
      finalLength: result.length,
    };
  }

  /**
   * Text Splitter
   */
  static splitText(text: string, options: SplitterOptions): SplitterResult {
    const { splitType, delimiter = '', chunkSize = 10, preserveDelimiter, removeEmpty, regex = '' } = options;
    let result: string[] = [];
    
    switch (splitType) {
      case 'delimiter':
        if (preserveDelimiter) {
          // Split but keep delimiter
          const parts = text.split(delimiter);
          result = parts.reduce((acc: string[], part, index) => {
            if (index === 0) {
              acc.push(part);
            } else {
              acc.push(delimiter + part);
            }
            return acc;
          }, []);
        } else {
          result = text.split(delimiter);
        }
        break;
        
      case 'length':
        for (let i = 0; i < text.length; i += chunkSize) {
          result.push(text.substring(i, i + chunkSize));
        }
        break;
        
      case 'lines':
        result = text.split(/\r?\n/);
        break;
        
      case 'words':
        result = text.split(/\s+/);
        break;
        
      case 'regex':
        try {
          const regexPattern = new RegExp(regex, 'g');
          result = text.split(regexPattern);
        } catch {
          result = ['Invalid regex pattern'];
        }
        break;
    }
    
    // Remove empty strings if requested
    if (removeEmpty) {
      result = result.filter(item => item.trim().length > 0);
    }
    
    return {
      original: text,
      result,
      splitType,
      chunkCount: result.length,
      totalCharacters: text.length,
    };
  }

  /**
   * Slug Generator
   */
  static generateSlug(text: string, options: SlugOptions): SlugResult {
    const { separator, case: caseOption, removeStopWords, maxLength, allowNumbers, customReplacements = {} } = options;
    
    let result = text;
    const transformations: string[] = [];
    
    // Apply custom replacements first
    Object.entries(customReplacements).forEach(([search, replace]) => {
      if (result.includes(search)) {
        result = result.replace(new RegExp(search, 'g'), replace);
        transformations.push(`Replaced "${search}" with "${replace}"`);
      }
    });
    
    // Convert to lowercase/uppercase based on option
    if (caseOption === 'lower') {
      result = result.toLowerCase();
      transformations.push('Converted to lowercase');
    } else if (caseOption === 'upper') {
      result = result.toUpperCase();
      transformations.push('Converted to uppercase');
    }
    
    // Remove special characters, keep only alphanumeric, spaces, and hyphens
    const allowedPattern = allowNumbers ? /[^a-zA-Z0-9\s\-_]/g : /[^a-zA-Z\s\-_]/g;
    const beforeSpecialChars = result;
    result = result.replace(allowedPattern, '');
    if (beforeSpecialChars !== result) {
      transformations.push('Removed special characters');
    }
    
    // Split into words
    const words = result.split(/\s+/).filter(word => word.length > 0);
    
    // Remove stop words if requested
    let finalWords = words;
    if (removeStopWords) {
      const beforeStopWords = finalWords.length;
      finalWords = words.filter(word => !this.stopWords.has(word.toLowerCase()));
      if (finalWords.length !== beforeStopWords) {
        transformations.push(`Removed ${beforeStopWords - finalWords.length} stop words`);
      }
    }
    
    // Join with separator
    result = finalWords.join(separator);
    
    // Limit length if specified
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
      // Make sure we don't cut in the middle of a word
      const lastSeparatorIndex = result.lastIndexOf(separator);
      if (lastSeparatorIndex > maxLength * 0.8) { // If we're close to the end
        result = result.substring(0, lastSeparatorIndex);
      }
      transformations.push(`Truncated to ${maxLength} characters`);
    }
    
    // Clean up any double separators or leading/trailing separators
    const cleanPattern = new RegExp(`${separator}+`, 'g');
    result = result.replace(cleanPattern, separator);
    result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');
    
    return {
      original: text,
      result,
      separator,
      transformations,
      finalLength: result.length,
    };
  }

  /**
   * Validation helpers
   */
  static validateInput(text: string, minLength = 0, maxLength = 10000): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!text) {
      errors.push('Input text is required');
    }
    
    if (text.length < minLength) {
      errors.push(`Text must be at least ${minLength} characters`);
    }
    
    if (text.length > maxLength) {
      errors.push(`Text must be no more than ${maxLength} characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
