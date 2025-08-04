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
import { ContentCopy, Clear, FormatQuote } from '@mui/icons-material';
import { StringUtilitiesService, QuoteOptions, QuoteResult } from '../../services/stringUtilitiesService';

const QuoteUtilities: React.FC = () => {
  const [input, setInput] = useState('');
  const [quoteType, setQuoteType] = useState<QuoteOptions['quoteType']>('double');
  const [action, setAction] = useState<QuoteOptions['action']>('add');
  const [targetQuoteType, setTargetQuoteType] = useState<QuoteOptions['quoteType']>('single');
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string>('');

  const quoteTypes: Array<{ value: QuoteOptions['quoteType']; label: string; example: string }> = [
    { value: 'single', label: 'Single Quotes', example: "'text'" },
    { value: 'double', label: 'Double Quotes', example: '"text"' },
    { value: 'backtick', label: 'Backticks', example: '`text`' },
    { value: 'smart', label: 'Smart Quotes', example: '"text"' },
  ];

  const actions: Array<{ value: QuoteOptions['action']; label: string; description: string }> = [
    { value: 'add', label: 'Add Quotes', description: 'Add quotes to each line' },
    { value: 'remove', label: 'Remove Quotes', description: 'Remove existing quotes from each line' },
    { value: 'convert', label: 'Convert Quotes', description: 'Convert between quote types' },
  ];

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some text to process');
      setResult(null);
      return;
    }

    try {
      setError('');
      const options: QuoteOptions = { 
        quoteType, 
        action,
        ...(action === 'convert' && { targetQuoteType })
      };
      const processResult = StringUtilitiesService.handleQuotes(input, options);
      setResult(processResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setResult(null);
    }
  }, [input, quoteType, action, targetQuoteType]);

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

  const selectedAction = actions.find(a => a.value === action);
  const selectedQuoteType = quoteTypes.find(qt => qt.value === quoteType);
  const selectedTargetQuoteType = quoteTypes.find(qt => qt.value === targetQuoteType);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quote Utilities
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Add, remove, or convert quotes in your text. Works line by line for easy processing of lists and code.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={action}
              exclusive
              onChange={(_, newAction) => newAction && setAction(newAction)}
              sx={{ mb: 2, display: 'flex' }}
            >
              {actions.map((actionOption) => (
                <ToggleButton key={actionOption.value} value={actionOption.value}>
                  {actionOption.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {selectedAction && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{selectedAction.label}:</strong> {selectedAction.description}
                </Typography>
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Quote Type</InputLabel>
                <Select
                  value={quoteType}
                  label="Quote Type"
                  onChange={(e) => setQuoteType(e.target.value as QuoteOptions['quoteType'])}
                >
                  {quoteTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body1">{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Example: {type.example}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {action === 'convert' && (
                <FormControl fullWidth>
                  <InputLabel>Convert To</InputLabel>
                  <Select
                    value={targetQuoteType}
                    label="Convert To"
                    onChange={(e) => setTargetQuoteType(e.target.value as QuoteOptions['quoteType'])}
                  >
                    {quoteTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box>
                          <Typography variant="body1">{type.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Example: {type.example}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>

            {action !== 'convert' && selectedQuoteType && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Preview: Each line will be processed with {selectedQuoteType.label.toLowerCase()}: {selectedQuoteType.example}
                </Typography>
              </Box>
            )}

            {action === 'convert' && selectedQuoteType && selectedTargetQuoteType && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Convert from {selectedQuoteType.example} to {selectedTargetQuoteType.example}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={6}
            label="Input Text (one item per line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text lines to process..."
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              startIcon={<FormatQuote />}
              disabled={!input.trim()}
            >
              {action === 'add' ? 'Add Quotes' : action === 'remove' ? 'Remove Quotes' : 'Convert Quotes'}
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
                  label={`Action: ${result.action}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Quote Type: ${result.quoteType}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Lines: ${result.lineCount}`} 
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

export default QuoteUtilities;
