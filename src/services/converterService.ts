/**
 * Converter utilities service
 * Provides methods for encoding, decoding, and converting between different formats
 */
export class ConverterService {
  /**
   * HTML encoding/decoding
   */
  static encodeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static decodeHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * URL encoding/decoding
   */
  static encodeUrl(text: string): string {
    return encodeURIComponent(text);
  }

  static decodeUrl(encodedText: string): string {
    try {
      return decodeURIComponent(encodedText);
    } catch (error) {
      throw new Error('Invalid URL encoded string');
    }
  }

  static encodeUrlQuery(params: Record<string, string>): string {
    return Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  static decodeUrlQuery(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  /**
   * Number base conversions
   */
  static decimalToBinary(decimal: number): string {
    return decimal.toString(2);
  }

  static decimalToOctal(decimal: number): string {
    return decimal.toString(8);
  }

  static decimalToHex(decimal: number): string {
    return decimal.toString(16).toUpperCase();
  }

  static binaryToDecimal(binary: string): number {
    const result = parseInt(binary, 2);
    if (isNaN(result)) {
      throw new Error('Invalid binary number');
    }
    return result;
  }

  static octalToDecimal(octal: string): number {
    const result = parseInt(octal, 8);
    if (isNaN(result)) {
      throw new Error('Invalid octal number');
    }
    return result;
  }

  static hexToDecimal(hex: string): number {
    const result = parseInt(hex, 16);
    if (isNaN(result)) {
      throw new Error('Invalid hexadecimal number');
    }
    return result;
  }

  static convertNumberBase(value: string, fromBase: number, toBase: number): string {
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) {
        throw new Error(`Invalid ${this.getBaseLabel(fromBase)} number`);
      }
      return decimal.toString(toBase).toUpperCase();
    } catch (error) {
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static getBaseLabel(base: number): string {
    switch (base) {
      case 2: return 'binary';
      case 8: return 'octal';
      case 10: return 'decimal';
      case 16: return 'hexadecimal';
      default: return `base-${base}`;
    }
  }

  static validateNumberForBase(value: string, base: number): boolean {
    try {
      const decimal = parseInt(value, base);
      return !isNaN(decimal);
    } catch {
      return false;
    }
  }

  /**
   * JSON to XML conversion
   */
  static jsonToXml(jsonString: string, rootElement: string = 'root'): string {
    try {
      const obj = JSON.parse(jsonString);
      return this.objectToXml(obj, rootElement);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static objectToXml(obj: any, rootName: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += this.convertObjectToXmlString(obj, rootName);
    return xml;
  }

  private static convertObjectToXmlString(obj: any, tagName: string): string {
    if (obj === null || obj === undefined) {
      return `<${tagName} />`;
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return `<${tagName}>${this.escapeXml(String(obj))}</${tagName}>`;
    }

    if (Array.isArray(obj)) {
      let xml = '';
      obj.forEach((item, index) => {
        xml += this.convertObjectToXmlString(item, `${tagName}_${index}`);
      });
      return xml;
    }

    if (typeof obj === 'object') {
      let xml = `<${tagName}>`;
      Object.entries(obj).forEach(([key, value]) => {
        xml += this.convertObjectToXmlString(value, key);
      });
      xml += `</${tagName}>`;
      return xml;
    }

    return `<${tagName}>${this.escapeXml(String(obj))}</${tagName}>`;
  }

  private static escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  static xmlToJson(xmlString: string): string {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML format');
      }

      const result = this.xmlNodeToObject(xmlDoc.documentElement);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(`XML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static xmlNodeToObject(node: Element): any {
    const result: any = {};

    // Handle attributes
    if (node.attributes.length > 0) {
      result['@attributes'] = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result['@attributes'][attr.name] = attr.value;
      }
    }

    // Handle child nodes
    if (node.children.length === 0) {
      // Leaf node
      const textContent = node.textContent?.trim();
      if (textContent) {
        return Object.keys(result).length > 0 ? { ...result, '#text': textContent } : textContent;
      }
      return Object.keys(result).length > 0 ? result : null;
    }

    // Group children by tag name
    const children: { [key: string]: any[] } = {};
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const tagName = child.tagName;
      if (!children[tagName]) {
        children[tagName] = [];
      }
      children[tagName].push(this.xmlNodeToObject(child));
    }

    // Convert grouped children to result
    Object.entries(children).forEach(([tagName, childArray]) => {
      if (childArray.length === 1) {
        result[tagName] = childArray[0];
      } else {
        result[tagName] = childArray;
      }
    });

    return result;
  }
}
