export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  subcategory?: string;
  capabilities: string[];
  icon: string;
  component: string;
}

export enum ToolCategory {
  CALCULATORS = 'calculators',
  UNIT_CONVERTERS = 'unit-converters',
  CONVERTERS = 'converters',
  VALIDATORS = 'validators',
  BEAUTIFIERS = 'beautifiers',
  MINIFIERS = 'minifiers',
  CRYPTOGRAPHY = 'cryptography',
  RANDOM_GENERATORS = 'random-generators',
  STRING_UTILITIES = 'string-utilities',
  MISCELLANEOUS = 'miscellaneous',
}

export const ToolSubcategories = {
  [ToolCategory.CALCULATORS]: ['Financial', 'Basic Math', 'Scientific'],
  [ToolCategory.UNIT_CONVERTERS]: ['Length', 'Temperature', 'Area', 'Volume', 'Weight', 'Time', 'Currency'],
  [ToolCategory.CONVERTERS]: [
    'Base64 Encode/Decode', 'Html Encode/Decode', 'Url Encode/Decode',
    'Encryption/Decryption', 'Json to/from XML', 'Json to/from CSV',
    'Decimal to/from Binary/Oct/Hex', 'Html to/from Markdown',
    'String Case', 'Base64 to/from image', 'QR Code Generation', 'Image Processing',
    'JSON Tools', 'Markdown Tools'
  ],
  [ToolCategory.VALIDATORS]: ['Json', 'Javascript', 'CSS'],
  [ToolCategory.BEAUTIFIERS]: ['Json', 'C#', 'SQL', 'CSS', 'Javascript', 'Typescript'],
  [ToolCategory.MINIFIERS]: ['Json', 'Javascript', 'CSS'],
  [ToolCategory.CRYPTOGRAPHY]: ['Encryption/Decryption', 'Hashcode Generators'],
  [ToolCategory.RANDOM_GENERATORS]: [
    'Digit', 'Number', 'Decimal', 'Character', 'String', 'Phrase',
    'Paragraph', 'Page', 'Image', 'Color', 'IP Address', 'DateTime', 'Name', 'Password',
    'Developer Tools'
  ],
  [ToolCategory.STRING_UTILITIES]: ['String Case', 'Reverse string', 'Count word', 'Regex Tools'],
  [ToolCategory.MISCELLANEOUS]: ['Remove duplicate whitespace', 'Remove empty lines', 'ASCII Art', 'Time Scheduling', 'Design Tools'],
};

export interface ToolState {
  selectedCategory: ToolCategory | null;
  searchQuery: string;
  tools: Tool[];
}

export interface ThemeState {
  mode: 'light' | 'dark';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface AppState {
  tools: ToolState;
  theme: ThemeState;
}
