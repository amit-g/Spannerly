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
  Alert,
  Chip,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { ContentCopy, Clear, Palette, Refresh } from '@mui/icons-material';
import { RandomGeneratorsService, ColorOptions, RandomColorResult } from '../../services/randomGeneratorsService';

const ColorGenerator: React.FC = () => {
  const [format, setFormat] = useState<ColorOptions['format']>('hex');
  const [quantity, setQuantity] = useState(12);
  const [hueRange, setHueRange] = useState<[number, number]>([0, 360]);
  const [saturationRange, setSaturationRange] = useState<[number, number]>([50, 100]);
  const [lightnessRange, setLightnessRange] = useState<[number, number]>([30, 70]);
  const [alphaRange, setAlphaRange] = useState<[number, number]>([0.8, 1.0]);
  const [includeNames, setIncludeNames] = useState(false);
  const [result, setResult] = useState<RandomColorResult | null>(null);
  const [error, setError] = useState<string>('');

  const colorFormats: Array<{ value: ColorOptions['format']; label: string; description: string; example: string }> = [
    { value: 'hex', label: 'Hex', description: 'Hexadecimal color codes', example: '#FF5733' },
    { value: 'rgb', label: 'RGB', description: 'Red, Green, Blue values', example: 'rgb(255, 87, 51)' },
    { value: 'rgba', label: 'RGBA', description: 'RGB with Alpha channel', example: 'rgba(255, 87, 51, 0.8)' },
    { value: 'hsl', label: 'HSL', description: 'Hue, Saturation, Lightness', example: 'hsl(12, 100%, 60%)' },
    { value: 'hsla', label: 'HSLA', description: 'HSL with Alpha channel', example: 'hsla(12, 100%, 60%, 0.8)' },
  ];

  const presets = [
    { 
      label: 'Web Safe Colors', 
      hue: [0, 360], 
      saturation: [70, 100], 
      lightness: [40, 60], 
      quantity: 16 
    },
    { 
      label: 'Pastel Colors', 
      hue: [0, 360], 
      saturation: [30, 60], 
      lightness: [70, 90], 
      quantity: 12 
    },
    { 
      label: 'Vibrant Colors', 
      hue: [0, 360], 
      saturation: [80, 100], 
      lightness: [40, 60], 
      quantity: 10 
    },
    { 
      label: 'Cool Tones', 
      hue: [180, 300], 
      saturation: [50, 80], 
      lightness: [40, 70], 
      quantity: 8 
    },
    { 
      label: 'Warm Tones', 
      hue: [0, 60], 
      saturation: [60, 90], 
      lightness: [45, 65], 
      quantity: 8 
    },
    { 
      label: 'Monochrome', 
      hue: [0, 0], 
      saturation: [0, 0], 
      lightness: [20, 80], 
      quantity: 10 
    },
  ];

  const useCases = [
    { title: 'UI Design', description: 'Generate color palettes for interfaces' },
    { title: 'Brand Colors', description: 'Explore potential brand color schemes' },
    { title: 'Data Visualization', description: 'Create distinct colors for charts' },
    { title: 'Web Development', description: 'Get colors for CSS and styling' },
    { title: 'Graphic Design', description: 'Find inspiration for color schemes' },
    { title: 'Testing', description: 'Generate colors for UI testing' },
  ];

  const handleGenerate = useCallback(() => {
    try {
      setError('');
      
      const quantityValidation = RandomGeneratorsService.validateQuantity(quantity, 100);
      if (!quantityValidation.isValid) {
        setError(quantityValidation.errors.join(', '));
        return;
      }

      const options: ColorOptions = {
        format,
        quantity,
        hueRange: { min: hueRange[0], max: hueRange[1] },
        saturationRange: { min: saturationRange[0], max: saturationRange[1] },
        lightnessRange: { min: lightnessRange[0], max: lightnessRange[1] },
        alphaRange: format.includes('a') ? { min: alphaRange[0], max: alphaRange[1] } : undefined,
        includeNames,
      };
      
      const generateResult = RandomGeneratorsService.generateColors(options);
      setResult(generateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setResult(null);
    }
  }, [format, quantity, hueRange, saturationRange, lightnessRange, alphaRange, includeNames]);

  const handleCopyAll = useCallback(async () => {
    if (result?.colors) {
      try {
        const allColors = result.colors.map((color: any) => 
          includeNames && color.name ? `${color.value} (${color.name})` : color.value
        ).join('\n');
        await navigator.clipboard.writeText(allColors);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [result, includeNames]);

  const handleCopyColor = useCallback(async (colorValue: string) => {
    try {
      await navigator.clipboard.writeText(colorValue);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  const handlePreset = useCallback((preset: typeof presets[0]) => {
    setHueRange([preset.hue[0], preset.hue[1]]);
    setSaturationRange([preset.saturation[0], preset.saturation[1]]);
    setLightnessRange([preset.lightness[0], preset.lightness[1]]);
    setQuantity(preset.quantity);
  }, []);

  const selectedFormat = colorFormats.find(f => f.value === format);
  const showAlphaControls = format.includes('a');

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Random Color Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate random colors in various formats for design, development, and creative projects.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Color Configuration</Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Color Format</InputLabel>
                <Select
                  value={format}
                  label="Color Format"
                  onChange={(e) => setFormat(e.target.value as ColorOptions['format'])}
                >
                  {colorFormats.map((formatOption) => (
                    <MenuItem key={formatOption.value} value={formatOption.value}>
                      <Box>
                        <Typography variant="body1">{formatOption.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatOption.description} - {formatOption.example}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Hue Range: {hueRange[0]}° - {hueRange[1]}°</Typography>
                  <Slider
                    value={hueRange}
                    onChange={(_, newValue) => setHueRange(newValue as [number, number])}
                    min={0}
                    max={360}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: '0°' },
                      { value: 90, label: '90°' },
                      { value: 180, label: '180°' },
                      { value: 270, label: '270°' },
                      { value: 360, label: '360°' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Saturation Range: {saturationRange[0]}% - {saturationRange[1]}%</Typography>
                  <Slider
                    value={saturationRange}
                    onChange={(_, newValue) => setSaturationRange(newValue as [number, number])}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Lightness Range: {lightnessRange[0]}% - {lightnessRange[1]}%</Typography>
                  <Slider
                    value={lightnessRange}
                    onChange={(_, newValue) => setLightnessRange(newValue as [number, number])}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                {showAlphaControls && (
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>Alpha Range: {alphaRange[0].toFixed(1)} - {alphaRange[1].toFixed(1)}</Typography>
                    <Slider
                      value={alphaRange}
                      onChange={(_, newValue) => setAlphaRange(newValue as [number, number])}
                      min={0}
                      max={1}
                      step={0.1}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1, max: 100 }}
                    helperText="Number of colors to generate"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeNames}
                        onChange={(e) => setIncludeNames(e.target.checked)}
                      />
                    }
                    label="Include color names"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>

              {selectedFormat && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>{selectedFormat.label} Format:</strong> {selectedFormat.description}
                    <br />
                    <code>Example: {selectedFormat.example}</code>
                  </Typography>
                </Alert>
              )}

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  startIcon={<Palette />}
                >
                  Generate Colors
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleGenerate}
                  startIcon={<Refresh />}
                >
                  Regenerate
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
                    <Typography variant="h6">Generated Colors:</Typography>
                    <Button
                      size="small"
                      onClick={handleCopyAll}
                      startIcon={<ContentCopy />}
                    >
                      Copy All
                    </Button>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip 
                      label={`Format: ${result.format.toUpperCase()}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Count: ${result.quantity}`} 
                      size="small" 
                      variant="outlined" 
                    />
                    {includeNames && (
                      <Chip 
                        label="With names" 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Stack>

                  <Grid container spacing={1}>
                    {result.colors.map((color: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                          sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                          onClick={() => handleCopyColor(color.value)}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              bgcolor: color.hex,
                              border: '1px solid #ddd',
                              flexShrink: 0
                            }}
                          />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontFamily: 'monospace', 
                                fontSize: '0.875rem',
                                wordBreak: 'break-all'
                              }}
                            >
                              {color.value}
                            </Typography>
                            {includeNames && color.name && (
                              <Typography variant="caption" color="text.secondary">
                                {color.name}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyColor(color.value);
                            }}
                            title="Copy color"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Presets</Typography>
              <Stack spacing={1}>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handlePreset(preset)}
                    sx={{ 
                      textAlign: 'left', 
                      justifyContent: 'flex-start',
                      textTransform: 'none'
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {preset.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {preset.quantity} colors
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Use Cases</Typography>
              {useCases.map((useCase, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {useCase.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {useCase.description}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ColorGenerator;
