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
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { ContentCopy, Clear, Transform } from '@mui/icons-material';
import { StringUtilitiesService, EscapeOptions, EscapeResult } from '../../services/stringUtilitiesService';

const StringEscapeUtilities: React.FC = () => {
  const [input, setInput] = useState('');
  const [escapeType, setEscapeType] = useState<EscapeOptions['escapeType']>('json');
  const [direction, setDirection] = useState<EscapeOptions['direction']>('escape');
  const [result, setResult] = useState<EscapeResult | null>(null);
  const [error, setError] = useState<string>('');

  const escapeTypes: Array<{ value: EscapeOptions['escapeType']; label: string; description: string }> = [
    { value: 'json', label: 'JSON', description: 'Escape for JSON strings' },
    { value: 'html', label: 'HTML', description: 'Escape HTML entities' },
    { value: 'url', label: 'URL', description: 'URL encode/decode' },
    { value: 'sql', label: 'SQL', description: 'Escape SQL strings' },
    { value: 'javascript', label: 'JavaScript', description: 'Escape for JS strings' },
    { value: 'xml', label: 'XML', description: 'Escape XML entities' },
  ];

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some text to process');
      setResult(null);
      return;
    }

    try {
      setError('');
      const options: EscapeOptions = { escapeType, direction };
      const processResult = StringUtilitiesService.escapeString(input, options);
      setResult(processResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setResult(null);
    }
  }, [input, escapeType, direction]);

  const handleCopy = useCallback(async () => {
    if (result?.result) {
      try {
        await navigator.clipboard.writeText(result.result);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setInput('');
    setResult(null);
    setError('');
  }, []);

  const selectedEscapeType = escapeTypes.find(type => type.value === escapeType);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        String Escape Utilities
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Escape and unescape strings for various formats like JSON, HTML, URL, SQL, JavaScript, and XML.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Escape Type</InputLabel>
              <Select
                value={escapeType}
                label="Escape Type"
                onChange={(e) => setEscapeType(e.target.value as EscapeOptions['escapeType'])}
              >
                {escapeTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Typography variant="body1">{type.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={direction}
              exclusive
              onChange={(_, newDirection) => newDirection && setDirection(newDirection)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="escape">
                Escape
              </ToggleButton>
              <ToggleButton value="unescape">
                Unescape
              </ToggleButton>
            </ToggleButtonGroup>

            {selectedEscapeType && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{selectedEscapeType.label}:</strong> {selectedEscapeType.description}
                </Typography>
              </Alert>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Input Text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter text to ${direction}...`}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              startIcon={<Transform />}
              disabled={!input.trim()}
            >
              {direction === 'escape' ? 'Escape' : 'Unescape'}
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
                <Typography variant="h6">Result:</Typography>
                <Button
                  size="small"
                  onClick={handleCopy}
                  startIcon={<ContentCopy />}
                >
                  Copy
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={6}
                value={result.result}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip 
                  label={`Type: ${result.escapeType.toUpperCase()}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Operation: ${result.direction}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Length: ${result.characterCount} chars`} 
                  size="small" 
                  variant="outlined" 
                />
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StringEscapeUtilities;
