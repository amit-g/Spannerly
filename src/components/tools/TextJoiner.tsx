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
} from '@mui/material';
import { ContentCopy, Clear, CallMerge } from '@mui/icons-material';
import { StringUtilitiesService, JoinerOptions, JoinerResult } from '../../services/stringUtilitiesService';

const TextJoiner: React.FC = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState(',');
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [addFinalSeparator, setAddFinalSeparator] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [result, setResult] = useState<JoinerResult | null>(null);
  const [error, setError] = useState<string>('');

  const commonSeparators = [
    { value: ',', label: 'Comma', display: ',' },
    { value: ', ', label: 'Comma + Space', display: ', ' },
    { value: ';', label: 'Semicolon', display: ';' },
    { value: ' | ', label: 'Pipe with spaces', display: ' | ' },
    { value: '\n', label: 'New Line', display: '\\n' },
    { value: ' ', label: 'Space', display: ' ' },
    { value: '\t', label: 'Tab', display: '\\t' },
    { value: ' and ', label: 'And', display: ' and ' },
    { value: ' + ', label: 'Plus', display: ' + ' },
  ];

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some text lines to join');
      setResult(null);
      return;
    }

    try {
      setError('');
      const lines = input.split('\n');
      const options: JoinerOptions = {
        separator,
        removeEmptyLines,
        trimLines,
        addFinalSeparator,
        prefix: prefix || undefined,
        suffix: suffix || undefined,
      };
      const processResult = StringUtilitiesService.joinText(lines, options);
      setResult(processResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setResult(null);
    }
  }, [input, separator, removeEmptyLines, trimLines, addFinalSeparator, prefix, suffix]);

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

  const handleSeparatorPreset = useCallback((preset: string) => {
    setSeparator(preset);
  }, []);

  const getDisplaySeparator = (sep: string) => {
    return sep.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Text Joiner
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Join multiple lines of text with custom separators, prefixes, and suffixes. Perfect for creating lists, arrays, or formatted data.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Separator Options</Typography>
            
            <TextField
              fullWidth
              label="Custom Separator"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="Enter custom separator..."
              sx={{ mb: 2 }}
              helperText={`Current: "${getDisplaySeparator(separator)}"`}
            />

            <Typography variant="subtitle2" gutterBottom>Quick Presets:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
              {commonSeparators.map((preset) => (
                <Chip
                  key={preset.value}
                  label={preset.label}
                  onClick={() => handleSeparatorPreset(preset.value)}
                  variant={separator === preset.value ? "filled" : "outlined"}
                  size="small"
                />
              ))}
            </Stack>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prefix (optional)"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g., '- ' for list items"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Suffix (optional)"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g., ';' for statements"
                  size="small"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>Processing Options</Typography>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={removeEmptyLines}
                    onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                  />
                }
                label="Remove empty lines"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={trimLines}
                    onChange={(e) => setTrimLines(e.target.checked)}
                  />
                }
                label="Trim whitespace from each line"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addFinalSeparator}
                    onChange={(e) => setAddFinalSeparator(e.target.checked)}
                  />
                }
                label="Add separator at the end"
              />
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={8}
            label="Input Lines (one per line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter lines to join...\nLine 1\nLine 2\nLine 3`}
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              startIcon={<CallMerge />}
              disabled={!input.trim()}
            >
              Join Text
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
                <Typography variant="h6">Joined Result:</Typography>
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
                rows={4}
                value={result.result}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip 
                  label={`Separator: "${getDisplaySeparator(result.separator)}"`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Lines processed: ${result.lineCount}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Final length: ${result.finalLength} chars`} 
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

export default TextJoiner;
