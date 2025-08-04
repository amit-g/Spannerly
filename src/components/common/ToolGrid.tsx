import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ToolTile } from '@/components/common/ToolTile';
import { useAppSelector } from '@/store/hooks';
import { Tool, ToolSubcategories, ToolCategory } from '@/types';

interface ToolGridProps {
  onToolOpen: (tool: Tool) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ onToolOpen }) => {
  const { tools, selectedCategory, searchQuery } = useAppSelector((state: any) => state.tools);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const router = useRouter();

  // Sync subcategory with URL and validate against current category
  useEffect(() => {
    if (!router.isReady) return;
    
    const { subcategory } = router.query;
    const availableSubcategories = selectedCategory && selectedCategory in ToolSubcategories 
      ? ToolSubcategories[selectedCategory as keyof typeof ToolSubcategories] 
      : [];
    
    if (subcategory && typeof subcategory === 'string') {
      // Check if subcategory is valid for current category
      if (selectedCategory && availableSubcategories.includes(subcategory)) {
        // Valid subcategory for current category
        if (subcategory !== selectedSubcategory) {
          setSelectedSubcategory(subcategory);
        }
      } else {
        // Invalid subcategory for current category - clear it
        setSelectedSubcategory('');
        updateSubcategoryInUrl('');
      }
    } else if (!subcategory && selectedSubcategory) {
      setSelectedSubcategory('');
    }
  }, [router.isReady, router.query.subcategory, selectedSubcategory, selectedCategory]);

  // Update URL when subcategory changes
  const updateSubcategoryInUrl = (subcategory: string) => {
    if (!router.isReady) return;
    
    const currentQuery = { ...router.query };
    
    if (subcategory) {
      currentQuery.subcategory = subcategory;
    } else {
      delete currentQuery.subcategory;
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

  const filteredTools = tools.filter((tool: Tool) => {
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || tool.subcategory === selectedSubcategory;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.capabilities.some((cap: string) => cap.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const availableSubcategories = selectedCategory && selectedCategory in ToolSubcategories 
    ? ToolSubcategories[selectedCategory as keyof typeof ToolSubcategories] 
    : [];

  const handleSubcategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newSubcategory: string | null,
  ) => {
    const subcategory = newSubcategory || '';
    setSelectedSubcategory(subcategory);
    updateSubcategoryInUrl(subcategory);
  };

  // Reset subcategory when category changes
  React.useEffect(() => {
    setSelectedSubcategory('');
    updateSubcategoryInUrl('');
  }, [selectedCategory]);

  if (filteredTools.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Tools Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No tools match your current search criteria. Try adjusting your filters or search terms.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Subcategory Filter */}
      {selectedCategory && availableSubcategories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Subcategories
          </Typography>
          <ToggleButtonGroup
            value={selectedSubcategory || null}
            exclusive
            onChange={handleSubcategoryChange}
            aria-label="subcategory filter"
            sx={{ 
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                mb: 1,
                textTransform: 'none',
                borderRadius: 2,
                px: 2,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
            }}
          >
            <ToggleButton value="" aria-label="all subcategories">
              All
            </ToggleButton>
            {availableSubcategories.map((subcategory: string) => (
              <ToggleButton key={subcategory} value={subcategory} aria-label={subcategory}>
                {subcategory}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Tool Count and Selected Filters */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" color="text.secondary">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
          </Typography>
          {selectedCategory && (
            <Chip 
              label={selectedCategory.replace('-', ' ')} 
              size="small" 
              variant="outlined" 
            />
          )}
          {selectedSubcategory && (
            <Chip 
              label={selectedSubcategory} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Stack>
      </Box>

      {/* Tools Grid */}
      <Grid container spacing={3}>
        {filteredTools.map((tool: Tool) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
            <ToolTile tool={tool} onOpen={onToolOpen} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
