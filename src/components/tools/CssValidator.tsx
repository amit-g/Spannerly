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
  ListItemIcon,
  Chip,
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Warning, 
  Css, 
  Clear,
} from '@mui/icons-material';
import { ValidatorService, ValidationResult } from '../../services/validatorService';

const CssValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const cssExamples = [
    {
      title: 'Valid CSS Rules',
      css: `.header {
  background-color: #f0f0f0;
  color: #333;
  font-size: 16px;
  padding: 10px;
  margin: 0 auto;
}

.button {
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}`,
      isValid: true
    },
    {
      title: 'Valid Media Query',
      css: `@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 20px;
  }
  
  .sidebar {
    display: none;
  }
}`,
      isValid: true
    },
    {
      title: 'Invalid - Missing Semicolon',
      css: `.error-example {
  color: red
  background: white;
  font-size: 14px
}`,
      isValid: false
    },
    {
      title: 'Invalid - Unmatched Braces',
      css: `.unmatched {
  color: blue;
  background: yellow;
  /* Missing closing brace */`,
      isValid: false
    },
    {
      title: 'Invalid - Missing Property Value',
      css: `.missing-value {
  color: ;
  background-color: #fff;
  font-size: 16px;
}`,
      isValid: false
    }
  ];

  const handleValidate = useCallback(() => {
    if (!input.trim()) {
      setValidationResult(null);
      return;
    }

    const result = ValidatorService.validateCss(input);
    setValidationResult(result);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setValidationResult(null);
  }, []);

  const handleExampleClick = useCallback((example: typeof cssExamples[0]) => {
    setInput(example.css);
    setValidationResult(null);
  }, []);

  const getCssStats = useCallback(() => {
    if (!input) return null;

    const lines = input.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    const commentLines = lines.filter(line => line.trim().startsWith('/*') || line.includes('/*'));
    
    const selectors = input.match(/[^{}]+(?=\s*\{)/g) || [];
    const properties = input.match(/[\w-]+\s*:/g) || [];
    const braceCount = (input.match(/\{/g) || []).length;
    const closingBraceCount = (input.match(/\}/g) || []).length;

    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      commentLines: commentLines.length,
      selectors: selectors.length,
      properties: properties.length,
      openBraces: braceCount,
      closingBraces: closingBraceCount,
      braceBalance: braceCount - closingBraceCount
    };
  }, [input]);

  const cssStats = getCssStats();

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        CSS Validator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Validate CSS syntax, detect common errors, and get detailed information about your stylesheet.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>CSS Input</Typography>
              
              <TextField
                fullWidth
                multiline
                rows={15}
                label="CSS to Validate"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your CSS here..."
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
                  startIcon={<Css />}
                >
                  Validate CSS
                </Button>
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
                      {validationResult.isValid ? 'Valid CSS' : 'CSS Issues Found'}
                    </Typography>
                    {validationResult.isValid ? (
                      <Typography>
                        Your CSS appears to be syntactically correct with no major issues detected.
                      </Typography>
                    ) : (
                      <Typography>
                        Found {validationResult.errors.length} error(s) and {validationResult.warnings?.length || 0} warning(s) in your CSS.
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
                              <ListItemText primary={error} />
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

                  {cssStats && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>CSS Statistics:</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Lines: ${cssStats.totalLines}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Selectors: ${cssStats.selectors}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Properties: ${cssStats.properties}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Comments: ${cssStats.commentLines}`} 
                              variant="outlined" 
                              size="small" 
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Brace Balance: ${cssStats.braceBalance === 0 ? 'OK' : cssStats.braceBalance}`} 
                              variant="outlined" 
                              size="small" 
                              color={cssStats.braceBalance === 0 ? 'success' : 'error'}
                            />
                          </Grid>
                          <Grid item xs={6} sm={4}>
                            <Chip 
                              label={`Code Lines: ${cssStats.nonEmptyLines}`} 
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
                {cssExamples.map((example, index) => (
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
                        {example.css}
                      </Typography>
                    </Button>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>CSS Guidelines:</strong>
                  <br />
                  • Every property should end with a semicolon
                  <br />
                  • Braces must be properly matched
                  <br />
                  • Property values are required
                  <br />
                  • Selectors should be valid
                  <br />
                  • Use standard CSS properties
                </Typography>
              </Box>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.contrastText">
                  <strong>Note:</strong> This is a basic CSS validator that checks for common syntax errors. For comprehensive CSS validation, consider using the W3C CSS Validator.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CssValidator;
