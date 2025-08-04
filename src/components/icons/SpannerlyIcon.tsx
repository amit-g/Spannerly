import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { getAssetPath } from '../../utils/assetPath';

/**
 * Custom Spannerly Logo Icon
 * Uses a PNG image file for the logo
 */
interface SpannerlyIconProps extends Omit<BoxProps, 'component'> {
  size?: 'small' | 'medium' | 'large' | string; // Add size prop for easy scaling
}

export const SpannerlyIcon: React.FC<SpannerlyIconProps> = ({ sx, size = 'medium', ...props }) => {
  // Define size mappings
  const sizeMap = {
    small: '2rem',   // 32px
    medium: '3rem',  // 48px  
    large: '4rem',   // 64px
  };
  
  const iconSize = typeof size === 'string' && size in sizeMap 
    ? sizeMap[size as keyof typeof sizeMap] 
    : size; // Use custom size if provided

  // Use utility function to get proper asset path for GitHub Pages deployment
  const iconPath = getAssetPath('/icons/spannerly-logo.png');

  return (
    <Box
      component="img"
      src={iconPath}
      alt="Spannerly Logo"
      sx={{
        width: iconSize,
        height: iconSize,
        objectFit: 'contain',
        display: 'block',
        ...sx,
      }}
      {...props}
    />
  );
};
