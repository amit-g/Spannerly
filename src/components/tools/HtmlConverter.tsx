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
} from '@mui/material';
import { ContentCopy, Clear, Html, SwapVert } from '@mui/icons-material';
import { ConverterService } from '../../services/converterService';

const HtmlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string>('');

  const commonEntities = [
    { entity: '&lt;', character: '<', description: 'Less than' },
    { entity: '&gt;', character: '>', description: 'Greater than' },
    { entity: '&amp;', character: '&', description: 'Ampersand' },
    { entity: '&quot;', character: '"', description: 'Double quote' },
    { entity: '&apos;', character: "'", description: 'Single quote' },
    { entity: '&nbsp;', character: ' ', description: 'Non-breaking space' },
    { entity: '&copy;', character: '©', description: 'Copyright' },
    { entity: '&reg;', character: '®', description: 'Registered trademark' },
    { entity: '&trade;', character: '™', description: 'Trademark' },
  ];

  const examples = [
    {
      title: 'HTML Tags',
      input: '<div class="example">Hello World</div>',
      encoded: '&lt;div class=&quot;example&quot;&gt;Hello World&lt;/div&gt;'
    },
    {
      title: 'Special Characters',
      input: 'Tom & Jerry say "Hello!"',
      encoded: 'Tom &amp; Jerry say &quot;Hello!&quot;'
    },
    {
      title: 'JavaScript Code',
      input: 'if (x < 5 && y > 10) { alert("Success!"); }',
      encoded: 'if (x &lt; 5 &amp;&amp; y &gt; 10) { alert(&quot;Success!&quot;); }'
    }
  ];

  const handleConvert = useCallback(() => {
    try {
      setError('');
      
      if (!input.trim()) {
        setOutput('');
        return;
      }

      let result: string;
      if (mode === 'encode') {
        result = ConverterService.encodeHtml(input);
      } else {
        result = ConverterService.decodeHtml(input);
      }
      
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setOutput('');
    }
  }, [input, mode]);

  const handleSwapMode = useCallback(() => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
    setError('');
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
  }, []);

  const handleExampleClick = useCallback((example: typeof examples[0]) => {
    if (mode === 'encode') {
      setInput(example.input);
    } else {
      setInput(example.encoded);
    }
    setError('');
  }, [mode]);

  const handleEntityClick = useCallback((entity: typeof commonEntities[0]) => {
    if (mode === 'encode') {
      setInput(entity.character);
    } else {
      setInput(entity.entity);
    }
    setError('');
  }, [mode]);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        HTML Encoder/Decoder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Encode and decode HTML entities. Convert special characters to HTML entities and vice versa.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? 'Encode HTML' : 'Decode HTML'}
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
                rows={6}
                label={mode === 'encode' ? 'Text to Encode' : 'HTML to Decode'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode' 
                    ? 'Enter text with special characters...'
                    : 'Enter HTML entities to decode...'
                }
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleConvert}
                  startIcon={<Html />}
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
                <Box>
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Common HTML Entities</Typography>
              <List dense>
                {commonEntities.map((entity, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleEntityClick(entity)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" component="code">
                            {entity.entity}
                          </Typography>
                          <Typography variant="body1">
                            {entity.character}
                          </Typography>
                        </Box>
                      }
                      secondary={entity.description}
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

export default HtmlConverter;
