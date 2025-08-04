import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Box,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
} from '@mui/material';
import { Palette, LightMode, DarkMode } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setThemeMode, setColorScheme, toggleThemeMode } from '@/store/themeSlice';
import { themePresets } from '@/utils/theme';

export const ThemeSettings: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { mode, colorScheme } = useAppSelector((state: any) => state.theme);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeToggle = () => {
    dispatch(toggleThemeMode());
  };

  const handleColorSchemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setColorScheme(event.target.value as any));
  };

  const handlePresetSelect = (preset: typeof themePresets[0]) => {
    dispatch(setThemeMode(preset.mode));
    dispatch(setColorScheme(preset.colorScheme));
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Theme Settings">
        <IconButton
          onClick={handleClick}
          sx={{ ml: 1 }}
          color="inherit"
        >
          <Palette />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 280, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          
          {/* Dark Mode Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {mode === 'light' ? <LightMode /> : <DarkMode />}
              <Typography>Dark Mode</Typography>
            </Box>
            <Switch
              checked={mode === 'dark'}
              onChange={handleModeToggle}
              size="small"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Color Scheme Selection */}
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Color Scheme
            </FormLabel>
            <RadioGroup
              value={colorScheme}
              onChange={handleColorSchemeChange}
            >
              <FormControlLabel value="blue" control={<Radio size="small" />} label="Blue" />
              <FormControlLabel value="green" control={<Radio size="small" />} label="Green" />
              <FormControlLabel value="purple" control={<Radio size="small" />} label="Purple" />
              <FormControlLabel value="orange" control={<Radio size="small" />} label="Orange" />
              <FormControlLabel value="red" control={<Radio size="small" />} label="Red" />
            </RadioGroup>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          {/* Quick Presets */}
          <Typography variant="subtitle2" gutterBottom>
            Quick Presets
          </Typography>
          <Box sx={{ maxHeight: 120, overflowY: 'auto' }}>
            {themePresets.map((preset, index) => (
              <MenuItem
                key={index}
                onClick={() => handlePresetSelect(preset)}
                selected={preset.mode === mode && preset.colorScheme === colorScheme}
                sx={{ fontSize: '0.875rem', py: 0.5 }}
              >
                {preset.name}
              </MenuItem>
            ))}
          </Box>
        </Box>
      </Menu>
    </>
  );
};
