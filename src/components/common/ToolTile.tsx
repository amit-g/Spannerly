import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Icon,
  Stack,
} from '@mui/material';
import { Tool } from '@/types';

interface ToolTileProps {
  tool: Tool;
  onOpen: (tool: Tool) => void;
}

export const ToolTile: React.FC<ToolTileProps> = ({ tool, onOpen }) => {
  const handleOpen = () => {
    onOpen(tool);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2">
            {tool.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {tool.description}
        </Typography>

        {/* Category and Subcategory */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={tool.category.replace('-', ' ')} 
            size="small" 
            variant="outlined"
            color="primary"
          />
          {tool.subcategory && (
            <Chip 
              label={tool.subcategory} 
              size="small" 
              variant="outlined"
              color="secondary"
            />
          )}
        </Stack>

        {/* Capabilities */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {tool.capabilities.slice(0, 3).map((capability) => (
            <Chip
              key={capability}
              label={capability}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          ))}
          {tool.capabilities.length > 3 && (
            <Chip
              label={`+${tool.capabilities.length - 3} more`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: '20px' }}
            />
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          onClick={handleOpen} 
          variant="contained"
          fullWidth
          sx={{ textTransform: 'none' }}
        >
          Open Tool
        </Button>
      </CardActions>
    </Card>
  );
};
