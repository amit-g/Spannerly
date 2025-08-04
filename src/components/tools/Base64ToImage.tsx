import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { ContentCopy, Image as ImageIcon } from '@mui/icons-material';
import { BrowserImageService } from '@/services';

export const Base64ToImage: React.FC = () => {
  const [base64Input, setBase64Input] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [error, setError] = useState('');
  const imageService = new BrowserImageService();

  const handleBase64Change = (value: string) => {
    setBase64Input(value);
    
    if (!value.trim()) {
      setImageDataUrl('');
      setError('');
      return;
    }

    try {
      const dataUrl = imageService.base64ToImage(value.trim());
      setImageDataUrl(dataUrl);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Invalid Base64 string');
      setImageDataUrl('');
    }
  };

  const handleCopyDataUrl = async () => {
    if (imageDataUrl) {
      try {
        await navigator.clipboard.writeText(imageDataUrl);
      } catch (err) {
        console.error('Failed to copy data URL:', err);
      }
    }
  };

  const handleDownload = () => {
    if (imageDataUrl) {
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'converted-image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ImageIcon />
        Base64 to Image Converter
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Base64 String"
            value={base64Input}
            onChange={(e: any) => handleBase64Change(e.target.value)}
            placeholder="Paste your Base64 string here..."
            error={!!error}
            helperText={error || 'Enter a Base64 encoded image string'}
          />
        </Grid>
        
        {imageDataUrl && (
          <Grid item xs={12}>
            <Box sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Preview</Typography>
                <Box>
                  <Tooltip title="Copy Data URL">
                    <IconButton onClick={handleCopyDataUrl} size="small">
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Image">
                    <IconButton onClick={handleDownload} size="small">
                      <ImageIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <img
                  src={imageDataUrl}
                  alt="Converted from Base64"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  onError={() => setError('Failed to load image')}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Data URL: {imageDataUrl.substring(0, 50)}...
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
        
        {!imageDataUrl && !error && base64Input && (
          <Grid item xs={12}>
            <Alert severity="info">
              Processing Base64 string...
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
