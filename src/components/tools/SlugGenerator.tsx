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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ContentCopy, Clear, Link, Add } from '@mui/icons-material';
import { StringUtilitiesService, SlugOptions, SlugResult } from '../../services/stringUtilitiesService';

const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState<SlugOptions['separator']>('-');
  const [caseOption, setCaseOption] = useState<SlugOptions['case']>('lower');
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [allowNumbers, setAllowNumbers] = useState(true);
  const [customReplacements, setCustomReplacements] = useState<Record<string, string>>({});
  const [newReplaceFrom, setNewReplaceFrom] = useState('');
  const [newReplaceTo, setNewReplaceTo] = useState('');
  const [result, setResult] = useState<SlugResult | null>(null);
  const [error, setError] = useState<string>('');

  const separators: Array<{ value: SlugOptions['separator']; label: string; example: string }> = [
    { value: '-', label: 'Hyphen', example: 'my-awesome-slug' },
    { value: '_', label: 'Underscore', example: 'my_awesome_slug' },
    { value: '.', label: 'Dot', example: 'my.awesome.slug' },
  ];

  const caseOptions: Array<{ value: SlugOptions['case']; label: string; description: string }> = [
    { value: 'lower', label: 'Lowercase', description: 'Convert all text to lowercase' },
    { value: 'upper', label: 'Uppercase', description: 'Convert all text to uppercase' },
    { value: 'preserve', label: 'Preserve', description: 'Keep original case' },
  ];

  const commonExamples = [
    { input: 'My Awesome Blog Post', description: 'Blog post title' },
    { input: 'Product Name with Special @#$ Characters', description: 'Product name' },
    { input: 'How to Build a React App in 2024', description: 'Tutorial title' },
    { input: 'JavaScript & TypeScript: The Complete Guide', description: 'Course title' },
    { input: 'API v2.1 Documentation', description: 'Documentation title' },
  ];

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some text to convert to a slug');
      setResult(null);
      return;
    }

    try {
      setError('');
      const options: SlugOptions = {
        separator,
        case: caseOption,
        removeStopWords,
        maxLength: maxLength && maxLength > 0 ? maxLength : undefined,
        allowNumbers,
        customReplacements,
      };
      const processResult = StringUtilitiesService.generateSlug(input, options);
      setResult(processResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
      setResult(null);
    }
  }, [input, separator, caseOption, removeStopWords, maxLength, allowNumbers, customReplacements]);

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

  const handleAddReplacement = useCallback(() => {
    if (newReplaceFrom.trim() && newReplaceTo.trim()) {
      setCustomReplacements(prev => ({
        ...prev,
        [newReplaceFrom.trim()]: newReplaceTo.trim()
      }));
      setNewReplaceFrom('');
      setNewReplaceTo('');
    }
  }, [newReplaceFrom, newReplaceTo]);

  const handleRemoveReplacement = useCallback((key: string) => {
    setCustomReplacements(prev => {
      const newReplacements = { ...prev };
      delete newReplacements[key];
      return newReplacements;
    });
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    setInput(example);
  }, []);

  const selectedSeparator = separators.find(sep => sep.value === separator);
  const selectedCase = caseOptions.find(opt => opt.value === caseOption);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Slug Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert text to URL-friendly slugs. Perfect for blog posts, product names, and SEO-friendly URLs.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Input & Basic Options</Typography>
              
              <TextField
                fullWidth
                label="Text to Convert"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert to a slug..."
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Separator</InputLabel>
                    <Select
                      value={separator}
                      label="Separator"
                      onChange={(e) => setSeparator(e.target.value as SlugOptions['separator'])}
                    >
                      {separators.map((sep) => (
                        <MenuItem key={sep.value} value={sep.value}>
                          <Box>
                            <Typography variant="body1">{sep.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {sep.example}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Case</InputLabel>
                    <Select
                      value={caseOption}
                      label="Case"
                      onChange={(e) => setCaseOption(e.target.value as SlugOptions['case'])}
                    >
                      {caseOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography variant="body1">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Length (optional)"
                    value={maxLength || ''}
                    onChange={(e) => setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)}
                    inputProps={{ min: 1, max: 200 }}
                    helperText="Leave empty for no limit"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>Advanced Options</Typography>
              
              <Stack spacing={1} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={removeStopWords}
                      onChange={(e) => setRemoveStopWords(e.target.checked)}
                    />
                  }
                  label="Remove stop words (a, an, the, etc.)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowNumbers}
                      onChange={(e) => setAllowNumbers(e.target.checked)}
                    />
                  }
                  label="Allow numbers in slug"
                />
              </Stack>

              <Typography variant="subtitle1" gutterBottom>Custom Replacements</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Replace from"
                    value={newReplaceFrom}
                    onChange={(e) => setNewReplaceFrom(e.target.value)}
                    placeholder="e.g., '&'"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Replace to"
                    value={newReplaceTo}
                    onChange={(e) => setNewReplaceTo(e.target.value)}
                    placeholder="e.g., 'and'"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleAddReplacement}
                    disabled={!newReplaceFrom.trim() || !newReplaceTo.trim()}
                    startIcon={<Add />}
                    sx={{ height: '40px' }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              {Object.keys(customReplacements).length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active replacements:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.entries(customReplacements).map(([from, to]) => (
                      <Chip
                        key={from}
                        label={`"${from}" → "${to}"`}
                        onDelete={() => handleRemoveReplacement(from)}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleProcess}
                  startIcon={<Link />}
                  disabled={!input.trim()}
                >
                  Generate Slug
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
                    <Typography variant="h6">Generated Slug:</Typography>
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
                    value={result.result}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip 
                      label={`Separator: "${result.separator}"`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Length: ${result.finalLength} chars`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`${result.transformations.length} transformations`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Stack>

                  {result.transformations.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Applied transformations:
                      </Typography>
                      <List dense>
                        {result.transformations.map((transformation, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemText 
                              primary={transformation}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Examples</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Click any example to try it:
              </Typography>
              
              {commonExamples.map((example, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleExampleClick(example.input)}
                    sx={{ 
                      textAlign: 'left', 
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      height: 'auto',
                      py: 1
                    }}
                  >
                    <Box>
                      <Typography variant="body2" component="div">
                        {example.input}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {example.description}
                      </Typography>
                    </Box>
                  </Button>
                </Box>
              ))}

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Preview:</strong> {selectedSeparator && selectedCase && 
                    `Using ${selectedSeparator.label.toLowerCase()} separator and ${selectedCase.label.toLowerCase()} case`
                  }
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SlugGenerator;
