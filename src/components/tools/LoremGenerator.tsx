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
  FormControlLabel,
  Checkbox,
  Alert,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import { ContentCopy, Clear, TextFormat, Refresh } from '@mui/icons-material';
import { RandomGeneratorsService, LoremOptions, LoremResult } from '../../services/randomGeneratorsService';

const LoremGenerator: React.FC = () => {
  const [type, setType] = useState<LoremOptions['type']>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [result, setResult] = useState<LoremResult | null>(null);
  const [error, setError] = useState<string>('');

  const types: Array<{ value: LoremOptions['type']; label: string; description: string; maxCount: number }> = [
    { value: 'words', label: 'Words', description: 'Generate individual words', maxCount: 500 },
    { value: 'sentences', label: 'Sentences', description: 'Generate complete sentences', maxCount: 50 },
    { value: 'paragraphs', label: 'Paragraphs', description: 'Generate full paragraphs', maxCount: 20 },
  ];

  const commonCounts = {
    words: [10, 25, 50, 100, 200],
    sentences: [3, 5, 10, 15, 25],
    paragraphs: [1, 3, 5, 8, 12],
  };

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      const selectedType = types.find(t => t.value === type);
      if (count > (selectedType?.maxCount || 100)) {
        setError(`Maximum ${selectedType?.maxCount} ${type} allowed`);
        return;
      }

      if (count < 1) {
        setError('Count must be at least 1');
        return;
      }

      const options: LoremOptions = { type, count, startWithLorem };
      const generateResult = RandomGeneratorsService.generateLorem(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [type, count, startWithLorem]);

  const handleCopy = useCallback(async () => {
    if (result?.text) {
      try {
        await navigator.clipboard.writeText(result.text);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const selectedType = types.find(t => t.value === type);
  const availableCounts = commonCounts[type] || [];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lorem Ipsum Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate Lorem Ipsum placeholder text for your designs and mockups. Choose from words, sentences, or paragraphs.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Generation Options</Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Text Type</InputLabel>
                <Select
                  value={type}
                  label="Text Type"
                  onChange={(e) => setType(e.target.value as LoremOptions['type'])}
                >
                  {types.map((typeOption) => (
                    <MenuItem key={typeOption.value} value={typeOption.value}>
                      <Box>
                        <Typography variant="body1">{typeOption.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {typeOption.description}
                        </Typography>
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
                label={`Number of ${type}`}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: selectedType?.maxCount || 100 }}
                helperText={`Max: ${selectedType?.maxCount} ${type}`}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom>Quick Counts:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {availableCounts.map((quickCount) => (
              <Chip
                key={quickCount}
                label={quickCount.toString()}
                onClick={() => setCount(quickCount)}
                variant={count === quickCount ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
            }
            label="Start with 'Lorem ipsum'"
            sx={{ mb: 2 }}
          />

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
              startIcon={<TextFormat />}
            >
              Generate Text
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
                <Typography variant="h6">Generated Text:</Typography>
                <Button
                  size="small"
                  onClick={handleCopy}
                  startIcon={<ContentCopy />}
                >
                  Copy Text
                </Button>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                <Chip 
                  label={`Type: ${result.type}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Count: ${result.count} ${result.type}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Words: ${result.wordCount}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Characters: ${result.characterCount}`} 
                  size="small" 
                  variant="outlined" 
                />
              </Stack>

              <Card variant="outlined">
                <CardContent>
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    value={result.text}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ 
                      '& .MuiInputBase-input': { 
                        lineHeight: 1.6,
                        fontSize: '0.9rem'
                      } 
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>About Lorem Ipsum</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text since the 1500s.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Use cases:</strong> Website mockups, print layouts, content placeholders, design prototypes.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Tips</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use paragraphs for long-form content layouts
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use sentences for shorter text blocks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Use words for testing typography and spacing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoremGenerator;
