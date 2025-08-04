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
import { ContentCopy, Clear, CallSplit } from '@mui/icons-material';
import { StringUtilitiesService, SplitterOptions, SplitterResult } from '../../services/stringUtilitiesService';

const TextSplitter: React.FC = () => {
  const [input, setInput] = useState('');
  const [splitType, setSplitType] = useState<SplitterOptions['splitType']>('delimiter');
  const [delimiter, setDelimiter] = useState(',');
  const [chunkSize, setChunkSize] = useState(10);
  const [regex, setRegex] = useState('');
  const [preserveDelimiter, setPreserveDelimiter] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [result, setResult] = useState<SplitterResult | null>(null);
  const [error, setError] = useState<string>('');

  const splitTypes: Array<{ value: SplitterOptions['splitType']; label: string; description: string }> = [
    { value: 'delimiter', label: 'Delimiter', description: 'Split by a specific character or string' },
    { value: 'length', label: 'Fixed Length', description: 'Split into chunks of specified character length' },
    { value: 'lines', label: 'Lines', description: 'Split by line breaks' },
    { value: 'words', label: 'Words', description: 'Split by whitespace to get individual words' },
    { value: 'regex', label: 'Regular Expression', description: 'Split using a custom regex pattern' },
  ];

  const commonDelimiters = [
    { value: ',', label: 'Comma' },
    { value: ';', label: 'Semicolon' },
    { value: '|', label: 'Pipe' },
    { value: ' ', label: 'Space' },
    { value: '\t', label: 'Tab' },
    { value: '\n', label: 'New Line' },
    { value: '-', label: 'Dash' },
    { value: ':', label: 'Colon' },
  ];

  const commonRegexPatterns = [
    { value: '\\s+', label: 'Whitespace', description: 'Split on any whitespace' },
    { value: '[,;]', label: 'Comma or Semicolon', description: 'Split on comma or semicolon' },
    { value: '\\d+', label: 'Numbers', description: 'Split on sequences of digits' },
    { value: '[A-Z]', label: 'Capital Letters', description: 'Split on capital letters' },
    { value: '\\.', label: 'Periods', description: 'Split on periods' },
  ];

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some text to split');
      setResult(null);
      return;
    }

    try {
      setError('');
      const options: SplitterOptions = {
        splitType,
        delimiter: delimiter || undefined,
        chunkSize,
        preserveDelimiter,
        removeEmpty,
        regex: regex || undefined,
      };
      const processResult = StringUtilitiesService.splitText(input, options);
      setResult(processResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setResult(null);
    }
  }, [input, splitType, delimiter, chunkSize, regex, preserveDelimiter, removeEmpty]);

  const handleCopy = useCallback(async () => {
    if (result?.result) {
      try {
        const resultText = result.result.join('\n');
        await navigator.clipboard.writeText(resultText);
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

  const selectedSplitType = splitTypes.find(type => type.value === splitType);

  const getDisplayDelimiter = (del: string) => {
    return del.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Text Splitter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Split text by delimiter, fixed length, lines, words, or regex pattern. Each result appears on a separate line.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Split Method</InputLabel>
              <Select
                value={splitType}
                label="Split Method"
                onChange={(e) => setSplitType(e.target.value as SplitterOptions['splitType'])}
              >
                {splitTypes.map((type) => (
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

            {selectedSplitType && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{selectedSplitType.label}:</strong> {selectedSplitType.description}
                </Typography>
              </Alert>
            )}

            {splitType === 'delimiter' && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  placeholder="Enter delimiter..."
                  sx={{ mb: 1 }}
                  helperText={`Current: "${getDisplayDelimiter(delimiter)}"`}
                />
                <Typography variant="subtitle2" gutterBottom>Quick Presets:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                  {commonDelimiters.map((preset) => (
                    <Chip
                      key={preset.value}
                      label={preset.label}
                      onClick={() => setDelimiter(preset.value)}
                      variant={delimiter === preset.value ? "filled" : "outlined"}
                      size="small"
                    />
                  ))}
                </Stack>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preserveDelimiter}
                      onChange={(e) => setPreserveDelimiter(e.target.checked)}
                    />
                  }
                  label="Keep delimiter in result"
                />
              </Box>
            )}

            {splitType === 'length' && (
              <TextField
                type="number"
                label="Chunk Size (characters)"
                value={chunkSize}
                onChange={(e) => setChunkSize(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 1000 }}
                sx={{ mb: 2 }}
                helperText="Split text into chunks of this many characters"
              />
            )}

            {splitType === 'regex' && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Regular Expression Pattern"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder="Enter regex pattern..."
                  sx={{ mb: 1 }}
                  helperText="Use regex to define split points"
                />
                <Typography variant="subtitle2" gutterBottom>Common Patterns:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {commonRegexPatterns.map((pattern) => (
                    <Chip
                      key={pattern.value}
                      label={pattern.label}
                      onClick={() => setRegex(pattern.value)}
                      variant={regex === pattern.value ? "filled" : "outlined"}
                      size="small"
                      title={pattern.description}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={removeEmpty}
                  onChange={(e) => setRemoveEmpty(e.target.checked)}
                />
              }
              label="Remove empty results"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Input Text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to split..."
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              startIcon={<CallSplit />}
              disabled={!input.trim()}
            >
              Split Text
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
                <Typography variant="h6">Split Results:</Typography>
                <Button
                  size="small"
                  onClick={handleCopy}
                  startIcon={<ContentCopy />}
                >
                  Copy All
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={8}
                value={result.result.join('\n')}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
                helperText="Each line represents one split result"
              />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip 
                  label={`Method: ${result.splitType}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Chunks: ${result.chunkCount}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Original: ${result.totalCharacters} chars`} 
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

export default TextSplitter;
