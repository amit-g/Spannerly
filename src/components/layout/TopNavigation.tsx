import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import { SpannerlyIcon } from '@/components/icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedCategory, setSearchQuery } from '@/store/toolsSlice';
import { ThemeSettings } from '@/components/common/ThemeSettings';
import { ToolCategory } from '@/types';

const categoryLabels = {
  [ToolCategory.CALCULATORS]: 'Calculators',
  [ToolCategory.UNIT_CONVERTERS]: 'Unit Converters',
  [ToolCategory.CONVERTERS]: 'Converters',
  [ToolCategory.VALIDATORS]: 'Validators',
  [ToolCategory.BEAUTIFIERS]: 'Beautifiers',
  [ToolCategory.MINIFIERS]: 'Minifiers',
  [ToolCategory.CRYPTOGRAPHY]: 'Cryptography',
  [ToolCategory.RANDOM_GENERATORS]: 'Random Generators',
  [ToolCategory.STRING_UTILITIES]: 'String Utilities',
  [ToolCategory.MISCELLANEOUS]: 'Miscellaneous',
};

export const TopNavigation: React.FC = () => {
  const selectedCategory = useAppSelector((state: any) => state.tools.selectedCategory);
  const searchQuery = useAppSelector((state: any) => state.tools.searchQuery);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const updateUrlWithCategory = (category: ToolCategory | null) => {
    if (!router.isReady) return;
    
    const currentQuery = { ...router.query };
    
    // Clear subcategory when changing category
    delete currentQuery.subcategory;
    
    if (category) {
      currentQuery.category = category.toLowerCase().replace('_', '-');
    } else {
      delete currentQuery.category;
    }
    
    router.replace(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string | null) => {
    const category = newValue as ToolCategory | null;
    dispatch(setSelectedCategory(category));
    updateUrlWithCategory(category);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (category: ToolCategory | null) => {
    dispatch(setSelectedCategory(category));
    updateUrlWithCategory(category);
    handleMenuClose();
  };

  const handleLogoClick = () => {
    // Clear all filters and navigate to home
    dispatch(setSelectedCategory(null));
    dispatch(setSearchQuery(''));
    router.push('/');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const categories = [
    ToolCategory.CALCULATORS,
    ToolCategory.UNIT_CONVERTERS,
    ToolCategory.CONVERTERS,
    ToolCategory.VALIDATORS,
    ToolCategory.BEAUTIFIERS,
    ToolCategory.MINIFIERS,
    ToolCategory.CRYPTOGRAPHY,
    ToolCategory.RANDOM_GENERATORS,
    ToolCategory.STRING_UTILITIES,
    ToolCategory.MISCELLANEOUS,
  ];

  // Determine how many tabs to show based on screen size
  const maxVisibleTabs = isMobile ? 1 : 3; // Show 1 on mobile, 3 on desktop
  const visibleCategories = categories.slice(0, maxVisibleTabs);
  const allCategories = categories; // Hamburger menu shows all categories

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: '64px !important' }}>
          {/* Logo and Spannerly Title - Left Side */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 3,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={handleLogoClick}
          >
            <SpannerlyIcon size="medium" sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Spannerly
            </Typography>
          </Box>

          {/* Hamburger Menu */}
          <IconButton
            color="inherit"
            aria-label="all categories"
            aria-controls={open ? 'category-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Category Tabs - Center Left */}
          <Tabs
            value={selectedCategory || false}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            variant="standard"
            sx={{ mr: 2 }}
          >
            <Tab label="All Tools" value={null} />
            {visibleCategories.map((category: ToolCategory) => (
              <Tab
                key={category}
                label={categoryLabels[category]}
                value={category}
              />
            ))}
          </Tabs>
          
          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Search Field - Right Side */}
          <TextField
            size="small"
            placeholder="Search tools..."
            value={searchQuery || ''}
            onChange={handleSearchChange}
            sx={{
              mr: 2,
              minWidth: isMobile ? 120 : 200,
              '& .MuiOutlinedInput-root': {
                color: 'inherit',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'secondary.main',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <ThemeSettings />
        </Toolbar>
        
        {/* Hamburger Menu Items */}
        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'all-categories-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem
            onClick={() => handleMenuItemClick(null)}
            selected={selectedCategory === null}
          >
            All Tools
          </MenuItem>
          {allCategories.map((category: ToolCategory) => (
            <MenuItem
              key={category}
              onClick={() => handleMenuItemClick(category)}
              selected={selectedCategory === category}
            >
              {categoryLabels[category]}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </AppBar>
  );
};
