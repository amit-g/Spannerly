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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
} from '@mui/material';
import { ContentCopy, Clear, Refresh, Add } from '@mui/icons-material';
import { RandomGeneratorsService, UuidOptions, UuidResult } from '../../services/randomGeneratorsService';

const UuidGenerator: React.FC = () => {
  const [version, setVersion] = useState<UuidOptions['version']>('v4');
  const [format, setFormat] = useState<UuidOptions['format']>('standard');
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<UuidResult | null>(null);
  const [error, setError] = useState<string>('');

  const versions: Array<{ value: UuidOptions['version']; label: string; description: string }> = [
    { value: 'v4', label: 'Version 4 (Random)', description: 'Randomly generated UUID' },
    { value: 'v1', label: 'Version 1 (Timestamp)', description: 'Timestamp-based UUID' },
    { value: 'nil', label: 'Nil UUID', description: 'All zeros UUID' },
  ];

  const formats: Array<{ value: UuidOptions['format']; label: string; example: string }> = [
    { value: 'standard', label: 'Standard', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    { value: 'uppercase', label: 'Uppercase', example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' },
    { value: 'no-hyphens', label: 'No Hyphens', example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  ];

  const commonQuantities = [1, 5, 10, 25, 50, 100];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      const validation = RandomGeneratorsService.validateQuantity(quantity, 100);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      const options: UuidOptions = { version, format, quantity };
      const generateResult = RandomGeneratorsService.generateUuids(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [version, format, quantity]);

  const handleCopyAll = useCallback(async () => {
    if (result?.uuids) {
      try {
        const allUuids = result.uuids.join('\n');
        await navigator.clipboard.writeText(allUuids);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleCopyUuid = useCallback(async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const selectedVersion = versions.find(v => v.value === version);
  const selectedFormat = formats.find(f => f.value === format);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        UUID Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate Universally Unique Identifiers (UUIDs) in various formats. Perfect for database keys, session IDs, and unique identifiers.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Generation Options</Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>UUID Version</InputLabel>
                <Select
                  value={version}
                  label="UUID Version"
                  onChange={(e) => setVersion(e.target.value as UuidOptions['version'])}
                >
                  {versions.map((ver) => (
                    <MenuItem key={ver.value} value={ver.value}>
                      <Box>
                        <Typography variant="body1">{ver.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ver.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  label="Format"
                  onChange={(e) => setFormat(e.target.value as UuidOptions['format'])}
                >
                  {formats.map((fmt) => (
                    <MenuItem key={fmt.value} value={fmt.value}>
                      <Box>
                        <Typography variant="body1">{fmt.label}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                          {fmt.example}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 100 }}
                helperText="How many UUIDs to generate"
              />
            </Grid>
          </Grid>

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

          {selectedVersion && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>{selectedVersion.label}:</strong> {selectedVersion.description}
              </Typography>
            </Alert>
          )}

          {selectedFormat && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Format Preview:</strong> <code>{selectedFormat.example}</code>
              </Typography>
            </Box>
          )}

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              startIcon={<Add />}
            >
              Generate UUIDs
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
                <Typography variant="h6">Generated UUIDs:</Typography>
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
                  label={`Version: ${result.version.toUpperCase()}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Format: ${result.format}`} 
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
                    {result.uuids.map((uuid, index) => (
                      <ListItem 
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                          borderBottom: index < result.uuids.length - 1 ? '1px solid #eee' : 'none'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                              {uuid}
                            </Typography>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleCopyUuid(uuid)}
                          title="Copy UUID"
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

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>About UUIDs</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            UUIDs are 128-bit identifiers that are unique across space and time. They're commonly used in distributed systems, databases, and APIs.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Use cases:</strong> Database primary keys, session IDs, file names, API request IDs, distributed system identifiers.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UuidGenerator;
