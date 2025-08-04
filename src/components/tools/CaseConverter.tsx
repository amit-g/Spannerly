import React, { useState } from 'react';
import {
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { BrowserTextService } from '@/services';
import { CaseType } from '@/types/services';

const caseTypeLabels = {
  [CaseType.UPPER]: 'UPPERCASE',
  [CaseType.LOWER]: 'lowercase',
  [CaseType.TITLE]: 'Title Case',
  [CaseType.CAMEL]: 'camelCase',
  [CaseType.PASCAL]: 'PascalCase',
  [CaseType.SNAKE]: 'snake_case',
  [CaseType.KEBAB]: 'kebab-case',
};

export const CaseConverter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>(CaseType.UPPER);
  const textService = new BrowserTextService();

  const convertedText = inputText ? textService.convertCase(inputText, selectedCaseType) : '';

  const handleCopy = async () => {
    if (convertedText) {
      try {
        await navigator.clipboard.writeText(convertedText);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const caseTypes = [
    CaseType.UPPER,
    CaseType.LOWER,
    CaseType.TITLE,
    CaseType.CAMEL,
    CaseType.PASCAL,
    CaseType.SNAKE,
    CaseType.KEBAB,
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Case Converter
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Input Text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to convert..."
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Case Type</InputLabel>
            <Select
              value={selectedCaseType}
              label="Case Type"
              onChange={(e) => setSelectedCaseType(e.target.value as CaseType)}
            >
              {caseTypes.map((caseType: CaseType) => (
                <MenuItem key={caseType} value={caseType}>
                  {caseTypeLabels[caseType]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Converted Text"
              value={convertedText}
              InputProps={{
                readOnly: true,
              }}
            />
            {convertedText && (
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
