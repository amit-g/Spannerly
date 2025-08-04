import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { UnitDefinition, UnitConverterProps } from './types';

export const BaseUnitConverter: React.FC<UnitConverterProps> = ({
  title,
  units,
  defaultFromUnit,
  defaultToUnit,
  precision = 6,
}) => {
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>(defaultFromUnit || units[0]?.abbreviation || '');
  const [toUnit, setToUnit] = useState<string>(defaultToUnit || units[1]?.abbreviation || units[0]?.abbreviation || '');

  const findUnit = (abbreviation: string): UnitDefinition | undefined => {
    return units.find(unit => unit.abbreviation === abbreviation);
  };

  const convertValue = (value: string, from: string, to: string): string => {
    if (!value || isNaN(Number(value))) return '';
    
    const numValue = Number(value);
    const fromUnitDef = findUnit(from);
    const toUnitDef = findUnit(to);
    
    if (!fromUnitDef || !toUnitDef) return '';
    
    // Convert to base unit first, then to target unit
    const baseValue = fromUnitDef.toBase(numValue);
    const convertedValue = toUnitDef.fromBase(baseValue);
    
    // Round to specified precision and remove trailing zeros
    return Number(convertedValue.toPrecision(precision)).toString();
  };

  const handleFromValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFromValue(value);
    
    if (value && !isNaN(Number(value))) {
      const converted = convertValue(value, fromUnit, toUnit);
      setToValue(converted);
    } else {
      setToValue('');
    }
  };

  const handleToValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setToValue(value);
    
    if (value && !isNaN(Number(value))) {
      const converted = convertValue(value, toUnit, fromUnit);
      setFromValue(converted);
    } else {
      setFromValue('');
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  // Update conversion when units change
  useEffect(() => {
    if (fromValue && !isNaN(Number(fromValue))) {
      const converted = convertValue(fromValue, fromUnit, toUnit);
      setToValue(converted);
    }
  }, [fromUnit, toUnit]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {title}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Grid container spacing={3} alignItems="center">
          {/* From Section */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                From
              </Typography>
              <TextField
                fullWidth
                label="Value"
                value={fromValue}
                onChange={handleFromValueChange}
                type="number"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Unit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                variant="outlined"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.abbreviation} value={unit.abbreviation}>
                    {unit.name} ({unit.abbreviation})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>

          {/* Swap Button */}
          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <IconButton
              onClick={handleSwapUnits}
              color="primary"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <SwapHorizIcon />
            </IconButton>
          </Grid>

          {/* To Section */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h6" gutterBottom>
                To
              </Typography>
              <TextField
                fullWidth
                label="Value"
                value={toValue}
                onChange={handleToValueChange}
                type="number"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Unit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                variant="outlined"
              >
                {units.map((unit) => (
                  <MenuItem key={unit.abbreviation} value={unit.abbreviation}>
                    {unit.name} ({unit.abbreviation})
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Quick Reference */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Reference
          </Typography>
          <Grid container spacing={2}>
            {units.map((unit) => (
              <Grid item xs={6} sm={4} md={3} key={unit.abbreviation}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    setFromUnit(unit.abbreviation);
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {unit.abbreviation}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {unit.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
