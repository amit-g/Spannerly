import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import { BrowserMeasurementService } from '@/services';

export const DistanceConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const measurementService = new BrowserMeasurementService();

  const handleConvert = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      try {
        if (activeTab === 0) {
          // Miles to KM
          const result = measurementService.milesToKm(numValue);
          setOutputValue(result.toString());
        } else {
          // KM to Miles
          const result = measurementService.kmToMiles(numValue);
          setOutputValue(result.toString());
        }
      } catch (error) {
        setOutputValue('Error');
      }
    } else {
      setOutputValue('');
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleConvert(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setInputValue('');
    setOutputValue('');
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Distance Converter
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Miles to Kilometers" />
          <Tab label="Kilometers to Miles" />
        </Tabs>
      </Box>
      
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            type="number"
            label={activeTab === 0 ? 'Miles' : 'Kilometers'}
            value={inputValue}
            onChange={(e: any) => handleInputChange(e.target.value)}
            inputProps={{ min: 0, step: 'any' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {activeTab === 0 ? 'mi' : 'km'}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={2} textAlign="center">
          <Typography variant="h6">=</Typography>
        </Grid>
        
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label={activeTab === 0 ? 'Kilometers' : 'Miles'}
            value={outputValue}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {activeTab === 0 ? 'km' : 'mi'}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
