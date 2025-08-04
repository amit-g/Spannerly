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
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ContentCopy, Clear, DataObject, SwapVert, Code } from '@mui/icons-material';
import { ConverterService } from '../../services/converterService';

const JsonXmlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-xml' | 'xml-to-json'>('json-to-xml');
  const [rootElement, setRootElement] = useState('root');
  const [error, setError] = useState<string>('');

  const jsonExamples = [
    {
      title: 'Simple Object',
      json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}`
    },
    {
      title: 'Nested Object',
      json: `{
  "user": {
    "id": 1,
    "profile": {
      "name": "Alice",
      "email": "alice@example.com"
    },
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  }
}`
    },
    {
      title: 'Array Example',
      json: `{
  "users": [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"},
    {"id": 3, "name": "Bob"}
  ],
  "total": 3
}`
    }
  ];

  const xmlExamples = [
    {
      title: 'Simple XML',
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <city>New York</city>
</person>`
    },
    {
      title: 'XML with Attributes',
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<book id="123" category="fiction">
  <title>Sample Book</title>
  <author>John Author</author>
  <price currency="USD">19.99</price>
</book>`
    },
    {
      title: 'Nested XML',
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <books>
    <book>
      <title>Book 1</title>
      <author>Author 1</author>
    </book>
    <book>
      <title>Book 2</title>
      <author>Author 2</author>
    </book>
  </books>
</library>`
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
      if (mode === 'json-to-xml') {
        result = ConverterService.jsonToXml(input, rootElement);
      } else {
        result = ConverterService.xmlToJson(input);
      }
      
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during conversion');
      setOutput('');
    }
  }, [input, mode, rootElement]);

  const handleSwapMode = useCallback(() => {
    const newMode = mode === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml';
    setMode(newMode);
    
    // Swap input and output if both exist
    if (input && output) {
      setInput(output);
      setOutput(input);
    }
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

  const handleExampleClick = useCallback((exampleText: string) => {
    setInput(exampleText);
    setError('');
  }, []);

  const formatOutput = useCallback((text: string) => {
    if (!text) return text;
    
    try {
      if (mode === 'xml-to-json') {
        // Pretty print JSON
        const parsed = JSON.parse(text);
        return JSON.stringify(parsed, null, 2);
      } else {
        // XML is already formatted from the service
        return text;
      }
    } catch {
      return text;
    }
  }, [mode]);

  const currentExamples = mode === 'json-to-xml' ? jsonExamples : xmlExamples;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON ↔ XML Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between JSON and XML formats. Preserve data structure and handle nested objects and arrays.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'json-to-xml' ? 'JSON to XML' : 'XML to JSON'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleSwapMode}
                  startIcon={<SwapVert />}
                  size="small"
                >
                  Switch to {mode === 'json-to-xml' ? 'XML to JSON' : 'JSON to XML'}
                </Button>
              </Box>

              {mode === 'json-to-xml' && (
                <FormControl sx={{ minWidth: 200, mb: 2 }}>
                  <InputLabel>Root Element Name</InputLabel>
                  <Select
                    value={rootElement}
                    label="Root Element Name"
                    onChange={(e) => setRootElement(e.target.value)}
                  >
                    <MenuItem value="root">root</MenuItem>
                    <MenuItem value="data">data</MenuItem>
                    <MenuItem value="item">item</MenuItem>
                    <MenuItem value="document">document</MenuItem>
                    <MenuItem value="response">response</MenuItem>
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                multiline
                rows={12}
                label={mode === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'json-to-xml' 
                    ? 'Paste your JSON here...'
                    : 'Paste your XML here...'
                }
                sx={{ 
                  mb: 2,
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }
                }}
              />

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleConvert}
                  startIcon={mode === 'json-to-xml' ? <Code /> : <DataObject />}
                >
                  Convert
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
                    <Typography variant="h6">
                      {mode === 'json-to-xml' ? 'XML Output:' : 'JSON Output:'}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(output)}
                      title="Copy result"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 400, overflow: 'auto' }}>
                    <Typography
                      component="pre"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                        lineHeight: 1.4
                      }}
                    >
                      {formatOutput(output)}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {mode === 'json-to-xml' ? 'JSON Examples' : 'XML Examples'}
              </Typography>
              
              <Stack spacing={2}>
                {currentExamples.map((example, index) => (
                  <Box key={index}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {example.title}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        p: 1,
                        width: '100%',
                        maxHeight: 120,
                        overflow: 'hidden'
                      }}
                      onClick={() => handleExampleClick(mode === 'json-to-xml' ? (example as any).json : (example as any).xml)}
                    >
                      <Typography
                        component="pre"
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '0.65rem',
                          whiteSpace: 'pre-wrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          margin: 0,
                          lineHeight: 1.2
                        }}
                      >
                        {mode === 'json-to-xml' ? (example as any).json : (example as any).xml}
                      </Typography>
                    </Button>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>Tips:</strong>
                  <br />
                  • JSON arrays become numbered XML elements
                  <br />
                  • XML attributes are preserved in JSON as '@attributes'
                  <br />
                  • Text content is stored as '#text' in JSON
                  <br />
                  • Choose appropriate root element name for XML output
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JsonXmlConverter;
