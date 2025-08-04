import React, { useState, useCallback } from 'react';
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import { ContentCopy, Clear, Link, SwapVert } from '@mui/icons-material';
import { ConverterService } from '../../services/converterService';

const UrlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string>('');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  const commonCharacters = [
    { char: ' ', encoded: '%20', description: 'Space' },
    { char: '!', encoded: '%21', description: 'Exclamation mark' },
    { char: '"', encoded: '%22', description: 'Double quote' },
    { char: '#', encoded: '%23', description: 'Hash/Number sign' },
    { char: '$', encoded: '%24', description: 'Dollar sign' },
    { char: '%', encoded: '%25', description: 'Percent sign' },
    { char: '&', encoded: '%26', description: 'Ampersand' },
    { char: '+', encoded: '%2B', description: 'Plus sign' },
    { char: '=', encoded: '%3D', description: 'Equals sign' },
    { char: '?', encoded: '%3F', description: 'Question mark' },
    { char: '@', encoded: '%40', description: 'At symbol' },
  ];

  const examples = [
    {
      title: 'URL with Spaces',
      input: 'Hello World & More',
      encoded: 'Hello%20World%20%26%20More'
    },
    {
      title: 'Query Parameters',
      input: 'name=John Doe&city=New York',
      encoded: 'name%3DJohn%20Doe%26city%3DNew%20York'
    },
    {
      title: 'Special Characters',
      input: 'search?q=javascript+tutorial&lang=en',
      encoded: 'search%3Fq%3Djavascript%2Btutorial%26lang%3Den'
    }
  ];

  const handleConvert = useCallback(() => {
    try {
      setError('');
      
      if (!input.trim()) {
        setOutput('');
        setQueryParams({});
        return;
      }

      let result: string;
      if (mode === 'encode') {
        result = ConverterService.encodeUrl(input);
      } else {
        result = ConverterService.decodeUrl(input);
      }
      
      setOutput(result);

      // Try to parse as query parameters if it looks like query string
      if (input.includes('=') && input.includes('&')) {
        try {
          const params = mode === 'encode' 
            ? ConverterService.decodeUrlQuery(input)
            : ConverterService.decodeUrlQuery(result);
          setQueryParams(params);
        } catch {
          setQueryParams({});
        }
      } else {
        setQueryParams({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setOutput('');
      setQueryParams({});
    }
  }, [input, mode]);

  const handleSwapMode = useCallback(() => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError('');
    setQueryParams({});
  }, [mode, input, output]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setQueryParams({});
  }, []);

  const handleExampleClick = useCallback((example: typeof examples[0]) => {
    if (mode === 'encode') {
      setInput(example.input);
    } else {
      setInput(example.encoded);
    }
    setError('');
    setQueryParams({});
  }, [mode]);

  const handleCharacterClick = useCallback((character: typeof commonCharacters[0]) => {
    if (mode === 'encode') {
      setInput(character.char);
    } else {
      setInput(character.encoded);
    }
    setError('');
    setQueryParams({});
  }, [mode]);

  const getUrlInfo = useCallback(() => {
    if (!output) return null;

    try {
      if (mode === 'decode' && output.startsWith('http')) {
        const url = new URL(output);
        return {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          search: url.search,
          hash: url.hash
        };
      }
    } catch {
      return null;
    }
    return null;
  }, [output, mode]);

  const urlInfo = getUrlInfo();

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Encoder/Decoder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Encode and decode URLs and query parameters. Convert special characters for safe URL transmission.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleSwapMode}
                  startIcon={<SwapVert />}
                  size="small"
                >
                  Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label={mode === 'encode' ? 'Text to Encode' : 'URL to Decode'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode' 
                    ? 'Enter text or URL with special characters...'
                    : 'Enter encoded URL to decode...'
                }
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleConvert}
                  startIcon={<Link />}
                >
                  {mode === 'encode' ? 'Encode' : 'Decode'}
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

              {output && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Result:</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(output)}
                      title="Copy result"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: 0
                      }}
                    >
                      {output}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {urlInfo && (
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>URL Components:</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Protocol:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{urlInfo.protocol}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Hostname:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{urlInfo.hostname}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Pathname:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{urlInfo.pathname}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Search:</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>{urlInfo.search || '(none)'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {Object.keys(queryParams).length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Parsed Query Parameters:</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {Object.entries(queryParams).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Common URL Characters</Typography>
              <List dense>
                {commonCharacters.map((character, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleCharacterClick(character)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1">
                            '{character.char}'
                          </Typography>
                          <Typography variant="body2" component="code">
                            {character.encoded}
                          </Typography>
                        </Box>
                      }
                      secondary={character.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Examples</Typography>
              {examples.map((example, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {example.title}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ 
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      p: 1,
                      border: '1px solid #eee',
                      borderRadius: 1,
                      width: '100%',
                      mb: 1
                    }}
                    onClick={() => handleExampleClick(example)}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {mode === 'encode' ? example.input : example.encoded}
                    </Typography>
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UrlConverter;
