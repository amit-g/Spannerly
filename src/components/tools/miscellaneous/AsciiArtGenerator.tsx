import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Stack,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Slider,
  CircularProgress,
} from '@mui/material';
import { 
  ContentCopy, 
  Download, 
  Info, 
  ExpandMore,
  AutoFixHigh
} from '@mui/icons-material';
import { AsciiArtService, FontInfo, AsciiArtResult } from '../../../services';

export const AsciiArtGenerator: React.FC = () => {
  const theme = useTheme();
  const [inputText, setInputText] = useState<string>('HELLO');
  const [selectedFont, setSelectedFont] = useState<string>('Standard');
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [asciiResult, setAsciiResult] = useState<AsciiArtResult | null>(null);
  
  // Advanced options
  const [maxWidth, setMaxWidth] = useState<number>(80);
  const [useAsyncGeneration, setUseAsyncGeneration] = useState<boolean>(true);

  // Get service instance
  const asciiService = AsciiArtService.getInstance();

  // Get available fonts from service with error handling
  const availableFonts: FontInfo[] = (() => {
    try {
      return asciiService.getAvailableFonts();
    } catch (err) {
      console.error('Failed to get available fonts:', err);
      return [{
        name: 'Standard',
        displayName: 'Standard',
        description: 'Default font',
        category: 'basic' as const,
        preloaded: true
      }];
    }
  })();
  
  const fontsByCategory = (() => {
    try {
      return AsciiArtService.getFontsByCategory();
    } catch (err) {
      console.error('Failed to get fonts by category:', err);
      return { basic: availableFonts };
    }
  })();

  // Generate ASCII art using figlet
  const generateAsciiArt = useCallback(async () => {
    if (!inputText.trim()) {
      setAsciiResult(null);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Validate text first
      const isValid = await asciiService.validateText(inputText);
      if (!isValid) {
        throw new Error('Invalid text. Please use alphanumeric characters and basic punctuation only (max 50 characters).');
      }
      
      const options = {
        font: selectedFont,
        width: maxWidth
      };

      // Always use async generation with figlet
      const result = await asciiService.generateAsciiArt(inputText, options);
      setAsciiResult(result);
    } catch (err) {
      console.error('ASCII generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate ASCII art');
    } finally {
      setLoading(false);
    }
  }, [inputText, selectedFont, maxWidth, asciiService]);

  // Auto-generate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateAsciiArt();
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [generateAsciiArt]);

  const handleCopyToClipboard = async () => {
    if (!asciiResult) return;
    
    try {
      const success = await AsciiArtService.copyToClipboard(asciiResult.text);
      if (success) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } else {
        setError('Failed to copy to clipboard');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!asciiResult) return;
    AsciiArtService.exportAsText(asciiResult);
  };

  const handleExampleClick = (example: string) => {
    setInputText(example);
  };

  const handleSampleFont = (fontName: string) => {
    setSelectedFont(fontName);
    setInputText(AsciiArtService.getSampleText(fontName));
  };

  const examples = ['HELLO', 'WORLD', 'ASCII', 'ART', 'WELCOME', 'TEXT'];

  const stats = asciiResult ? AsciiArtService.getUsageStats(asciiResult) : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        ASCII Art Generator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Convert text to beautiful ASCII art with built-in font patterns
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {/* Input Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Enter Text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here..."
              variant="outlined"
              inputProps={{ maxLength: 100 }}
              helperText={`${asciiResult?.characterCount || 0}/100 characters`}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Font Style</InputLabel>
              <Select
                value={selectedFont}
                label="Font Style"
                onChange={(e) => setSelectedFont(e.target.value)}
                disabled={loading}
              >
                {(Object.entries(fontsByCategory) as [string, FontInfo[]][]).map(([category, fonts]) => [
                  <MenuItem key={`${category}-header`} disabled sx={{ fontWeight: 'bold' }}>
                    {category.toUpperCase()}
                  </MenuItem>,
                  ...fonts.map((font) => (
                    <MenuItem key={font.name} value={font.name}>
                      {font.displayName} - {font.description}
                    </MenuItem>
                  ))
                ])}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Advanced Options */}
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Max Width: {maxWidth}</Typography>
                <Slider
                  value={maxWidth}
                  onChange={(_, value) => setMaxWidth(value as number)}
                  min={40}
                  max={120}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useAsyncGeneration}
                      onChange={(e) => setUseAsyncGeneration(e.target.checked)}
                    />
                  }
                  label="Async generation (slower but non-blocking)"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Error Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {showCopied && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ASCII art copied to clipboard!
          </Alert>
        )}

        {/* Examples Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Quick Examples:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {examples.map((example) => (
              <Chip
                key={example}
                label={example}
                onClick={() => handleExampleClick(example)}
                variant="outlined"
                clickable
              />
            ))}
          </Stack>
        </Box>

        {/* Font Samples */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Font Samples:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {availableFonts.slice(0, 6).map((font) => (
              <Chip
                key={font.name}
                label={font.displayName}
                onClick={() => handleSampleFont(font.name)}
                variant={selectedFont === font.name ? "filled" : "outlined"}
                clickable
                icon={<AutoFixHigh />}
              />
            ))}
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<ContentCopy />}
            onClick={handleCopyToClipboard}
            disabled={!asciiResult?.text.trim() || loading}
          >
            Copy
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={!asciiResult?.text.trim() || loading}
          >
            Download
          </Button>

          {loading && <CircularProgress size={24} />}
        </Box>

        {/* Stats */}
        {stats && (
          <Chip
            icon={<Info />}
            label={`${stats.lineCount} lines, ${stats.characterCount} chars, Font: ${selectedFont}`}
            variant="outlined"
            size="small"
          />
        )}
      </Paper>

      {/* ASCII Art Output */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f8f9fa',
          border: '1px solid',
          borderColor: theme.palette.divider
        }}
      >
        <Typography variant="h6" gutterBottom>
          Generated ASCII Art:
        </Typography>
        
        <Box
          component="pre"
          sx={{
            fontFamily: 'Monaco, "Lucida Console", "Courier New", monospace',
            fontSize: '12px',
            lineHeight: 1.2,
            whiteSpace: 'pre',
            overflow: 'auto',
            maxHeight: '400px',
            backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
            color: theme.palette.mode === 'dark' ? '#0f0' : '#333',
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: theme.palette.divider,
            userSelect: 'all',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Generating ASCII art...</Typography>
            </Box>
          ) : (
            asciiResult?.text || 'Enter text above to generate ASCII art...'
          )}
        </Box>

        {/* Additional Info */}
        {asciiResult && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip size="small" label={`Original: "${asciiResult.originalText}"`} />
            <Chip size="small" label={`Font: ${asciiResult.font}`} />
            <Chip size="small" label={`Characters: ${asciiResult.characterCount}`} />
            <Chip size="small" label={`Lines: ${asciiResult.lineCount}`} />
          </Box>
        )}
      </Paper>

      {/* Instructions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <strong>Instructions:</strong><br />
          • Enter any text up to 100 characters<br />
          • Choose from built-in ASCII art fonts<br />
          • Adjust layout options for custom styling<br />
          • Copy the result or download as a text file<br />
          • Self-contained with no external dependencies
        </Typography>
      </Box>
    </Box>
  );
};
