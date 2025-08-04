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
  Slider,
  LinearProgress,
} from '@mui/material';
import { ContentCopy, Clear, Security, Refresh, Visibility, VisibilityOff } from '@mui/icons-material';
import { RandomGeneratorsService, PasswordOptions, PasswordResult } from '../../services/randomGeneratorsService';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customCharacters, setCustomCharacters] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showPasswords, setShowPasswords] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [error, setError] = useState<string>('');

  const strengthColors = {
    'Weak': 'error',
    'Fair': 'warning',
    'Good': 'info',
    'Strong': 'success',
    'Very Strong': 'success',
  } as const;

  const strengthValues = {
    'Weak': 20,
    'Fair': 40,
    'Good': 60,
    'Strong': 80,
    'Very Strong': 100,
  };

  const presets = [
    { label: 'Basic (8 chars)', length: 8, upper: true, lower: true, numbers: true, symbols: false },
    { label: 'Standard (12 chars)', length: 12, upper: true, lower: true, numbers: true, symbols: true },
    { label: 'Strong (16 chars)', length: 16, upper: true, lower: true, numbers: true, symbols: true },
    { label: 'Ultra (24 chars)', length: 24, upper: true, lower: true, numbers: true, symbols: true },
    { label: 'PIN (4 digits)', length: 4, upper: false, lower: false, numbers: true, symbols: false },
    { label: 'WiFi Key (32 chars)', length: 32, upper: true, lower: true, numbers: true, symbols: false },
  ];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      if (length < 1 || length > 128) {
        setError('Password length must be between 1 and 128 characters');
        return;
      }

      if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols && !customCharacters) {
        setError('At least one character type must be selected');
        return;
      }

      const quantityValidation = RandomGeneratorsService.validateQuantity(quantity, 50);
      if (!quantityValidation.isValid) {
        setError(quantityValidation.errors.join(', '));
        return;
      }

      const options: PasswordOptions = {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
        excludeAmbiguous,
        customCharacters: customCharacters || undefined,
        quantity,
      };
      
      const generateResult = RandomGeneratorsService.generatePasswords(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, excludeAmbiguous, customCharacters, quantity]);

  const handleCopyAll = useCallback(async () => {
    if (result?.passwords) {
      try {
        const allPasswords = result.passwords.join('\n');
        await navigator.clipboard.writeText(allPasswords);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleCopyPassword = useCallback(async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
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
    setIncludeUppercase(preset.upper);
    setIncludeLowercase(preset.lower);
    setIncludeNumbers(preset.numbers);
    setIncludeSymbols(preset.symbols);
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Password Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate secure random passwords with customizable character sets and length. Perfect for creating strong, unique passwords.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Password Options</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Length: {length}</Typography>
                <Slider
                  value={length}
                  onChange={(_, newValue) => setLength(newValue as number)}
                  min={1}
                  max={128}
                  step={1}
                  marks={[
                    { value: 8, label: '8' },
                    { value: 16, label: '16' },
                    { value: 32, label: '32' },
                    { value: 64, label: '64' },
                    { value: 128, label: '128' },
                  ]}
                />
              </Box>

              <Typography variant="h6" gutterBottom>Character Sets</Typography>
              <Grid container spacing={1} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                      />
                    }
                    label="Uppercase letters (A-Z)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                      />
                    }
                    label="Lowercase letters (a-z)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                      />
                    }
                    label="Numbers (0-9)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                      />
                    }
                    label="Symbols (!@#$%^&*)"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Advanced Options</Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={excludeSimilar}
                      onChange={(e) => setExcludeSimilar(e.target.checked)}
                    />
                  }
                  label="Exclude similar characters (il1Lo0O)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={excludeAmbiguous}
                      onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    />
                  }
                  label="Exclude ambiguous characters ({}[]()/\\)"
                />
              </Stack>

              <TextField
                fullWidth
                label="Custom characters (optional)"
                value={customCharacters}
                onChange={(e) => setCustomCharacters(e.target.value)}
                placeholder="Add custom characters to include"
                sx={{ mb: 2 }}
                helperText="Additional characters to include in the password"
              />

              <TextField
                type="number"
                label="Number of passwords"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 50 }}
                sx={{ mb: 3, maxWidth: 200 }}
                helperText="Generate multiple passwords at once"
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={<Security />}
                >
                  Generate Passwords
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
                {result && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowPasswords(!showPasswords)}
                    startIcon={showPasswords ? <VisibilityOff /> : <Visibility />}
                  >
                    {showPasswords ? 'Hide' : 'Show'}
                  </Button>
                )}
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Generated Passwords:</Typography>
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
                      label={`Strength: ${result.strength}`} 
                      size="small" 
                      variant="outlined"
                      color={strengthColors[result.strength]}
                    />
                    <Chip 
                      label={`Entropy: ${result.entropy} bits`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Count: ${result.quantity}`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2">Password Strength:</Typography>
                      <Typography variant="body2" color={`${strengthColors[result.strength]}.main`}>
                        {result.strength}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={strengthValues[result.strength]}
                      color={strengthColors[result.strength]}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Card variant="outlined">
                    <CardContent>
                      <List dense>
                        {result.passwords.map((password, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1,
                              borderBottom: index < result.passwords.length - 1 ? '1px solid #eee' : 'none'
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontFamily: 'monospace', 
                                    fontSize: '1rem',
                                    filter: showPasswords ? 'none' : 'blur(4px)',
                                    transition: 'filter 0.2s ease',
                                    cursor: showPasswords ? 'default' : 'pointer'
                                  }}
                                  onClick={() => !showPasswords && setShowPasswords(true)}
                                >
                                  {password}
                                </Typography>
                              }
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleCopyPassword(password)}
                              title="Copy password"
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
                    {preset.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Security Tips</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use at least 12 characters for good security
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Include multiple character types
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use unique passwords for each account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Consider using a password manager
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasswordGenerator;
