import figlet from 'figlet';
// @ts-ignore - figlet font imports don't have types
import Standard from 'figlet/importable-fonts/Standard.js';
// @ts-ignore - figlet font imports don't have types  
import Small from 'figlet/importable-fonts/Small.js';
// @ts-ignore - figlet font imports don't have types
import Big from 'figlet/importable-fonts/Big.js';

export interface AsciiArtOptions {
  font?: string;
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
  verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
  width?: number;
  whitespaceBreak?: boolean;
}

export interface AsciiArtResult {
  text: string;
  lines: string[];
  font: string;
  originalText: string;
  characterCount: number;
  lineCount: number;
  options: AsciiArtOptions;
}

export interface FontInfo {
  name: string;
  displayName: string;
  description: string;
  category: 'basic' | 'decorative' | 'block' | 'script' | 'special';
  preloaded: boolean;
}

export class AsciiArtService {
  private static instance: AsciiArtService | null = null;
  private static initialized = false;
  // Font catalog with proper figlet fonts
  private static readonly FONT_CATALOG: FontInfo[] = [
    {
      name: 'Standard',
      displayName: 'Standard',
      description: 'Classic FIGlet standard font',
      category: 'basic',
      preloaded: true
    },
    {
      name: 'Small',
      displayName: 'Small',
      description: 'Compact figlet font for smaller text',
      category: 'basic',
      preloaded: true
    },
    {
      name: 'Big',
      displayName: 'Big',
      description: 'Large figlet font for bold display',
      category: 'block',
      preloaded: true
    }
  ];

  private constructor() {}

  public static getInstance(): AsciiArtService {
    if (!AsciiArtService.instance) {
      AsciiArtService.instance = new AsciiArtService();
    }
    return AsciiArtService.instance;
  }

  private static async initializeFonts(): Promise<void> {
    if (AsciiArtService.initialized) return;

    try {
      // Parse and load fonts as per figlet.js browser documentation
      // Use .default property for ES modules
      figlet.parseFont('Standard', Standard.default || Standard);
      figlet.parseFont('Small', Small.default || Small);
      figlet.parseFont('Big', Big.default || Big);
      
      AsciiArtService.initialized = true;
    } catch (error) {
      console.error('Failed to initialize figlet fonts:', error);
      throw new Error('Failed to initialize ASCII art fonts');
    }
  }

  /**
   * Generate ASCII art using figlet with proper browser implementation
   */
  public async generateAsciiArt(
    text: string, 
    options: AsciiArtOptions = {}
  ): Promise<AsciiArtResult> {
    return AsciiArtService.generateAsciiArt(text, options);
  }

  /**
   * Generate ASCII art using figlet with proper browser implementation (static)
   */
  public static async generateAsciiArt(
    text: string, 
    options: AsciiArtOptions = {}
  ): Promise<AsciiArtResult> {
    if (!text) {
      return this.createEmptyResult(text, options);
    }

    try {
      // Ensure fonts are initialized
      await AsciiArtService.initializeFonts();

      const fontName = options.font || 'Standard';

      // Use figlet.textSync with the preloaded font
      const asciiText = figlet.textSync(text, {
        font: fontName as any,
        horizontalLayout: options.horizontalLayout || 'default',
        verticalLayout: options.verticalLayout || 'default',
        width: options.width || 80,
        whitespaceBreak: options.whitespaceBreak || true
      });

      const lines = asciiText.split('\n');

      return {
        text: asciiText,
        lines,
        font: fontName,
        originalText: text,
        characterCount: text.length,
        lineCount: lines.length,
        options: { ...options, font: fontName }
      };
    } catch (error) {
      console.error('Error generating ASCII art:', error);
      throw new Error(`Failed to generate ASCII art: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static createEmptyResult(text: string, options: AsciiArtOptions): AsciiArtResult {
    return {
      text: '',
      lines: [],
      font: options.font || 'Standard',
      originalText: text,
      characterCount: 0,
      lineCount: 0,
      options: { ...options, font: options.font || 'Standard' }
    };
  }

  /**
   * Get available fonts from the catalog
   */
  public getAvailableFonts(): FontInfo[] {
    return [...AsciiArtService.FONT_CATALOG];
  }

  public getFontNames(): string[] {
    return AsciiArtService.FONT_CATALOG.map(font => font.name);
  }

  public isFontAvailable(fontName: string): boolean {
    return AsciiArtService.FONT_CATALOG.some(font => font.name === fontName);
  }

  public getFontInfo(fontName: string): FontInfo | null {
    return AsciiArtService.FONT_CATALOG.find(font => font.name === fontName) || null;
  }

  public async validateText(text: string): Promise<boolean> {
    try {
      if (!text || text.length === 0) return false;
      if (text.length > 50) return false; // Limit text length
      
      // Check for valid characters
      const validPattern = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
      return validPattern.test(text);
    } catch {
      return false;
    }
  }

  public getPreviewText(fontName: string): string {
    return `${fontName} Font`;
  }

  /**
   * Get fonts grouped by category
   */
  public static getFontsByCategory(): Record<string, FontInfo[]> {
    const result: Record<string, FontInfo[]> = {};
    
    for (const font of AsciiArtService.FONT_CATALOG) {
      if (!result[font.category]) {
        result[font.category] = [];
      }
      result[font.category].push(font);
    }
    
    return result;
  }

  /**
   * Get sample text for a given font
   */
  public static getSampleText(fontName: string): string {
    const fontInfo = AsciiArtService.FONT_CATALOG.find(f => f.name === fontName);
    if (!fontInfo) return 'SAMPLE';
    
    switch (fontInfo.category) {
      case 'basic': return 'TEXT';
      case 'decorative': return 'FANCY';
      case 'block': return 'BLOCK';
      case 'script': return 'Style';
      case 'special': return '12:34';
      default: return 'DEMO';
    }
  }

  /**
   * Get usage statistics for ASCII art result
   */
  public static getUsageStats(result: AsciiArtResult): {
    characterCount: number;
    lineCount: number;
    averageLineLength: number;
    maxLineLength: number;
  } {
    const lineLengths = result.lines.map(line => line.length);
    const maxLineLength = Math.max(...lineLengths, 0);
    const averageLineLength = lineLengths.length > 0 
      ? lineLengths.reduce((sum, length) => sum + length, 0) / lineLengths.length 
      : 0;

    return {
      characterCount: result.characterCount,
      lineCount: result.lineCount,
      averageLineLength: Math.round(averageLineLength),
      maxLineLength
    };
  }

  /**
   * Copy ASCII art to clipboard
   */
  public static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }

  /**
   * Export ASCII art as downloadable text file
   */
  public static exportAsText(result: AsciiArtResult): void {
    const filename = `ascii-art-${result.originalText.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    const content = `ASCII Art Generated by Spannerly
Original Text: ${result.originalText}
Font: ${result.font}
Generated on: ${new Date().toISOString()}

${result.text}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}
