import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { BrowserTextService } from '@/services';

export const Base64Converter: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const textService = new BrowserTextService();

  const handleEncode = (text: string) => {
    try {
      const encoded = textService.encodeBase64(text);
      setOutputText(encoded);
      setError('');
    } catch (err) {
      setError('Failed to encode text');
      setOutputText('');
    }
  };

  const handleDecode = (text: string) => {
    try {
      const decoded = textService.decodeBase64(text);
      setOutputText(decoded);
      setError('');
    } catch (err) {
      setError('Invalid Base64 string');
      setOutputText('');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text) {
      if (activeTab === 0) {
        handleEncode(text);
      } else {
        handleDecode(text);
      }
    } else {
      setOutputText('');
      setError('');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleCopy = async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Base64 Converter
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Encode" />
          <Tab label="Decode" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={activeTab === 0 ? 'Text to Encode' : 'Base64 to Decode'}
            value={inputText}
            onChange={(e: any) => handleInputChange(e.target.value)}
            placeholder={activeTab === 0 ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={activeTab === 0 ? 'Encoded Base64' : 'Decoded Text'}
              value={outputText}
              error={!!error}
              helperText={error}
              InputProps={{
                readOnly: true,
              }}
            />
            {outputText && (
              <Tooltip title="Copy to clipboard">
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                  onClick={handleCopy}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
