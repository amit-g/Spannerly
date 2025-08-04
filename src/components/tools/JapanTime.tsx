import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { Refresh, Schedule } from '@mui/icons-material';
import { BrowserDateTimeService } from '@/services';

const timezones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

export const JapanTime: React.FC = () => {
  const [japanTime, setJapanTime] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState('');
  const dateTimeService = new BrowserDateTimeService();

  const updateJapanTime = () => {
    const time = dateTimeService.getTimeInJapan();
    setJapanTime(time);
  };

  const updateConvertedTime = () => {
    const now = new Date();
    const timeInTimezone = new Intl.DateTimeFormat('en-US', {
      timeZone: selectedTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now);
    setConvertedTime(timeInTimezone);
  };

  useEffect(() => {
    updateJapanTime();
    updateConvertedTime();
    const interval = setInterval(() => {
      updateJapanTime();
      updateConvertedTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  const handleTimezoneChange = (event: any) => {
    setSelectedTimezone(event.target.value);
  };

  const handleRefresh = () => {
    updateJapanTime();
    updateConvertedTime();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Schedule />
        Japan Time
      </Typography>
      
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" component="div" sx={{ mb: 1, fontFamily: 'monospace' }}>
          {japanTime.split(' ')[1] || '--:--:--'}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {japanTime.split(' ')[0] || '----/--/--'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Japan Standard Time (JST)
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          startIcon={<Refresh />}
          sx={{ mt: 2 }}
        >
          Refresh
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Compare with Other Timezones
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Timezone</InputLabel>
            <Select
              value={selectedTimezone}
              label="Select Timezone"
              onChange={handleTimezoneChange}
            >
              {timezones.map((timezone) => (
                <MenuItem key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Current Time"
            value={convertedTime}
            InputProps={{
              readOnly: true,
            }}
            sx={{ '& input': { fontFamily: 'monospace' } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" color="info.contrastText">
          <strong>Time Difference:</strong> Times update automatically every second
        </Typography>
      </Box>
    </Paper>
  );
};
