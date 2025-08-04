// Currency Service for real-time exchange rates
// Uses fawazahmed0/exchange-api - Free API with 200+ currencies, no rate limits

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

export interface CurrencyApiResponse {
  date: string;
  [currencyCode: string]: any;
}

export interface AvailableCurrencies {
  [code: string]: string;
}

export class CurrencyService {
  private static instance: CurrencyService | null = null;
  private cache: Map<string, { data: CurrencyApiResponse; timestamp: number }> = new Map();
  private availableCurrencies: AvailableCurrencies | null = null;
  
  // Cache duration: 1 hour (3600000 ms)
  private readonly CACHE_DURATION = 3600000;
  
  // API endpoints with fallback
  private readonly PRIMARY_API = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';
  private readonly FALLBACK_API = 'https://latest.currency-api.pages.dev/v1';

  private constructor() {}

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Fetch data with fallback mechanism
   */
  private async fetchWithFallback(endpoint: string): Promise<any> {
    const urls = [
      `${this.PRIMARY_API}${endpoint}`,
      `${this.FALLBACK_API}${endpoint}`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn(`Failed to fetch from ${url}:`, error);
        // Continue to next URL
      }
    }
    
    throw new Error('All API endpoints failed');
  }

  /**
   * Get available currencies list
   */
  public async getAvailableCurrencies(): Promise<AvailableCurrencies> {
    if (this.availableCurrencies) {
      return this.availableCurrencies;
    }

    try {
      this.availableCurrencies = await this.fetchWithFallback('/currencies.min.json');
      return this.availableCurrencies!;
    } catch (error) {
      console.error('Failed to fetch available currencies:', error);
      // Return fallback currencies
      return this.getFallbackCurrencies();
    }
  }

  /**
   * Get exchange rates for a base currency
   */
  public async getExchangeRates(baseCurrency: string = 'usd'): Promise<CurrencyApiResponse> {
    const cacheKey = baseCurrency.toLowerCase();
    const now = Date.now();
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const endpoint = `/currencies/${baseCurrency.toLowerCase()}.min.json`;
      const data = await this.fetchWithFallback(endpoint);
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: now });
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch exchange rates for ${baseCurrency}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cached data');
        return cached.data;
      }
      
      // Fallback to static rates
      return this.getFallbackRates(baseCurrency);
    }
  }

  /**
   * Convert amount between currencies
   */
  public async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency.toLowerCase() === toCurrency.toLowerCase()) {
      return amount;
    }

    try {
      const rates = await this.getExchangeRates(fromCurrency);
      
      // The API response structure is: { date: "2023-xx-xx", [baseCurrency]: { [targetCurrency]: rate } }
      const baseCurrencyKey = fromCurrency.toLowerCase();
      const targetCurrencyKey = toCurrency.toLowerCase();
      
      // Get the rates object for the base currency
      const currencyRates = rates[baseCurrencyKey];
      
      if (!currencyRates) {
        throw new Error(`Exchange rates not available for base currency ${fromCurrency}`);
      }
      
      const targetRate = currencyRates[targetCurrencyKey];
      
      if (targetRate === undefined) {
        throw new Error(`Exchange rate not found for ${toCurrency}`);
      }
      
      return amount * targetRate;
    } catch (error) {
      console.error('Currency conversion failed:', error);
      throw error;
    }
  }

  /**
   * Get exchange rate between two currencies
   */
  public async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      return await this.convert(1, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      throw error;
    }
  }

  /**
   * Clear cache (useful for manual refresh)
   */
  public clearCache(): void {
    this.cache.clear();
    this.availableCurrencies = null;
  }

  /**
   * Get popular currencies with real-time rates
   */
  public async getPopularCurrenciesWithRates(): Promise<CurrencyRate[]> {
    const popularCodes = [
      'usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'inr', 'cny', 
      'chf', 'krw', 'sgd', 'hkd', 'nzd', 'sek', 'nok', 'mxn',
      'zar', 'brl', 'rub', 'try'
    ];

    try {
      const [availableCurrencies, usdRates] = await Promise.all([
        this.getAvailableCurrencies(),
        this.getExchangeRates('usd')
      ]);

      // The API structure is: { date: "2023-xx-xx", usd: { eur: 0.85, gbp: 0.73, ... } }
      const usdCurrencyRates = usdRates.usd || {};

      return popularCodes
        .filter(code => availableCurrencies[code])
        .map(code => ({
          code: code.toUpperCase(),
          name: availableCurrencies[code],
          rate: code === 'usd' ? 1 : (usdCurrencyRates[code] || 1)
        }));
    } catch (error) {
      console.error('Failed to get popular currencies:', error);
      return this.getFallbackCurrencyRates();
    }
  }

  /**
   * Fallback currencies when API fails
   */
  private getFallbackCurrencies(): AvailableCurrencies {
    return {
      'usd': 'US Dollar',
      'eur': 'Euro',
      'gbp': 'British Pound Sterling',
      'jpy': 'Japanese Yen',
      'cad': 'Canadian Dollar',
      'aud': 'Australian Dollar',
      'chf': 'Swiss Franc',
      'cny': 'Chinese Yuan',
      'inr': 'Indian Rupee',
      'krw': 'South Korean Won',
      'sgd': 'Singapore Dollar',
      'hkd': 'Hong Kong Dollar',
      'nzd': 'New Zealand Dollar',
      'sek': 'Swedish Krona',
      'nok': 'Norwegian Krone',
      'mxn': 'Mexican Peso',
      'zar': 'South African Rand',
      'brl': 'Brazilian Real',
      'rub': 'Russian Ruble',
      'try': 'Turkish Lira'
    };
  }

  /**
   * Fallback exchange rates when API fails
   */
  private getFallbackRates(baseCurrency: string): CurrencyApiResponse {
    const staticRates: { [key: string]: any } = {
      'usd': {
        'eur': 0.85, 'gbp': 0.73, 'jpy': 110, 'cad': 1.25, 'aud': 1.35,
        'chf': 0.92, 'cny': 6.45, 'inr': 74.5, 'krw': 1180, 'sgd': 1.35,
        'hkd': 7.8, 'nzd': 1.42, 'sek': 8.6, 'nok': 8.5, 'mxn': 20.1,
        'zar': 14.8, 'brl': 5.2, 'rub': 73.5, 'try': 8.4
      }
    };

    const baseCurrencyKey = baseCurrency.toLowerCase();
    
    return {
      date: new Date().toISOString().split('T')[0],
      [baseCurrencyKey]: staticRates[baseCurrencyKey] || {}
    };
  }

  /**
   * Fallback currency rates
   */
  private getFallbackCurrencyRates(): CurrencyRate[] {
    return [
      { code: 'USD', name: 'US Dollar', rate: 1 },
      { code: 'EUR', name: 'Euro', rate: 0.85 },
      { code: 'GBP', name: 'British Pound Sterling', rate: 0.73 },
      { code: 'JPY', name: 'Japanese Yen', rate: 110 },
      { code: 'CAD', name: 'Canadian Dollar', rate: 1.25 },
      { code: 'AUD', name: 'Australian Dollar', rate: 1.35 },
      { code: 'CHF', name: 'Swiss Franc', rate: 0.92 },
      { code: 'CNY', name: 'Chinese Yuan', rate: 6.45 },
      { code: 'INR', name: 'Indian Rupee', rate: 74.5 },
      { code: 'KRW', name: 'South Korean Won', rate: 1180 },
      { code: 'SGD', name: 'Singapore Dollar', rate: 1.35 },
      { code: 'HKD', name: 'Hong Kong Dollar', rate: 7.8 },
      { code: 'NZD', name: 'New Zealand Dollar', rate: 1.42 },
      { code: 'SEK', name: 'Swedish Krona', rate: 8.6 },
      { code: 'NOK', name: 'Norwegian Krone', rate: 8.5 },
      { code: 'MXN', name: 'Mexican Peso', rate: 20.1 },
      { code: 'ZAR', name: 'South African Rand', rate: 14.8 },
      { code: 'BRL', name: 'Brazilian Real', rate: 5.2 },
      { code: 'RUB', name: 'Russian Ruble', rate: 73.5 },
      { code: 'TRY', name: 'Turkish Lira', rate: 8.4 }
    ];
  }
}
