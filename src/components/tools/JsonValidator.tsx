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
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  DataObject, 
  Clear, 
  ContentCopy,
  Info
} from '@mui/icons-material';
import { ValidatorService, ValidationResult } from '../../services/validatorService';

const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const jsonExamples = [
    {
      title: 'Valid Simple Object',
      json: `{
  "name": "John Doe",
  "age": 30,
  "active": true
}`,
      isValid: true
    },
    {
      title: 'Valid Array',
      json: `[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"},
  {"id": 3, "name": "Charlie"}
]`,
      isValid: true
    },
    {
      title: 'Invalid - Missing Comma',
      json: `{
  "name": "John"
  "age": 30
}`,
      isValid: false
    },
    {
      title: 'Invalid - Trailing Comma',
      json: `{
  "name": "John",
  "age": 30,
}`,
      isValid: false
    },
    {
      title: 'Invalid - Unquoted Keys',
      json: `{
  name: "John",
  age: 30
}`,
      isValid: false
    }
  ];

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setValidationResult(null);
      return;
    }

    const result = ValidatorService.validateJson(input);
    setValidationResult(result);
  }, [input]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setValidationResult(null);
  }, []);

  const handleExampleClick = useCallback((example: typeof jsonExamples[0]) => {
    setInput(example.json);
    setValidationResult(null);
  }, []);

  const formatJson = useCallback(() => {
    if (!validationResult?.isValid || !input) return;
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
    } catch (err) {
      console.error('Failed to format JSON:', err);
    }
  }, [input, validationResult]);

  const getJsonStats = useCallback(() => {
    if (!validationResult?.isValid || !input) return null;

    try {
      const parsed = JSON.parse(input);
      const jsonString = JSON.stringify(parsed);
      
      let objectCount = 0;
      let arrayCount = 0;
      let stringCount = 0;
      let numberCount = 0;
      let booleanCount = 0;
      let nullCount = 0;

      const countTypes = (obj: any) => {
        if (obj === null) {
          nullCount++;
        } else if (Array.isArray(obj)) {
          arrayCount++;
          obj.forEach(countTypes);
        } else if (typeof obj === 'object') {
          objectCount++;
          Object.values(obj).forEach(countTypes);
        } else if (typeof obj === 'string') {
          stringCount++;
        } else if (typeof obj === 'number') {
          numberCount++;
        } else if (typeof obj === 'boolean') {
          booleanCount++;
        }
      };

      countTypes(parsed);

      return {
        size: jsonString.length,
        objects: objectCount,
        arrays: arrayCount,
        strings: stringCount,
        numbers: numberCount,
        booleans: booleanCount,
        nulls: nullCount,
        totalProperties: Object.keys(parsed).length
      };
    } catch {
      return null;
    }
  }, [input, validationResult]);

  const jsonStats = getJsonStats();

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON Validator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Validate JSON syntax, detect errors, and get detailed information about your JSON structure.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>JSON Input</Typography>
              
              <TextField
                fullWidth
                multiline
                rows={15}
                label="JSON to Validate"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
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
                  onClick={handleValidate}
                  startIcon={<DataObject />}
                >
                  Validate JSON
                </Button>
                {validationResult?.isValid && (
                  <Button
                    variant="outlined"
                    onClick={formatJson}
                    startIcon={<DataObject />}
                  >
                    Format JSON
                  </Button>
                )}
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<Clear />}
                >
                  Clear
                </Button>
              </Stack>

              {validationResult && (
                <Box>
                  <Alert 
                    severity={validationResult.isValid ? 'success' : 'error'}
                    sx={{ mb: 2 }}
                    icon={validationResult.isValid ? <CheckCircle /> : <Error />}
                  >
                    <Typography variant="h6">
                      {validationResult.isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </Typography>
                    {validationResult.isValid ? (
                      <Typography>
                        Your JSON is syntactically correct and can be parsed successfully.
                      </Typography>
                    ) : (
                      <Typography>
                        Found {validationResult.errors.length} error(s) in your JSON.
                      </Typography>
                    )}
                  </Alert>

                  {validationResult.errors.length > 0 && (
                    <Card variant="outlined" sx={{ mb: 2, border: '1px solid #f44336' }}>
                      <CardContent>
                        <Typography variant="h6" color="error" gutterBottom>
                          Errors:
                        </Typography>
                        <List dense>
                          {validationResult.errors.map((error, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Error color="error" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={error}
                                secondary={
                                  validationResult.lineNumber && validationResult.columnNumber 
                                    ? `Line ${validationResult.lineNumber}, Column ${validationResult.columnNumber}`
                                    : null
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  )}

                  {validationResult.warnings && validationResult.warnings.length > 0 && (
                    <Card variant="outlined" sx={{ mb: 2, border: '1px solid #ff9800' }}>
                      <CardContent>
                        <Typography variant="h6" color="warning.main" gutterBottom>
                          Warnings:
                        </Typography>
                        <List dense>
                          {validationResult.warnings.map((warning, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Warning color="warning" />
                              </ListItemIcon>
                              <ListItemText primary={warning} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  )}

                  {jsonStats && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>JSON Statistics:</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Size: ${jsonStats.size.toLocaleString()} chars`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Objects: ${jsonStats.objects}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Arrays: ${jsonStats.arrays}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Strings: ${jsonStats.strings}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Numbers: ${jsonStats.numbers}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Booleans: ${jsonStats.booleans}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Test Examples</Typography>
              
              <Stack spacing={2}>
                {jsonExamples.map((example, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {example.title}
                      </Typography>
                      {example.isValid ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Error color="error" fontSize="small" />
                      )}
                    </Box>
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
                      onClick={() => handleExampleClick(example)}
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
                        {example.json}
                      </Typography>
                    </Button>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>JSON Rules:</strong>
                  <br />
                  • Keys must be in double quotes
                  <br />
                  • No trailing commas allowed
                  <br />
                  • Strings must use double quotes
                  <br />
                  • No comments allowed
                  <br />
                  • No undefined values
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JsonValidator;
