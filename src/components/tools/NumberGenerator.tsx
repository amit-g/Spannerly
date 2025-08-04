import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { ContentCopy, Clear, Casino, Refresh, TrendingUp } from '@mui/icons-material';
import { RandomGeneratorsService, NumberOptions, NumberResult } from '../../services/randomGeneratorsService';

const NumberGenerator: React.FC = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [quantity, setQuantity] = useState(10);
  const [allowDecimals, setAllowDecimals] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [allowNegative, setAllowNegative] = useState(true);
  const [result, setResult] = useState<NumberResult | null>(null);
  const [error, setError] = useState<string>('');

  const presets = [
    { label: 'Dice (1-6)', min: 1, max: 6, quantity: 6, decimals: false },
    { label: 'Percentage (0-100)', min: 0, max: 100, quantity: 10, decimals: true },
    { label: 'Lottery (1-49)', min: 1, max: 49, quantity: 6, decimals: false },
    { label: 'Random IDs (1000-9999)', min: 1000, max: 9999, quantity: 5, decimals: false },
    { label: 'Scores (0-10)', min: 0, max: 10, quantity: 10, decimals: true },
  ];

  const commonQuantities = [5, 10, 20, 50, 100];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      const rangeValidation = RandomGeneratorsService.validateNumberRange(min, max);
      if (!rangeValidation.isValid) {
        setError(rangeValidation.errors.join(', '));
        return;
      }

      const quantityValidation = RandomGeneratorsService.validateQuantity(quantity, 1000);
      if (!quantityValidation.isValid) {
        setError(quantityValidation.errors.join(', '));
        return;
      }

      const options: NumberOptions = {
        min,
        max,
        quantity,
        allowDecimals,
        decimalPlaces: allowDecimals ? decimalPlaces : undefined,
        allowNegative,
      };
      
      const generateResult = RandomGeneratorsService.generateNumbers(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [min, max, quantity, allowDecimals, decimalPlaces, allowNegative]);

  const handleCopyAll = useCallback(async () => {
    if (result?.numbers) {
      try {
        const allNumbers = result.numbers.join('\n');
        await navigator.clipboard.writeText(allNumbers);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleCopyNumber = useCallback(async (number: number) => {
    try {
      await navigator.clipboard.writeText(number.toString());
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handlePreset = useCallback((preset: typeof presets[0]) => {
    setMin(preset.min);
    setMax(preset.max);
    setQuantity(preset.quantity);
    setAllowDecimals(preset.decimals);
  }, []);

  const getStats = (numbers: number[]) => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const avg = sum / numbers.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
    
    return {
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      sum: sum,
      average: Number(avg.toFixed(2)),
      median: Number(median.toFixed(2)),
    };
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Random Number Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate random numbers within a specified range. Perfect for simulations, testing, games, and statistical analysis.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Number Range & Options</Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Value"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Value"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 1000 }}
                helperText="How many numbers to generate (max 1000)"
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>Quick Quantities:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {commonQuantities.map((qty) => (
                  <Chip
                    key={qty}
                    label={qty.toString()}
                    onClick={() => setQuantity(qty)}
                    variant={quantity === qty ? "filled" : "outlined"}
                    size="small"
                  />
                ))}
              </Stack>

              <Typography variant="h6" gutterBottom>Number Format</Typography>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowDecimals}
                      onChange={(e) => setAllowDecimals(e.target.checked)}
                    />
                  }
                  label="Allow decimal numbers"
                />
                
                {allowDecimals && (
                  <TextField
                    type="number"
                    label="Decimal Places"
                    value={decimalPlaces}
                    onChange={(e) => setDecimalPlaces(Math.max(1, Math.min(10, parseInt(e.target.value) || 2)))}
                    inputProps={{ min: 1, max: 10 }}
                    size="small"
                    sx={{ maxWidth: 200 }}
                  />
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowNegative}
                      onChange={(e) => setAllowNegative(e.target.checked)}
                    />
                  }
                  label="Allow negative numbers"
                />
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={<Casino />}
                >
                  Generate Numbers
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleGenerate}
                  startIcon={<Refresh />}
                >
                  Regenerate
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<Clear />}
                >
                  Clear
                </Button>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Generated Numbers:</Typography>
                    <Button
                      size="small"
                      onClick={handleCopyAll}
                      startIcon={<ContentCopy />}
                    >
                      Copy All
                    </Button>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip 
                      label={`Range: ${result.min} to ${result.max}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Count: ${result.quantity}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Average: ${result.average}`} 
                      size="small" 
                      variant="outlined" 
                      icon={<TrendingUp />}
                    />
                  </Stack>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Statistics:</Typography>
                      {(() => {
                        const stats = getStats(result.numbers);
                        return (
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Min</Typography>
                              <Typography variant="h6">{stats.min}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Max</Typography>
                              <Typography variant="h6">{stats.max}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Average</Typography>
                              <Typography variant="h6">{stats.average}</Typography>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">Median</Typography>
                              <Typography variant="h6">{stats.median}</Typography>
                            </Grid>
                          </Grid>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  <Card variant="outlined">
                    <CardContent>
                      <List dense>
                        {result.numbers.map((number, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 0.5,
                              borderBottom: index < result.numbers.length - 1 ? '1px solid #eee' : 'none'
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                                  {number}
                                </Typography>
                              }
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleCopyNumber(number)}
                              title="Copy number"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Presets</Typography>
              <Stack spacing={1}>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handlePreset(preset)}
                    sx={{ 
                      textAlign: 'left', 
                      justifyContent: 'flex-start',
                      textTransform: 'none'
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {preset.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {preset.min} to {preset.max}, {preset.quantity} numbers
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Use Cases</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Game development (dice, random events)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Statistical sampling and analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Testing and simulation data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Lottery and prize draw numbers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumberGenerator;
