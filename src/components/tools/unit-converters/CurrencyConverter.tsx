import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CurrencyService, CurrencyRate } from '../../../services';

// Exchange Rate Display Component
const ExchangeRateDisplay: React.FC<{
  fromCurrency: string;
  toCurrency: string;
  convertValue: (value: string, from: string, to: string) => Promise<string>;
}> = ({ fromCurrency, toCurrency, convertValue }) => {
  const [fromRate, setFromRate] = useState<string>('...');
  const [toRate, setToRate] = useState<string>('...');

  useEffect(() => {
    const updateRates = async () => {
      try {
        const [from, to] = await Promise.all([
          convertValue('1', fromCurrency, toCurrency),
          convertValue('1', toCurrency, fromCurrency)
        ]);
        setFromRate(from);
        setToRate(to);
      } catch (error) {
        setFromRate('Error');
        setToRate('Error');
      }
    };

    updateRates();
  }, [fromCurrency, toCurrency, convertValue]);

  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Exchange Rate
      </Typography>
      <Typography variant="body1">
        1 {fromCurrency} = {fromRate} {toCurrency}
      </Typography>
      <Typography variant="body1">
        1 {toCurrency} = {toRate} {fromCurrency}
      </Typography>
    </Box>
  );
};

export const CurrencyConverter: React.FC = () => {
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string>('');
  const [isRealTime, setIsRealTime] = useState<boolean>(true);
  
  // Get currency service instance
  const currencyService = CurrencyService.getInstance();

  // Load currencies on component mount
  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    setLoading(true);
    setError('');
    
    try {
      const popularCurrencies = await currencyService.getPopularCurrenciesWithRates();
      setCurrencies(popularCurrencies);
      setIsRealTime(true);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load currencies:', err);
      setError('Failed to load real-time rates. Using fallback data.');
      setIsRealTime(false);
    } finally {
      setLoading(false);
    }
  };

  const findCurrency = (code: string): CurrencyRate | undefined => {
    return currencies.find(currency => currency.code === code);
  };

  const convertValue = async (value: string, from: string, to: string): Promise<string> => {
    if (!value || isNaN(Number(value))) return '';
    
    const numValue = Number(value);
    
    try {
      if (isRealTime) {
        // Use real-time API conversion
        const convertedValue = await currencyService.convert(numValue, from, to);
        return Number(convertedValue.toFixed(4)).toString();
      } else {
        // Fallback to static rates
        const fromCurrencyData = findCurrency(from);
        const toCurrencyData = findCurrency(to);
        
        if (!fromCurrencyData || !toCurrencyData) return '';
        
        // Convert to USD first, then to target currency
        const usdValue = numValue / fromCurrencyData.rate;
        const convertedValue = usdValue * toCurrencyData.rate;
        
        return Number(convertedValue.toFixed(4)).toString();
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      setError('Conversion failed. Please try again.');
      return '';
    }
  };

  const handleFromValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFromValue(value);
    
    if (value && !isNaN(Number(value))) {
      const converted = await convertValue(value, fromCurrency, toCurrency);
      setToValue(converted);
    } else {
      setToValue('');
    }
  };

  const handleToValueChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setToValue(value);
    
    if (value && !isNaN(Number(value))) {
      const converted = await convertValue(value, toCurrency, fromCurrency);
      setFromValue(converted);
    } else {
      setFromValue('');
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleRefreshRates = async () => {
    setRefreshing(true);
    setError('');
    
    try {
      // Clear cache and reload currencies
      currencyService.clearCache();
      await loadCurrencies();
      
      // Re-convert current value with fresh rates
      if (fromValue && !isNaN(Number(fromValue))) {
        const converted = await convertValue(fromValue, fromCurrency, toCurrency);
        setToValue(converted);
      }
    } catch (err) {
      console.error('Failed to refresh rates:', err);
      setError('Failed to refresh rates. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Update conversion when currencies change
  useEffect(() => {
    const updateConversion = async () => {
      if (fromValue && !isNaN(Number(fromValue))) {
        const converted = await convertValue(fromValue, fromCurrency, toCurrency);
        setToValue(converted);
      }
    };
    
    updateConversion();
  }, [fromCurrency, toCurrency]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Currency Converter
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {!error && (
          <Alert severity={isRealTime ? "success" : "info"} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {isRealTime 
                  ? "✅ Using real-time exchange rates from fawazahmed0/exchange-api (200+ currencies, no rate limits)"
                  : "⚠️ Using fallback exchange rates for demonstration purposes"
                }
              </Typography>
              {isRealTime && (
                <Chip 
                  label="LIVE" 
                  color="success" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated.toLocaleString()}
          </Typography>
          <IconButton 
            onClick={handleRefreshRates} 
            disabled={loading || refreshing}
            color="primary"
            title="Refresh exchange rates"
          >
            {(loading || refreshing) ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
        </Box>

        <Grid container spacing={3} alignItems="center">
          {/* From Section */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                From
              </Typography>
              <TextField
                fullWidth
                label="Amount"
                value={fromValue}
                onChange={handleFromValueChange}
                type="number"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Currency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                variant="outlined"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          {/* Swap Button */}
          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleSwapCurrencies}
              color="primary"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <SwapHorizIcon />
            </IconButton>
          </Grid>

          {/* To Section */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                To
              </Typography>
              <TextField
                fullWidth
                label="Amount"
                value={toValue}
                onChange={handleToValueChange}
                type="number"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Currency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                variant="outlined"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>

        {/* Exchange Rate Info */}
        <ExchangeRateDisplay 
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          convertValue={convertValue}
        />

        <Divider sx={{ my: 3 }} />

        {/* Popular Currencies */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Popular Currencies
          </Typography>
          <Grid container spacing={2}>
            {currencies.slice(0, 8).map((currency) => (
              <Grid item xs={6} sm={4} md={3} key={currency.code}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    setFromCurrency(currency.code);
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {currency.code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currency.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </Box>
  );
};
