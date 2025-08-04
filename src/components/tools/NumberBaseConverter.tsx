import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { ContentCopy, Clear, Numbers, SwapHoriz } from '@mui/icons-material';
import { ConverterService } from '../../services/converterService';

const NumberBaseConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [results, setResults] = useState<{ base: number; value: string; label: string }[]>([]);
  const [error, setError] = useState<string>('');

  const bases = [
    { value: 2, label: 'Binary (Base 2)', chars: '01' },
    { value: 8, label: 'Octal (Base 8)', chars: '01234567' },
    { value: 10, label: 'Decimal (Base 10)', chars: '0123456789' },
    { value: 16, label: 'Hexadecimal (Base 16)', chars: '0123456789ABCDEF' },
  ];

  const examples = [
    { value: '255', base: 10, description: 'Common decimal number' },
    { value: '11111111', base: 2, description: '8-bit binary number' },
    { value: 'FF', base: 16, description: 'Hexadecimal representation' },
    { value: '377', base: 8, description: 'Octal representation' },
    { value: '1024', base: 10, description: 'Power of 2' },
    { value: '400', base: 16, description: 'Hex number' },
  ];

  const handleConvert = useCallback(() => {
    try {
      setError('');
      
      if (!input.trim()) {
        setResults([]);
        return;
      }

      // Validate input for the selected base
      if (!ConverterService.validateNumberForBase(input, fromBase)) {
        setError(`Invalid ${ConverterService.getBaseLabel(fromBase)} number`);
        setResults([]);
        return;
      }

      // Convert to all bases
      const allResults: { base: number; value: string; label: string }[] = [];
      
      bases.forEach(base => {
        try {
          const convertedValue = ConverterService.convertNumberBase(input, fromBase, base.value);
          allResults.push({
            base: base.value,
            value: convertedValue,
            label: base.label
          });
        } catch (err) {
          console.warn(`Failed to convert to base ${base.value}:`, err);
        }
      });

      setResults(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setResults([]);
    }
  }, [input, fromBase]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setResults([]);
    setError('');
  }, []);

  const handleSwapBases = useCallback(() => {
    setFromBase(toBase);
    setToBase(fromBase);
    
    // If we have a result for the target base, use it as new input
    const targetResult = results.find(result => result.base === toBase);
    if (targetResult) {
      setInput(targetResult.value);
    }
  }, [fromBase, toBase, results]);

  const handleExampleClick = useCallback((example: typeof examples[0]) => {
    setInput(example.value);
    setFromBase(example.base);
    setError('');
  }, []);

  const getNumberInfo = useCallback(() => {
    if (!input || results.length === 0) return null;

    try {
      const decimal = ConverterService.convertNumberBase(input, fromBase, 10);
      const decimalValue = parseInt(decimal, 10);
      
      return {
        decimal: decimalValue,
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hex: decimalValue.toString(16).toUpperCase(),
        bits: Math.ceil(Math.log2(decimalValue + 1)),
        bytes: Math.ceil(Math.ceil(Math.log2(decimalValue + 1)) / 8)
      };
    } catch {
      return null;
    }
  }, [input, fromBase, results]);

  const numberInfo = getNumberInfo();

  // Auto-convert when input or fromBase changes
  useEffect(() => {
    if (input) {
      handleConvert();
    } else {
      setResults([]);
      setError('');
    }
  }, [input, fromBase, handleConvert]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Number Base Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert numbers between different bases: binary, octal, decimal, and hexadecimal.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Convert Number</Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>From Base</InputLabel>
                    <Select
                      value={fromBase}
                      label="From Base"
                      onChange={(e) => setFromBase(e.target.value as number)}
                    >
                      {bases.map((base) => (
                        <MenuItem key={base.value} value={base.value}>
                          {base.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton onClick={handleSwapBases} title="Swap bases">
                    <SwapHoriz />
                  </IconButton>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>To Base</InputLabel>
                    <Select
                      value={toBase}
                      label="To Base"
                      onChange={(e) => setToBase(e.target.value as number)}
                    >
                      {bases.map((base) => (
                        <MenuItem key={base.value} value={base.value}>
                          {base.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label={`Enter ${ConverterService.getBaseLabel(fromBase)} number`}
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder={`Enter a ${ConverterService.getBaseLabel(fromBase)} number...`}
                sx={{ mb: 2 }}
                helperText={
                  fromBase === 2 ? 'Use only 0 and 1' :
                  fromBase === 8 ? 'Use digits 0-7' :
                  fromBase === 10 ? 'Use digits 0-9' :
                  fromBase === 16 ? 'Use digits 0-9 and letters A-F' : ''
                }
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleConvert}
                  startIcon={<Numbers />}
                >
                  Convert
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

              {results.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Conversion Results:</Typography>
                  <Grid container spacing={2}>
                    {results.map((result) => (
                      <Grid item xs={12} sm={6} key={result.base}>
                        <Paper sx={{ p: 2, border: result.base === toBase ? '2px solid' : '1px solid', borderColor: result.base === toBase ? 'primary.main' : 'divider' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {result.label}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(result.value)}
                              title="Copy value"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: 'monospace',
                              wordBreak: 'break-all',
                              color: result.base === toBase ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {result.value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {numberInfo && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Number Information:</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Decimal Value:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{numberInfo.decimal.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Bits Required:</Typography>
                        <Typography variant="body1">{numberInfo.bits} bits</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Bytes Required:</Typography>
                        <Typography variant="body1">{numberInfo.bytes} bytes</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">Binary Length:</Typography>
                        <Typography variant="body1">{numberInfo.binary.length} digits</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Number Base Reference</Typography>
              <List dense>
                {bases.map((base) => (
                  <ListItem key={base.value}>
                    <ListItemText
                      primary={base.label}
                      secondary={`Characters: ${base.chars}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Examples</Typography>
              <Stack spacing={1}>
                {examples.map((example, index) => (
                  <Box key={index}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleExampleClick(example)}
                      sx={{ 
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        width: '100%',
                        mb: 0.5
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {example.value} (Base {example.base})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {example.description}
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>Quick Tips:</strong>
                  <br />
                  • Binary: Powers of 2 (1, 2, 4, 8, 16...)
                  <br />
                  • Octal: Each digit represents 3 binary digits
                  <br />
                  • Hex: Each digit represents 4 binary digits
                  <br />
                  • Use A-F for hex digits 10-15
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NumberBaseConverter;
