import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Slider,
} from '@mui/material';
import { ContentCopy, Clear, TextFormat, Refresh } from '@mui/icons-material';
import { RandomGeneratorsService, RandomStringOptions, RandomStringResult } from '../../services/randomGeneratorsService';

const StringGenerator: React.FC = () => {
  const [length, setLength] = useState(8);
  const [charset, setCharset] = useState<RandomStringOptions['charset']>('alphanumeric');
  const [customCharset, setCustomCharset] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [result, setResult] = useState<RandomStringResult | null>(null);
  const [error, setError] = useState<string>('');

  const charsets: Array<{ value: RandomStringOptions['charset']; label: string; description: string; example: string }> = [
    { value: 'alphanumeric', label: 'Alphanumeric', description: 'Letters and numbers', example: 'A1b2C3d4' },
    { value: 'alphabetic', label: 'Alphabetic', description: 'Letters only', example: 'AbCdEfGh' },
    { value: 'numeric', label: 'Numeric', description: 'Numbers only', example: '12345678' },
    { value: 'lowercase', label: 'Lowercase', description: 'Lowercase letters', example: 'abcdefgh' },
    { value: 'uppercase', label: 'Uppercase', description: 'Uppercase letters', example: 'ABCDEFGH' },
    { value: 'custom', label: 'Custom', description: 'Your own character set', example: 'Custom...' },
  ];

  const presets = [
    { label: 'User IDs (8 chars)', length: 8, charset: 'alphanumeric', quantity: 10 },
    { label: 'Session Tokens (16 chars)', length: 16, charset: 'alphanumeric', quantity: 5 },
    { label: 'API Keys (32 chars)', length: 32, charset: 'alphanumeric', quantity: 3 },
    { label: 'Short Codes (6 chars)', length: 6, charset: 'uppercase', quantity: 20 },
    { label: 'PIN Codes (4 digits)', length: 4, charset: 'numeric', quantity: 25 },
    { label: 'Filenames (12 chars)', length: 12, charset: 'lowercase', quantity: 15 },
  ];

  const useCases = [
    { title: 'Database Testing', description: 'Generate sample data for testing' },
    { title: 'API Development', description: 'Create test tokens and identifiers' },
    { title: 'User Account IDs', description: 'Generate unique user identifiers' },
    { title: 'File Naming', description: 'Create random filenames' },
    { title: 'Game Development', description: 'Generate random game codes' },
    { title: 'Security Testing', description: 'Create test strings for validation' },
  ];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      if (length < 1 || length > 256) {
        setError('String length must be between 1 and 256 characters');
        return;
      }

      const quantityValidation = RandomGeneratorsService.validateQuantity(quantity, 1000);
      if (!quantityValidation.isValid) {
        setError(quantityValidation.errors.join(', '));
        return;
      }

      if (charset === 'custom' && !customCharset.trim()) {
        setError('Custom character set cannot be empty');
        return;
      }

      const options: RandomStringOptions = {
        length,
        charset,
        customCharset: charset === 'custom' ? customCharset : undefined,
        quantity,
        prefix: prefix || undefined,
        suffix: suffix || undefined,
      };
      
      const generateResult = RandomGeneratorsService.generateRandomStrings(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [length, charset, customCharset, quantity, prefix, suffix]);

  const handleCopyAll = useCallback(async () => {
    if (result?.strings) {
      try {
        const allStrings = result.strings.join('\n');
        await navigator.clipboard.writeText(allStrings);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleCopyString = useCallback(async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handlePreset = useCallback((preset: typeof presets[0]) => {
    setLength(preset.length);
    setCharset(preset.charset as RandomStringOptions['charset']);
    setQuantity(preset.quantity);
  }, []);

  const selectedCharset = charsets.find(c => c.value === charset);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Random String Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate random strings for testing, unique identifiers, codes, and more. Customize character sets and length.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>String Configuration</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Length: {length}</Typography>
                <Slider
                  value={length}
                  onChange={(_, newValue) => setLength(newValue as number)}
                  min={1}
                  max={64}
                  step={1}
                  marks={[
                    { value: 4, label: '4' },
                    { value: 8, label: '8' },
                    { value: 16, label: '16' },
                    { value: 32, label: '32' },
                    { value: 64, label: '64' },
                  ]}
                />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Character Set</InputLabel>
                <Select
                  value={charset}
                  label="Character Set"
                  onChange={(e) => setCharset(e.target.value as RandomStringOptions['charset'])}
                >
                  {charsets.map((charsetOption) => (
                    <MenuItem key={charsetOption.value} value={charsetOption.value}>
                      <Box>
                        <Typography variant="body1">{charsetOption.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {charsetOption.description} - {charsetOption.example}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {charset === 'custom' && (
                <TextField
                  fullWidth
                  label="Custom Character Set"
                  value={customCharset}
                  onChange={(e) => setCustomCharset(e.target.value)}
                  placeholder="Enter characters to use (e.g., ABC123!@#)"
                  sx={{ mb: 2 }}
                  helperText="Define your own set of characters to use"
                />
              )}

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prefix (optional)"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g., 'ID_'"
                    helperText="Text to add before each string"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Suffix (optional)"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="e.g., '_2024'"
                    helperText="Text to add after each string"
                  />
                </Grid>
              </Grid>

              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 1000 }}
                sx={{ mb: 3, maxWidth: 200 }}
                helperText="Number of strings to generate"
              />

              {selectedCharset && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{selectedCharset.label}:</strong> {selectedCharset.description}
                    <br />
                    <code>Example: {selectedCharset.example}</code>
                  </Typography>
                </Alert>
              )}

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={<TextFormat />}
                >
                  Generate Strings
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
                    <Typography variant="h6">Generated Strings:</Typography>
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
                      label={`Length: ${result.length} chars`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Charset: ${result.charset}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Count: ${result.quantity}`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Stack>

                  <Card variant="outlined">
                    <CardContent>
                      <List dense>
                        {result.strings.map((str, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 0.5,
                              borderBottom: index < result.strings.length - 1 ? '1px solid #eee' : 'none'
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                                  {str}
                                </Typography>
                              }
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleCopyString(str)}
                              title="Copy string"
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
                        {preset.quantity} strings
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
              {useCases.map((useCase, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {useCase.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {useCase.description}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StringGenerator;
