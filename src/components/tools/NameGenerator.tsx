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
} from '@mui/material';
import { ContentCopy, Clear, Person, Refresh, Business } from '@mui/icons-material';
import { RandomGeneratorsService, NameOptions, NameResult } from '../../services/randomGeneratorsService';

const NameGenerator: React.FC = () => {
  const [type, setType] = useState<NameOptions['type']>('full');
  const [quantity, setQuantity] = useState(10);
  const [gender, setGender] = useState<NameOptions['gender']>('any');
  const [result, setResult] = useState<NameResult | null>(null);
  const [error, setError] = useState<string>('');

  const nameTypes: Array<{ value: NameOptions['type']; label: string; description: string; icon: React.ReactNode }> = [
    { value: 'first', label: 'First Names', description: 'Generate first names only', icon: <Person /> },
    { value: 'last', label: 'Last Names', description: 'Generate last names only', icon: <Person /> },
    { value: 'full', label: 'Full Names', description: 'Generate complete names', icon: <Person /> },
    { value: 'username', label: 'Usernames', description: 'Generate username combinations', icon: <Person /> },
    { value: 'company', label: 'Company Names', description: 'Generate business names', icon: <Business /> },
  ];

  const genderOptions: Array<{ value: NameOptions['gender']; label: string }> = [
    { value: 'any', label: 'Any Gender' },
    { value: 'male', label: 'Male Names' },
    { value: 'female', label: 'Female Names' },
  ];

  const commonQuantities = [5, 10, 20, 50, 100];

  const presets = [
    { label: 'Character Names', type: 'full', quantity: 5, gender: 'any' },
    { label: 'User Accounts', type: 'username', quantity: 10, gender: 'any' },
    { label: 'Company List', type: 'company', quantity: 8, gender: 'any' },
    { label: 'Contact List', type: 'full', quantity: 15, gender: 'any' },
    { label: 'Team Names', type: 'first', quantity: 12, gender: 'any' },
  ];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      const quantityValidation = RandomGeneratorsService.validateQuantity(quantity, 200);
      if (!quantityValidation.isValid) {
        setError(quantityValidation.errors.join(', '));
        return;
      }

      const options: NameOptions = {
        type,
        quantity,
        gender: type === 'company' ? undefined : gender,
      };
      
      const generateResult = RandomGeneratorsService.generateNames(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [type, quantity, gender]);

  const handleCopyAll = useCallback(async () => {
    if (result?.names) {
      try {
        const allNames = result.names.join('\n');
        await navigator.clipboard.writeText(allNames);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleCopyName = useCallback(async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handlePreset = useCallback((preset: typeof presets[0]) => {
    setType(preset.type as NameOptions['type']);
    setQuantity(preset.quantity);
    setGender(preset.gender as NameOptions['gender']);
  }, []);

  const selectedType = nameTypes.find(t => t.value === type);
  const showGenderOption = type !== 'company' && type !== 'username';

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Name Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate random names for characters, users, companies, and more. Perfect for testing, creative writing, and mock data.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Generation Options</Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Name Type</InputLabel>
                    <Select
                      value={type}
                      label="Name Type"
                      onChange={(e) => setType(e.target.value as NameOptions['type'])}
                    >
                      {nameTypes.map((nameType) => (
                        <MenuItem key={nameType.value} value={nameType.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {nameType.icon}
                            <Box>
                              <Typography variant="body1">{nameType.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {nameType.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 200 }}
                    helperText="How many names to generate (max 200)"
                  />
                </Grid>
              </Grid>

              {showGenderOption && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    label="Gender"
                    onChange={(e) => setGender(e.target.value as NameOptions['gender'])}
                  >
                    {genderOptions.map((genderOption) => (
                      <MenuItem key={genderOption.value} value={genderOption.value}>
                        {genderOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

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

              {selectedType && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{selectedType.label}:</strong> {selectedType.description}
                  </Typography>
                </Alert>
              )}

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={selectedType?.icon}
                >
                  Generate Names
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
                    <Typography variant="h6">Generated Names:</Typography>
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
                      label={`Type: ${result.type}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Count: ${result.quantity}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    {showGenderOption && (
                      <Chip 
                        label={`Gender: ${gender}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Stack>

                  <Card variant="outlined">
                    <CardContent>
                      <List dense>
                        {result.names.map((name, index) => (
                          <ListItem 
                            key={index}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 1,
                              borderBottom: index < result.names.length - 1 ? '1px solid #eee' : 'none'
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                  {name}
                                </Typography>
                              }
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleCopyName(name)}
                              title="Copy name"
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
                        {preset.quantity} {preset.type} names
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
                • Database testing and seeding
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Creative writing and character development
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • User interface mockups and prototypes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Sample data for applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Gaming and role-playing scenarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NameGenerator;
